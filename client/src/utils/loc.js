import i18n from '../i18n/index.js';
import { CONTENT_I18N } from '../data/content-i18n.js';

function lang() {
  const l = i18n.language;
  if (l === 'ptBR' || l === 'pt-BR' || l?.startsWith('pt')) return 'pt-BR';
  if (l === 'es' || l?.startsWith('es')) return 'es';
  return 'en';
}

function get(key) {
  const map = CONTENT_I18N[lang()];
  return map?.[key] ?? null;
}

export function locUnit(unit) {
  if (!unit) return unit;
  const l = lang();
  if (l === 'en') return unit;
  return {
    ...unit,
    title: get(`u${unit.id}.title`) ?? unit.title,
    description: get(`u${unit.id}.desc`) ?? unit.description,
  };
}

export function locLesson(unitId, lesson) {
  if (!lesson) return lesson;
  const l = lang();
  if (l === 'en') return lesson;
  return {
    ...lesson,
    title: get(`l${unitId}.${lesson.id}.title`) ?? lesson.title,
  };
}

export function locMission(unitId, lessonId, idx, mission) {
  if (!mission) return mission;
  const l = lang();
  if (l === 'en') return mission;
  const p = `m${unitId}.${lessonId}.${idx}`;
  const rawPairs = get(`${p}.pairs`);
  return {
    ...mission,
    title:    get(`${p}.title`)    ?? mission.title,
    text:     get(`${p}.text`)     ?? mission.text,
    question: get(`${p}.question`) ?? mission.question,
    options:  get(`${p}.options`)  ?? mission.options,
    pairs:    rawPairs             ?? mission.pairs,
  };
}

export function locIntroPanel(unitId, panelIdx, panel) {
  if (!panel) return panel;
  const l = lang();
  if (l === 'en') return panel;
  const p = `intro.${unitId}.${panelIdx}`;
  return {
    ...panel,
    title: get(`${p}.title`) ?? panel.title,
    text:  get(`${p}.text`)  ?? panel.text,
  };
}

export function locIntro(unitId, intro) {
  if (!intro) return intro;
  const l = lang();
  if (l === 'en') return intro;
  return {
    ...intro,
    unitName:     get(`intro.${unitId}.unitName`)     ?? intro.unitName,
    fragmentName: get(`intro.${unitId}.fragmentName`) ?? intro.fragmentName,
  };
}

export function locExercise(unitId, lessonId, idx, exercise) {
  if (!exercise) return exercise;
  const l = lang();
  if (l === 'en') return exercise;
  const p = `e${unitId}.${lessonId}.${idx}`;
  return {
    ...exercise,
    question:    get(`${p}.question`)    ?? exercise.question,
    options:     get(`${p}.options`)     ?? exercise.options,
    explanation: get(`${p}.explanation`) ?? exercise.explanation,
    hint:        get(`${p}.hint`)        ?? exercise.hint,
  };
}
