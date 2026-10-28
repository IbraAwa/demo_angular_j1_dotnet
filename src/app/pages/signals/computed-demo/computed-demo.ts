import { Component, computed, signal } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-computed-demo',
  styleUrl: './computed-demo.scss',
  templateUrl: './computed-demo.html',
})

// un computed à des valeur calculé
// mais qui ne peut être changer a la main via un set ou un update
export class ComputedDemo {
  prix = signal<number>(10)
  quantite = signal<number>(1)

  // computed permet de recalculer à chaque fois que l'un des signaux change
  // si signal en number ou string c'est via sa valeur si c'est un arra c'est via sa ref
  // si le prix change computed est re appeler et réassigne une nouvel valeur a total
  // si la quantité change computed est re appeler et réassigne une nouvel valeur a total
  // si les deux change même chose
  // en mettant le signal dans la parenthese de computed(...) tu abonnes computed
  // automatiquement au signal dans notre cas prix et quantité
  total = computed(() => this.prix() * this.quantite())
  // this.prix() * this.quantite() renvoie un nombre
  // automatiquement le computed va mettre notre variable avec le type qu'il renvoie
  // donc un nombre donc total est de type signal<number>


  // computed va mettre notre variable "EstLivraisonGratuite" en boolean car
  // this.total() >= 50 renvoie true ou false donc un boolean
  EstLivraisonGratuite = computed(() =>  this.total() >= 50)


  // computed va mettre notre "livraisonGratuite" en string car
  // car vérifie si total est supérieur ou égale a 50
  // et à un comportement selon le boolean il renvoie un string
  // livraison gratutie ou un string livraison payante
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
