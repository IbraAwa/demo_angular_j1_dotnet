import { Component, signal } from '@angular/core';
import { Tache } from './Tache';

@Component({
  imports: [],
  selector: 'app-directive-bonus',
  styleUrl: './directive-bonus.scss',
  templateUrl: './directive-bonus.html',
})
export class DirectiveBonus {

  nameColonnes = signal<string[]> ([
    "id",
    "titre",
    "terminer",
    "priorite",
    "Action",
    "pastille de priorite"

  ])

  taches = signal<Tache[]>([
  { id: 1, titre: 'Installer Angular CLI', done: true, priorite: 'haute' },
  { id: 2, titre: 'Lire la doc du control flow', done: false, priorite: 'moyenne' },
  { id: 3, titre: 'Faire l\'exercice @for', done: false, priorite: 'haute' },
  { id: 4, titre: 'Ranger le bureau', done: false, priorite: 'basse' },
  { id: 5, titre: 'Relire le cours sur les pipes', done: true, priorite: 'moyenne' },
  ]);

  // méthode qui va lire dans le tableau taches
  // et savoir si toute les tâches sont faite ou non
  // SI oui => TRUE
  // SI non => FALSE
  EstToutTerminer() : boolean {
   return this.taches().every(tache => tache.done)
  }

  Termine(tache : Tache) {
    tache.done = true
    this.taches.update((list) => [...list])
  }
}
