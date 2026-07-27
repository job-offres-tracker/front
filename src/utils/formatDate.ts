const FORMATTEUR_DATE = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'short', timeStyle: 'short' })

export function formatDateCreation(dateCreation: string): string {
  return FORMATTEUR_DATE.format(new Date(dateCreation))
}
