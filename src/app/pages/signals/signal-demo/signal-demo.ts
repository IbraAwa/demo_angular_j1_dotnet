import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [FormsModule],
  selector: 'app-signal-demo',
  styleUrl: './signal-demo.scss',
  templateUrl: './signal-demo.html',
})

// un signale une boite qui à l'intérieur contient une valeur
// quand on le change la valeur se propage a ceux qui écoute le signal
export class SignalDemo {
  compteur = signal<number>(0)

  eleves = signal<string[]>(["Alice", "Bob"])
  nouveauEleve = signal<string>('')

  // computed
  // A chaque fois que ton signale émet un event donc proprage un changement
  // le computed refait un calcule dessus
  nombreEleves = computed(() => this.eleves().length) // 2 -> changement => 3 le computed recalcule la longueur


  // FIGER une fois qu'on a mis la taille même si le tableau change de taille
  // on garde sa taille initiale dans la variable
  nombreElevesSansComputed : number = this.eleves().length // aucun abonnement au changement du signal eleves

  AjouterEleve() : void {
    // un signal de tableau capte/detecte un nouveau evenement que si la reférence change
    // quand vous modifier la valeur du tableau le signal ne détecte aucun changement
    // MAUVAIS : this.eleves.push(this.nouveEleve())

    // ETAPE 1
    // récupération de la list via (list) et création d'un nouveau tableau pour une new référence
    // [] après le =>
    //this.eleves.update((list) => [] )

    // ETAPE 2
    // rajouter les élément déjà présent dans l'ancienne liste dans le nouveau
    // spread ...List qui permet de rajouter les ancien élèves dans l'ancienne liste dans la nouvelle
    //this.eleves.update((list) => [...list])

    // ETAPE 3
    // rajouter le nouveau éleve après avoir ajouter les ancien élèves
    this.eleves.update((list) => [...list, this.nouveauEleve()])
  }

}
