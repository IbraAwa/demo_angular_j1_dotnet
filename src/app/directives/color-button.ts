import { computed, Directive, input, signal } from "@angular/core";

@Directive({
  selector: 'button[appColorButton], a[appColorButton]',
  host: {
    '(mouseenter)' : 'hovered.set(true)',
    '(mouseleave)' : 'hovered.set(false)',
    '[style.backgroundColor]' : 'color()', // backgroundColor : red
    '[style.color]' : "'white'"
  }
})

//objectif
// quand je passe ma souris sur le bouton, il a une couleur choisie dans hoverColor
// quand je ne suis plus dessus, il a une couleur de base choisie directement via la directive (couleur)

export class ColorButton {
  hovered = signal(false)
  // LES VARIABLES AVEC INPUT SONT INITIALISÉES/AFFECTÉES
  // DANS la balise qui utilise la directive avec son sélecteur appColorButton
  couleur = input("green" , {alias : "appColorButton"}) // appColorButton="red"
  // couleur = "red"
  // UNE VARIABLE AVEC INPUT EST INITIALISÉE/AFFECTÉE
  // DANS LA BALISE AVEC SON NOM DE VARIABLE = VALUE
  hoverColor = input('') // BLACK
  color = computed(() => this.hovered() ? this.hoverColor() : this.couleur())

  stockDirective = input<string>("0")
}
