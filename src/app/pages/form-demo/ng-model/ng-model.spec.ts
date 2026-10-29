import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgModel } from './ng-model';

describe('NgModel', () => {
  let component: NgModel;
  let fixture: ComponentFixture<NgModel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgModel],
    }).compileComponents();

    fixture = TestBed.createComponent(NgModel);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
