import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { formGroupModel } from './form-group-model';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-form-group-demo',
  styleUrl: './form-group-demo.scss',
  templateUrl: './form-group-demo.html',
})
export class FormGroupDemo {
  // va nous permettre de construire notre formulaire
  formBuilder = inject(FormBuilder).nonNullable
  dto = signal<formGroupModel | null>(null)

  formulaire = this.formBuilder.group({
    // j'ai mes key passer dans mon html
    nom: new FormControl('', [Validators.required]),
    age: ['', [Validators.required, Validators.min(18)]],
    adress: this.formBuilder.group({
      rue: ['', [Validators.required]],
      numero: [0, [Validators.required, Validators.min(0)]]
    })
  })

  get formulaireAdress() {
    return this.formulaire.controls.adress.controls
  }

  envoyer() {
    console.log(this.formulaireAdress.numero)
  }
}
