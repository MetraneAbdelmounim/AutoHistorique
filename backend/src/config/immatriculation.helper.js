const FORMATS = {
  // Classique : 123456-A-78  →  chiffres (1-6) + lettre + 2 chiffres
  classique: /^(\d{1,6})([A-Z])(\d{2})$/,
  // Transit W : 12345-WW     →  chiffres (1-5) + WW (sans chiffre final)
  transit:   /^(\d{1,5})(WW)$/,
};

function parseImmatriculation(raw) {
  if (!raw) return { valid: false, error: 'Immatriculation requise' };
  const cleaned = raw.replace(/[-.\s]/g, '').toUpperCase();

  if (FORMATS.classique.test(cleaned)) {
    const [, nums, lettre, fin] = cleaned.match(FORMATS.classique);
    return {
      valid: true,
      normalized: `${nums}${lettre}${fin}`,
      type: 'classique',
      display: `${nums}-${lettre}-${fin}`
    };
  }

  if (FORMATS.transit.test(cleaned)) {
    const [, nums, ww] = cleaned.match(FORMATS.transit);
    return {
      valid: true,
      normalized: `${nums}${ww}`,
      type: 'transit',
      display: `${nums}-${ww}`
    };
  }

  return {
    valid: false,
    error: 'Format invalide. Exemples: 123456-A-78 (classique) ou 12345-WW (transit/W)'
  };
}

function calculerScoreConfiance(accidents) {
  if (!accidents || accidents.length === 0) {
    return { score: 'excellent', label: 'Aucun accident déclaré', value: 100 };
  }
  const graves = accidents.filter(a => ['grave', 'total'].includes(a.gravite)).length;
  const moderes = accidents.filter(a => a.gravite === 'modere').length;

  if (graves >= 2 || accidents.length >= 5) {
    return { score: 'risque', label: 'Historique préoccupant', value: 20 };
  }
  if (graves >= 1 || accidents.length >= 3) {
    return { score: 'eleve', label: 'Risque élevé', value: 40 };
  }
  if (moderes >= 1 || accidents.length >= 2) {
    return { score: 'moyen', label: 'Risque modéré', value: 60 };
  }
  return { score: 'faible', label: 'Risque faible', value: 80 };
}

module.exports = { parseImmatriculation, calculerScoreConfiance };
