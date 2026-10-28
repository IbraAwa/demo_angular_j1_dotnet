import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComputedDemo } from './computed-demo';

describe('ComputedDemo', () => {
  let component: ComputedDemo;
  let fixture: ComponentFixture<ComputedDemo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComputedDemo],
    }).compileComponents();

    fixture = TestBed.createComponent(ComputedDemo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
