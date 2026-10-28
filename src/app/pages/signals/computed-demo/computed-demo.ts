import { Component, computed, signal } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-computed-demo',
  styleUrl: './computed-demo.scss',
  templateUrl: './computed-demo.html',
})

// un computed a une valeur calculée
// mais qui ne peut pas être changée à la main via un set ou un update
export class ComputedDemo {
  prix = signal<number>(10)
  quantite = signal<number>(1)

  // computed permet de recalculer à chaque fois que l'un des signaux change
  // si le signal est un number ou un string c'est via sa valeur, si c'est un array c'est via sa référence
  // si le prix change, computed est rappelé et réassigne une nouvelle valeur à total
  // si la quantité change, computed est rappelé et réassigne une nouvelle valeur à total
  // si les deux changent, même chose
  // en LISANT le signal (this.prix()) dans la fonction de computed(...) tu abonnes computed
  // automatiquement à ce signal, dans notre cas prix et quantité
  total = computed(() => this.prix() * this.quantite())
  // this.prix() * this.quantite() renvoie un nombre
  // automatiquement le computed va mettre notre variable avec le type qu'il renvoie
  // donc un nombre donc total est de type signal<number>


  // computed va mettre notre variable "EstLivraisonGratuite" en boolean car
  // this.total() >= 50 renvoie true ou false donc un boolean
  EstLivraisonGratuite = computed(() =>  this.total() >= 50)


  // computed va mettre notre "livraisonGratuite" en string car
  // il vérifie si total est supérieur ou égal à 50
  // et selon le boolean il renvoie un string
  // "Livraison gratuite" ou un string "Livraison payante"
  // donc computed va mettre notre variable de type string
  livraisonGratuite = computed(() =>  this.total() >= 50 ? "Livraison gratuite" : "Livraison payante")


  augmenter() {
    this.quantite.update(q => q + 1)
  }

  diminuer() {
    if(this.quantite() <= 1) return;

    this.quantite.update(q => q - 1)
  }

}
