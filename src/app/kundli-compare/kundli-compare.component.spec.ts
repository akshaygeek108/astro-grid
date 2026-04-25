import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KundliCompareComponent } from './kundli-compare.component';

describe('KundliCompareComponent', () => {
  let component: KundliCompareComponent;
  let fixture: ComponentFixture<KundliCompareComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KundliCompareComponent]
    });
    fixture = TestBed.createComponent(KundliCompareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
