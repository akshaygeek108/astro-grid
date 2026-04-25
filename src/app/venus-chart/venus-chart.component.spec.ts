import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VenusChartComponent } from './venus-chart.component';

describe('VenusChartComponent', () => {
  let component: VenusChartComponent;
  let fixture: ComponentFixture<VenusChartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VenusChartComponent]
    });
    fixture = TestBed.createComponent(VenusChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
