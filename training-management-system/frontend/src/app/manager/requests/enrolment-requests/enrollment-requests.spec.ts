import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrollmentRequestsComponent } from './enrollment-requests';

describe('EnrolmentRequests', () => {
  let component: EnrollmentRequestsComponent;
  let fixture: ComponentFixture<EnrollmentRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnrollmentRequestsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EnrollmentRequestsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
