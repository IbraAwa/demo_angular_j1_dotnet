import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-form-control-demo',
  styleUrl: './form-control-demo.scss',
  templateUrl: './form-control-demo.html',
})
export class FormControlDemo {
}
