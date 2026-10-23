import { Directive, input, signal } from "@angular/core";

@Directive({
  selector: '[appColorButton]',
  host: {
    '(mouseenter)' : 'hovered.set(true)',
    '(mouseleave)' : 'hovered.set(false)',
    '[style.backgroundColor]' : 'couleur()',
    '[style.color]' : "'white'"
  }
})

//objectif
// quand je passe ma souris sur le bouton il a une couleur choisi dans hoverColor
// quand je ne suis plus dessus i la une couleur de base choisis par la directive direct couleur

export class ColorButton {
  hovered = signal(false)
  couleur = input("green" , {alias : "appColorButton"})
  //hoverColor = input('')
  // computed
}
