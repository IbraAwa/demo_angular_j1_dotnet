import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  imports: [ReactiveFormsModule, JsonPipe],
  selector: 'app-form-control-demo',
  styleUrl: './form-control-demo.scss',
  templateUrl: './form-control-demo.html',
})
export class FormControlDemo {
  nom = new FormControl('',
    [ Validators.required,
      Validators.minLength(5),
      Validators.maxLength(15)
    ])

  age = new FormControl(0, [
    Validators.required,
    Validators.min(13),
    Validators.max(18)
  ])


    envoyer() {
      console.log(this.nom.value)
    }
}
