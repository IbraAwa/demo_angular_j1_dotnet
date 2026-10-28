export interface Voiture {
  nom : string
  marque : string
  litreEssenceMaxilum : number
  isLuxe : boolean
}

export const VOITURES: Voiture[] = [
  {
    nom: "Clio 5",
    marque: "Renault",
    litreEssenceMaxilum: 42,
    isLuxe: false
  },
  {
    nom: "911 Carrera",
    marque: "Porsche",
    litreEssenceMaxilum: 64,
    isLuxe: true
  },
  {
    nom: "Golf 8",
    marque: "Volkswagen",
    litreEssenceMaxilum: 50,
    isLuxe: false
  },
  {
    nom: "Phantom",
    marque: "Rolls-Royce",
    litreEssenceMaxilum: 90,
    isLuxe: true
  },
  {
    nom: "208",
    marque: "Peugeot",
    litreEssenceMaxilum: 44,
    isLuxe: false
  },
  {
    nom: "S-Class",
    marque: "Mercedes-Benz",
    litreEssenceMaxilum: 76,
    isLuxe: true
  },
  {
    nom: "Yaris",
    marque: "Toyota",
    litreEssenceMaxilum: 36,
    isLuxe: false
  },
  {
    nom: "SF90 Stradale",
    marque: "Ferrari",
    litreEssenceMaxilum: 68,
    isLuxe: true
  },
  {
    nom: "Civic",
    marque: "Honda",
    litreEssenceMaxilum: 47,
    isLuxe: false
  },
  {
    nom: "DB11",
    marque: "Aston Martin",
    litreEssenceMaxilum: 78,
    isLuxe: true
  }
];
