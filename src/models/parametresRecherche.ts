export interface CommuneRecherche {
  codeInsee: string
  libelle: string
}

export interface ParametresRecherche {
  motsCles: string[]
  communes: CommuneRecherche[]
  typeContrat: string | null
}
