import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { validate } from '@angular/forms/signals';
import { confirmePassword, contientMajuscule } from './validator-custom-demo';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-form-validator-demo',
  styleUrl: './form-validator-demo.scss',
  templateUrl: './form-validator-demo.html',
})
export class FormValidatorDemo {
  fb = inject(FormBuilder) // fb = formBuilder

  formulaire =  this.fb.group(
  {
    mdp: ['', [Validators.required, contientMajuscule, Validators.minLength(4)]],
    confirmer: ['', [Validators.required, contientMajuscule, Validators.minLength(4)]]
  },
  {
    validators: [confirmePassword]
  }
  )

  slt() {
    this.formulaire.controls.mdp
  }
}
