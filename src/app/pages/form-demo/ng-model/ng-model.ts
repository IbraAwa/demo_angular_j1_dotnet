import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [FormsModule],
  selector: 'app-ng-model',
  styleUrl: './ng-model.scss',
  templateUrl: './ng-model.html',
})
export class NgModel {
  nom = signal<string>('')
  email = signal<string>('')
}
