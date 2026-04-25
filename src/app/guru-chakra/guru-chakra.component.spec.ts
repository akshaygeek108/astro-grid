import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuruChakraComponent } from './guru-chakra.component';

describe('GuruChakraComponent', () => {
  let component: GuruChakraComponent;
  let fixture: ComponentFixture<GuruChakraComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GuruChakraComponent]
    });
    fixture = TestBed.createComponent(GuruChakraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
