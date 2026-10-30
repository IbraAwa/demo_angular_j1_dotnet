import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-form-array-demo',
  styleUrl: './form-array-demo.scss',
  templateUrl: './form-array-demo.html',
})
export class FormArrayDemo {
  formbuilder = inject(FormBuilder).nonNullable

  formulaire = this.formbuilder.group({
    nom: ['', [Validators.required]],/*
    telephones[] : [input1, input2, input3]
     */
    telephones:
    this.formbuilder.array([this.CreateTelephoneControl()])
  })

  // mon telephones dans mon formulaire
  // je dois lui rajouter des input à la demande
  AjouterInputTelephone() {
    // on rajoute un champs/input telephone
    // DISCLAIMER : pas telephones.value.push() qui rajoute jsute une valeur dans mon tableau de valeur
    this.telephones.push(this.CreateTelephoneControl())
  }

  RetirerInputTelephone(index : number) {
    this.telephones.removeAt(index)
  }


  private CreateTelephoneControl() {
    return new FormControl('', [Validators.required, Validators.maxLength(12)])
  }

  get telephones() {
    return this.formulaire.controls.telephones
  }
}
