// Accord des textes de la fiche selon le champion (champ "genre": "f" dans la fiche).
export function pronoms(fiche) {
  const feminin = fiche?.genre === 'f'
  return {
    cod: feminin ? 'la' : 'le', // comment le/la battre
    sujet: feminin ? 'elle' : 'il', // quand il/elle devient...
    fort: feminin ? 'forte' : 'fort',
  }
}
