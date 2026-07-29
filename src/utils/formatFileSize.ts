export function formatTailleFichier(octets: number): string {
  const ko = octets / 1024
  if (ko < 1024) {
    return `${ko.toFixed(0)} Ko`
  }
  return `${(ko / 1024).toFixed(1)} Mo`
}
