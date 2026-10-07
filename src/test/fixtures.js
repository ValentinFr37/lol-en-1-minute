// Données factices au format Data Dragon, pour les tests.
// Les textes sont volontairement simplifiés : seule la structure compte.

const champ = (id, name, title, tags, difficulty) => ({
  id,
  key: id,
  name,
  title,
  tags,
  info: { difficulty },
  image: { full: `${id}.png` },
})

export const rawChampionList = {
  type: 'champion',
  version: '99.1.1',
  data: {
    Darius: champ('Darius', 'Darius', "la Main de Noxus", ['Fighter', 'Tank'], 2),
    Ahri: champ('Ahri', 'Ahri', 'la Renarde à neuf queues', ['Mage', 'Assassin'], 5),
    MissFortune: champ('MissFortune', 'Miss Fortune', 'la chasseuse de primes', ['Marksman'], 1),
    KogMaw: champ('KogMaw', "Kog'Maw", "la Gueule de l'Abîme", ['Marksman', 'Mage'], 6),
    MonkeyKing: champ('MonkeyKing', 'Wukong', 'le Roi des singes', ['Fighter', 'Tank'], 3),
    Evelynn: champ('Evelynn', 'Evelynn', "l'Étreinte de l'agonie", ['Assassin', 'Mage'], 10),
    Nunu: champ('Nunu', 'Nunu et Willump', 'le garçon et son yéti', ['Tank', 'Mage'], 4),
    Thresh: champ('Thresh', 'Thresh', 'le Gardien des chaînes', ['Support', 'Fighter'], 7),
  },
}

const spell = (name, description, cooldownBurn, file) => ({ name, description, cooldownBurn, image: { full: file } })

export const rawDariusDetail = {
  type: 'champion',
  version: '99.1.1',
  data: {
    Darius: {
      id: 'Darius',
      name: 'Darius',
      passive: {
        name: 'Hémorragie',
        description:
          'Les attaques de Darius font <status>saigner</status> leur cible. À 5 cumuls, il gagne beaucoup de puissance.<br><br>Détail secondaire.',
        image: { full: 'Darius_Icon_Hemorrhage.png' },
      },
      spells: [
        spell('Décimation', 'Darius fait tournoyer sa hache. La lame inflige plus de <physicalDamage>dégâts</physicalDamage>.', '9/8/7/6/5', 'DariusCleave.png'),
        spell('Frappe estropiante', 'La prochaine attaque de Darius ralentit sa cible.', '7/6.5/6/5.5/5', 'DariusNoxianTacticsONH.png'),
        spell('Appréhension', 'Darius attire les ennemis devant lui.', '24/21.5/19/16.5/14', 'DariusAxeGrabCone.png'),
        spell('Guillotine noxienne', 'Darius exécute un champion en infligeant des <trueDamage>dégâts bruts</trueDamage>.', '100/90/80', 'DariusExecute.png'),
      ],
      enemytips: ['Restez hors de portée de sa hache.', '  '],
    },
  },
}
