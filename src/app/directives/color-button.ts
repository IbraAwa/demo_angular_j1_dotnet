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
// quand je passe ma souris sur le bouton il a une couleur choisi dans hoverColor
// quand je ne suis plus dessus i la une couleur de base choisis par la directive direct couleur

export class ColorButton {
  hovered = signal(false)
  // VARIABLE AVEC INPUT SONT INITIALISER/AFFECTER
  // DANS la balise qui utilise la directive avec son selecteur  appColorButton
  couleur = input("green" , {alias : "appColorButton"}) // appColorButton="red"
  // couleur = "red"
  // VARIABLE AVEC INPUT EST INITIALISER/AFFECTER
  // DANS LA BALISE AVEC SON NOM DE VARIABLE = VALUE
  hoverColor = input('') // BLACK
  color = computed(() => this.hovered() ? this.hoverColor() : this.couleur())

  stockDirective = input<string>("0")
}
