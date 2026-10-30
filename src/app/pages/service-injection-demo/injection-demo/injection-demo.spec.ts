import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InjectionDemo } from './injection-demo';

describe('InjectionDemo', () => {
  let component: InjectionDemo;
  let fixture: ComponentFixture<InjectionDemo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InjectionDemo],
    }).compileComponents();

    fixture = TestBed.createComponent(InjectionDemo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
