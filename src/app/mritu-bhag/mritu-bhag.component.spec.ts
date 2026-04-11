import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MrituBhagComponent } from './mritu-bhag.component';

describe('MrituBhagComponent', () => {
  let component: MrituBhagComponent;
  let fixture: ComponentFixture<MrituBhagComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MrituBhagComponent]
    });
    fixture = TestBed.createComponent(MrituBhagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
