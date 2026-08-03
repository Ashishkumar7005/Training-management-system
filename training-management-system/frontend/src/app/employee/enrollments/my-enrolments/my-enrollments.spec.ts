import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyEnrolments } from './my-enrollments';

describe('MyEnrolments', () => {
  let component: MyEnrolments;
  let fixture: ComponentFixture<MyEnrolments>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyEnrolments],
    }).compileComponents();

    fixture = TestBed.createComponent(MyEnrolments);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
