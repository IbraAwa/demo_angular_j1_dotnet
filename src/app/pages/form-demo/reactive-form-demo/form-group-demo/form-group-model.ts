// DTO = la forme exacte des données qu'on envoie à l'API
// il doit avoir la même structure que notre formulaire (mêmes clés, même imbrication)
export interface formGroupModel {
  nom: string,
  age: number,
  // sous-objet qui correspond au formBuilder.group adress
  adress: {
    rue: string,
    numero: number
  }
}
