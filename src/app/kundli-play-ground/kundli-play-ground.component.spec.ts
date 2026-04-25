import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KundliPlayGroundComponent } from './kundli-play-ground.component';

describe('KundliPlayGroundComponent', () => {
  let component: KundliPlayGroundComponent;
  let fixture: ComponentFixture<KundliPlayGroundComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KundliPlayGroundComponent]
    });
    fixture = TestBed.createComponent(KundliPlayGroundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
