import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormValidatorDemo } from './form-validator-demo';

describe('FormValidatorDemo', () => {
  let component: FormValidatorDemo;
  let fixture: ComponentFixture<FormValidatorDemo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormValidatorDemo],
    }).compileComponents();

    fixture = TestBed.createComponent(FormValidatorDemo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
