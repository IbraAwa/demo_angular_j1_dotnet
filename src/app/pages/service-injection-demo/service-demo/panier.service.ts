import { computed, Injectable, Service, signal } from '@angular/core';

// objectif de injectable ou service c'est de crée un singleton qui vivra une seul fois dans l'application
// car l'instance doit être partagé

// Méthode avant
//@Injectable({ providedIn: 'root'})
// injectable = la classe peut être injecté
// providedIn = une seul intance (singleton) pour tout l'app
@Service() // Morderne méthode



// objectif de mon service est de centraliser la logique ou faire des appel/communiquer a mon api
// et partager l'état de quelque chose par exemple ici partagé l'état de mon panier
// avoir tout les produit qu'on a choisis
export class PanierService {

  // permet de protéger notre service contre des effet de bord = a des modification non voulu qui rend mon état incohérent
  private _articles = signal<string[]>([]) // l'objectif c'est de le rendre immutable donc pas modifiable par l'extérieur ni lisible
  articles = this._articles.asReadonly(); // lecture seul mais modifiable donc partager entre tout les composnt

  nombreArticles = computed(() => this._articles().length)

  public ajouter(article : string) : void {
    this._articles.update((list) => [...list, article])
  }

  getAll() : string[] {
    return this.articles()
  }

  vider() {
    this._articles.set([])
  }

}
