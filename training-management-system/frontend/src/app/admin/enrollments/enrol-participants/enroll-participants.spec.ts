import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrollParticipantsComponent } from './enroll-participants';

describe('EnrolParticipants', () => {
  let component: EnrollParticipantsComponent;
  let fixture: ComponentFixture<EnrollParticipantsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnrollParticipantsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EnrollParticipantsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
