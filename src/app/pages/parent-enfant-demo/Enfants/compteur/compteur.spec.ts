import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Compteur } from './compteur';

describe('Compteur', () => {
  let component: Compteur;
  let fixture: ComponentFixture<Compteur>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Compteur],
    }).compileComponents();

    fixture = TestBed.createComponent(Compteur);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
