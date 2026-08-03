import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewBatches } from './view-batches';

describe('ViewBatches', () => {
  let component: ViewBatches;
  let fixture: ComponentFixture<ViewBatches>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewBatches],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewBatches);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
