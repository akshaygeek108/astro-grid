import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuryaChakraChartComponent } from './surya-chakra-chart.component';

describe('SuryaChakraChartComponent', () => {
  let component: SuryaChakraChartComponent;
  let fixture: ComponentFixture<SuryaChakraChartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SuryaChakraChartComponent]
    });
    fixture = TestBed.createComponent(SuryaChakraChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
