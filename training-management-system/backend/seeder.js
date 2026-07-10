const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');
const dotenv   = require('dotenv');

dotenv.config();

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected...');

    const db = mongoose.connection.db;

    // Clear existing users
    await db.collection('users').deleteMany({});
    console.log('Cleared existing users...');

    const salt = await bcrypt.genSalt(10);

    const users = [
      {
        employeeId:  'AD-101',
        firstName:   'System',
        lastName:    'Administrator',
        age:         35,
        gender:      'Male',
        department:  'IT',
        joiningDate: new Date('2015-01-01'),
        location:    'New York',
        username:    'admin',
        password:    await bcrypt.hash('admin123', salt),
        email:       'admin@abc.com',
        role:        'admin',
        isActive:    true,
        manager:     null,
        createdAt:   new Date(),
        updatedAt:   new Date()
      },
      {
        employeeId:  'MG-01',
        firstName:   'John',
        lastName:    'Smith',
        age:         40,
        gender:      'Male',
        department:  'HR',
        joiningDate: new Date('2018-03-15'),
        location:    'New York',
        username:    'manager1',
        password:    await bcrypt.hash('manager123', salt),
        email:       'john.smith@abc.com',
        role:        'manager',
        isActive:    true,
        manager:     null,
        createdAt:   new Date(),
        updatedAt:   new Date()
      },
      {
        employeeId:  'EMP-01',
        firstName:   'Jane',
        lastName:    'Doe',
        age:         28,
        gender:      'Female',
        department:  'IT',
        joiningDate: new Date('2020-06-01'),
        location:    'New York',
        username:    'employee1',
        password:    await bcrypt.hash('employee123', salt),
        email:       'jane.doe@abc.com',
        role:        'employee',
        isActive:    true,
        manager:     null,
        createdAt:   new Date(),
        updatedAt:   new Date()
      }
    ];

    // ── Step 1: Insert users ──────────────────────────
    const insertedUsers = await db.collection('users').insertMany(users);
    console.log('Users inserted...');

    // ── Step 2: Get inserted IDs ──────────────────────
    const managerId  = insertedUsers.insertedIds[1]; // John Smith
    const employeeId = insertedUsers.insertedIds[2]; // Jane Doe

    // ── Step 3: Assign manager to employee ────────────
    await db.collection('users').updateOne(
      { _id: employeeId },
      { $set: { manager: managerId } }
    );
    console.log('Manager assigned to employee...');

    console.log('─────────────────────────────────');
    console.log('Seeding complete!');
    console.log('Admin    → admin / admin123');
    console.log('Manager  → manager1 / manager123');
    console.log('Employee → employee1 / employee123');
    console.log('Employee Jane Doe is assigned to Manager John Smith');
    console.log('─────────────────────────────────');

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

seedDB();