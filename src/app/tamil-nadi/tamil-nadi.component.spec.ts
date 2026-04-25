import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TamilNadiComponent } from './tamil-nadi.component';

describe('TamilNadiComponent', () => {
  let component: TamilNadiComponent;
  let fixture: ComponentFixture<TamilNadiComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TamilNadiComponent]
    });
    fixture = TestBed.createComponent(TamilNadiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
