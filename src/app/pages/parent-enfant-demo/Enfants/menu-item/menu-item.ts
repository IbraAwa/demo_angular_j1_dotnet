import { Component, input, output } from '@angular/core';
import { Plat } from '../../plat.model';

@Component({
  imports: [],
  selector: 'app-menu-item',
  styleUrl: './menu-item.scss',
  templateUrl: './menu-item.html',
})

// objectif de l'enfant
// Afficher les informations du plat (nom, prix, végétarien ou non et la description) sous forme de card
export class MenuItem {
 //input permet de mettre dans une balise le nom de la variable et la valeur transmise
 //required car l'enfant est obligé d'avoir un plat pour pouvoir faire un affichage
 // exemple : le parent restaurant component va faire dans son HTML
 // <app-menu-item [nimporteQuoi]="plat">
 //la variable [nimporteQuoi] a le même nom que la variable dans l'enfant menu ITEM
 //quand on met [] => on envoie une information

 //nimporteQuoi = input.required<Plat>()

 // required = quand la balise <app-menu-item> est utilisée elle attend forcément l'input/la variable plat
 plat = input.required<Plat>(); // input se crée en signal donc plat() pour accéder à la valeur


 //output permet de mettre dans la balise du parent le nom de l'output/la variable et l'événement qu'on veut recevoir
 // exemple : le parent restaurant.html <app-menu-item (platAjouter)="plat">
 // la variable (platAjouter) car () => Reçoit une information
 // DISCLAIMER : c'est un exemple simplifié ! Dans un output on ne met PAS une valeur ("plat")
 // on met CE QUE DOIT FAIRE le parent quand l'event arrive + $event en paramètre (= ce que l'enfant a émis), et c'est tout
 // le vrai code du parent : <app-menu-item (platAjouter)="AjouterCommande($event)">
 platAjouter = output<Plat>();

 AjouterACommande(plat : Plat) : void {
  this.platAjouter.emit(plat)
 }
}
