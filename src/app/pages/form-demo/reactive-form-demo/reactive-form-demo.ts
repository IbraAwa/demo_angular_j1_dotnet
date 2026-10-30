import { Component } from '@angular/core';
import { NgModel } from '../ng-model/ng-model';
import { FormControlDemo } from './form-control-demo/form-control-demo';


@Component({
  imports: [NgModel, FormControlDemo],
  selector: 'app-reactive-form-demo',
  styleUrl: './reactive-form-demo.scss',
  templateUrl: './reactive-form-demo.html',
})
export class ReactiveFormDemo {}
