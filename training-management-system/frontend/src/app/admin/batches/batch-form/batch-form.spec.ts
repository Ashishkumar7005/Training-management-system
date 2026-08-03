import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchFormComponent } from './batch-form';

describe('BatchForm', () => {
  let component: BatchFormComponent;
  let fixture: ComponentFixture<BatchFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BatchFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BatchFormComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
