const KEYS = {
  name:        'cq_name',
  classId:     'cq_class',
  prologue:    'cq_prologue_done',
  seenUnits:   'cq_seen_units',
  seenOutros:  'cq_seen_outros',
  langSelected: 'cq_lang_selected',
};

export function useStory() {
  const getPlayer = () => ({
    name:         localStorage.getItem(KEYS.name)    || null,
    classId:      localStorage.getItem(KEYS.classId) || null,
    prologueDone: localStorage.getItem(KEYS.prologue) === '1',
    seenUnits:    JSON.parse(localStorage.getItem(KEYS.seenUnits)  || '[]'),
    seenOutros:   JSON.parse(localStorage.getItem(KEYS.seenOutros) || '[]'),
  });

  const isFirstLaunch = () => !localStorage.getItem(KEYS.prologue);
  const hasSelectedLang = () => !!localStorage.getItem(KEYS.langSelected);

  const savePlayer = (name, classId) => {
    localStorage.setItem(KEYS.name,     name.trim());
    localStorage.setItem(KEYS.classId,  classId);
    localStorage.setItem(KEYS.prologue, '1');
  };

  const markUnitIntroSeen = (unitId) => {
    const seen = JSON.parse(localStorage.getItem(KEYS.seenUnits) || '[]');
    if (!seen.includes(unitId))
      localStorage.setItem(KEYS.seenUnits, JSON.stringify([...seen, unitId]));
  };

  const hasSeenUnitIntro = (unitId) => {
    const seen = JSON.parse(localStorage.getItem(KEYS.seenUnits) || '[]');
    return seen.includes(unitId);
  };

  const markOutroSeen = (unitId) => {
    const seen = JSON.parse(localStorage.getItem(KEYS.seenOutros) || '[]');
    if (!seen.includes(unitId))
      localStorage.setItem(KEYS.seenOutros, JSON.stringify([...seen, unitId]));
  };

  const hasSeenOutro = (unitId) => {
    const seen = JSON.parse(localStorage.getItem(KEYS.seenOutros) || '[]');
    return seen.includes(unitId);
  };

  const resetAll = () => Object.values(KEYS).forEach(k => localStorage.removeItem(k));

  return { getPlayer, isFirstLaunch, hasSelectedLang, savePlayer, markUnitIntroSeen, hasSeenUnitIntro, markOutroSeen, hasSeenOutro, resetAll };
}
