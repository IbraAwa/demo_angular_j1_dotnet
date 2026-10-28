import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [FormsModule],
  selector: 'app-signal-demo',
  styleUrl: './signal-demo.scss',
  templateUrl: './signal-demo.html',
})

// un signal = une boîte qui contient une valeur à l'intérieur
// quand on change la valeur, le changement se propage à ceux qui écoutent le signal
export class SignalDemo {
  compteur = signal<number>(0)

  eleves = signal<string[]>(["Alice", "Bob"])
  nouveauEleve = signal<string>('')

  // computed
  // À chaque fois que ton signal émet un event donc propage un changement
  // le computed refait un calcul dessus
  nombreEleves = computed(() => this.eleves().length) // 2 -> changement => 3 le computed recalcule la longueur


  // FIGÉ : une fois qu'on a mis la taille, même si le tableau change de taille
  // on garde sa taille initiale dans la variable
  nombreElevesSansComputed : number = this.eleves().length // aucun abonnement au changement du signal eleves

  AjouterEleve() : void {
    // un signal de tableau capte/détecte un nouvel événement que si la référence change
    // quand vous modifiez le contenu du tableau (push...) le signal ne détecte aucun changement
    // MAUVAIS : this.eleves().push(this.nouveauEleve()) => même tableau, même référence, le signal ne sonne pas

    // ETAPE 1
    // récupération de la liste via (list) et création d'un nouveau tableau pour une nouvelle référence
    // [] après le =>
    //this.eleves.update((list) => [] )

    // ETAPE 2
    // rajouter les éléments déjà présents dans l'ancienne liste dans le nouveau
    // spread ...list qui permet de recopier les anciens élèves de l'ancienne liste dans la nouvelle
    //this.eleves.update((list) => [...list])

    // ETAPE 3
    // rajouter le nouvel élève après avoir ajouté les anciens élèves
    this.eleves.update((list) => [...list, this.nouveauEleve()])
  }

}
