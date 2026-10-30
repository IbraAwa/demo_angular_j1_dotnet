import { Component } from '@angular/core';
import { NgModel } from '../ng-model/ng-model';
import { FormControlDemo } from './form-control-demo/form-control-demo';
import { FormGroupDemo } from './form-group-demo/form-group-demo';
import { FormArrayDemo } from './form-array-demo/form-array-demo';

@Component({
  imports: [NgModel, FormControlDemo, FormGroupDemo, FormArrayDemo],
  selector: 'app-reactive-form-demo',
  styleUrl: './reactive-form-demo.scss',
  templateUrl: './reactive-form-demo.html',
})
export class ReactiveFormDemo {}
