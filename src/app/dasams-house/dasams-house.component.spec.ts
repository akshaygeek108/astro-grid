import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DasamsHouseComponent } from './dasams-house.component';

describe('DasamsHouseComponent', () => {
  let component: DasamsHouseComponent;
  let fixture: ComponentFixture<DasamsHouseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DasamsHouseComponent]
    });
    fixture = TestBed.createComponent(DasamsHouseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
