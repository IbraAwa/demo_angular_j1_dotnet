import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VoitureItem } from './voiture-item';

describe('VoitureItem', () => {
  let component: VoitureItem;
  let fixture: ComponentFixture<VoitureItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VoitureItem],
    }).compileComponents();

    fixture = TestBed.createComponent(VoitureItem);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
