// Seuls les champs présents sont modifiés côté backend : un champ absent reste inchangé,
// `null` efface la valeur existante.
export interface ModifierPriseDeContactRequest {
  urlEntreprise?: string | null
  poste?: string | null
  client?: string | null
}
