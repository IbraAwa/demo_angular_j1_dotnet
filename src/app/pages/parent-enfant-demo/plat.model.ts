export interface Plat {
  nom : string
  prix : number
  description : string
  vegetarien : boolean
}

export const LISTE_PLATS: Plat[] = [
  {
    nom: "Burger Comtois",
    prix: 16.50,
    description: "Steak haché de bœuf, comté AOP fondu, oignons confits et sauce moutarde à l'ancienne.",
    vegetarien: false
  },
  {
    nom: "Risotto aux Champignons des Bois",
    prix: 14.00,
    description: "Riz Arborio crémeux, poêlée de cèpes et girolles, parsemé de copeaux de parmesan.",
    vegetarien: true
  },
  {
    nom: "Pavé de Saumon Rôti",
    prix: 18.90,
    description: "Saumon frais saisi sur peau, purée de patates douces et réduction d'agrumes.",
    vegetarien: false
  },
  {
    nom: "Curry Vert de Légumes",
    prix: 13.50,
    description: "Légumes croquants, lait de coco, citronnelle et riz basmati parfumé.",
    vegetarien: true
  }
];
