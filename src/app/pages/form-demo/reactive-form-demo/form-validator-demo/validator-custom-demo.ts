import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

/*
export const contientMajuscule => on crée une constante qu’on peut importer ailleurs, rien de fou
: ValidatorFn => c’est le type de la constante. On dit a ts “ce truc la c’est une fonction de valiation Angular”. Comme const age: number = 5, sauf qu’ici le type c’est une fonction
= (control: AbstractControl) => la c’est la fonction fléchée elle-même, avec son paramètre control qui est de type AbstractControl (le champ du form)
: ValidationErrors | null => ça c’est le type de retour de la fonction, elle renvoie soit un objet d’erreur, soit null
=> { ... } => le corps de la fonction
*/
export const contientMajuscule: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  return /[A-Z]/.test(control.value) ? null : { majuscule: true };
};


export const confirmePassword: ValidatorFn = (group : AbstractControl): ValidationErrors | null => {
  const mdp = group.get('mdp')?.value
  const confirm = group.get('confirmer')?.value;

  return mdp === confirm ? null : { differents : true}
}

export function confirmePasswordee(cUn : string, cDeux : string) : ValidatorFn {
  return (group: AbstractControl) : ValidationErrors | null => {
    const mdp = group.get('mdp')?.value
    const confirm = group.get('confirmer')?.value;

    return mdp === confirm ? null : { differents : true}
  }
}
