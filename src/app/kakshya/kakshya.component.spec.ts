import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KakshyaComponent } from './kakshya.component';

describe('KakshyaComponent', () => {
  let component: KakshyaComponent;
  let fixture: ComponentFixture<KakshyaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KakshyaComponent]
    });
    fixture = TestBed.createComponent(KakshyaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
