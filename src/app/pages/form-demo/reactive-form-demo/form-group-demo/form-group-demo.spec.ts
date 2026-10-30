import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroupDemo } from './form-group-demo';

describe('FormGroupDemo', () => {
  let component: FormGroupDemo;
  let fixture: ComponentFixture<FormGroupDemo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormGroupDemo],
    }).compileComponents();

    fixture = TestBed.createComponent(FormGroupDemo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
