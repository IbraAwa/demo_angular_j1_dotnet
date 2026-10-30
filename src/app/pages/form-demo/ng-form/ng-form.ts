import { JsonPipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [FormsModule, JsonPipe],
  selector: 'app-ng-model',
  styleUrl: './ng-model.scss',
  templateUrl: './ng-model.html',
})
export class NgModel {
  nom = signal<string>('')
  email = signal<string>('')

  setValue(nomParam : string) : void {
    this.nom.set(nomParam)
  }

  envoyer() : void {
    console.log("salut")
  }
}

