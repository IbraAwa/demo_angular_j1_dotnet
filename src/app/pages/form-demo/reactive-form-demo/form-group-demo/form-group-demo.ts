import { JsonPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { formGroupModel } from './form-group-model';

@Component({
  imports: [ReactiveFormsModule, JsonPipe],
  selector: 'app-form-group-demo',
  styleUrl: './form-group-demo.scss',
  templateUrl: './form-group-demo.html',
})
export class FormGroupDemo {
  // va nous permettre de construire notre formulaire
  formBuilder = inject(FormBuilder).nonNullable
  dto = signal<formGroupModel | null>(null)

  formulaire = this.formBuilder.group({
    // mes clés sont utilisées dans mon html
    // new FormControl n'est pas concerné par le .nonNullable du formBuilder => on le précise nous-même
    nom: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    age: [0, [Validators.required, Validators.min(18)]],
    adress: this.formBuilder.group({
      rue: ['', [Validators.required]],
      numero: [0, [Validators.required, Validators.min(0)]]
    })
  })

  get formulaireAdress() {
    return this.formulaire.controls.adress.controls
  }

  envoyer() {
    // on n'envoie rien si le formulaire n'est pas valide
    if (this.formulaire.invalid) return

    // ===== Méthode 1 : on construit le DTO à la main =====
    // on choisit chaque champ un par un => pratique si les noms du formulaire
    // sont différents de ceux attendus par l'API
    const dtoManuel: formGroupModel = {
      nom: this.formulaire.controls.nom.value,
      age: this.formulaire.controls.age.value,
      adress: {
        rue: this.formulaireAdress.rue.value,
        numero: this.formulaireAdress.numero.value
      }
    }

    this.dto.set(dtoManuel)

    // ===== Méthode 2 : directement avec formulaire.value =====
    // possible car le formulaire a EXACTEMENT la même forme que le DTO
    // ⚠️ formulaire.value est typé Partial<...> (les champs disabled sont exclus)
    //    => TypeScript refuse sans le "as formGroupModel"
    const dtoValue = this.formulaire.value as formGroupModel

    // ===== Variante propre : getRawValue() =====
    // renvoie TOUS les champs (même disabled) => bien typé, pas besoin de "as"
    const dtoRaw: formGroupModel = this.formulaire.getRawValue()

    console.log(dtoManuel, dtoValue, dtoRaw)
    this.dto.set(dtoRaw)

    // on envoie ensuite le DTO au service qui fera l'appel HTTP
    // Service.GetApi(dtoRaw)
  }
}
