import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DirectiveBonus } from './directive-bonus';

describe('DirectiveBonus', () => {
  let component: DirectiveBonus;
  let fixture: ComponentFixture<DirectiveBonus>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DirectiveBonus],
    }).compileComponents();

    fixture = TestBed.createComponent(DirectiveBonus);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
