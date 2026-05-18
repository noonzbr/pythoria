import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useProgress } from '../hooks/useProgress.js';
import { UNITS, ACHIEVEMENTS } from '../data/curriculum.js';
import { locUnit } from '../utils/loc.js';

const LANGUAGES = [
  { code: 'en',   flag: '🇺🇸', label: 'English' },
  { code: 'ptBR', flag: '🇧🇷', label: 'Português (BR)' },
  { code: 'es',   flag: '🇪🇸', label: 'Español' },
];

export default function Profile() {
  const { user, completed, loading, refetch } = useProgress();
  const { t, i18n } = useTranslation();
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [saving, setSaving] = useState(false);

  if (loading || !user) return null;

  const totalLessons = UNITS.reduce((s, u) => s + u.lessons.length, 0);

  const earnedAchievements = new Set();
  if (completed.length >= 1) earnedAchievements.add('first_lesson');
  if (user.xp >= 100) earnedAchievements.add('xp_100');
  if (user.xp >= 500) earnedAchievements.add('xp_500');
  if (user.streak >= 3) earnedAchievements.add('streak_3');
  if (user.streak >= 7) earnedAchievements.add('streak_7');

  UNITS.forEach(unit => {
    const allDone = unit.lessons.every(l =>
      completed.some(c => c.unit_id === unit.id && c.lesson_id === l.id)
    );
    if (allDone) earnedAchievements.add(`unit_${unit.id}_complete`);
  });

  const saveName = async () => {
    if (!nameInput.trim()) return;
    setSaving(true);
    await fetch('/api/progress/update-username', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: nameInput })
    });
    await refetch();
    setEditingName(false);
    setSaving(false);
  };

  const restoreHearts = async () => {
    await fetch('/api/progress/restore-hearts', { method: 'POST' });
    await refetch();
  };

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: '24px 16px 100px' }}>
      {/* Profile Header */}
      <div style={{
        background: 'linear-gradient(135deg, #58CC02, #45A800)',
        borderRadius: 24, padding: '28px 24px', marginBottom: 20,
        color: 'white', textAlign: 'center',
        boxShadow: '0 6px 0 #2D6A00'
      }}>
        <div style={{ fontSize: 64, marginBottom: 8 }}>🐉</div>

        {editingName ? (
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 4 }}>
            <input
              value={nameInput}
              onChange={e => setNameInput(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: 10, border: 'none', fontFamily: 'Nunito', fontWeight: 800, fontSize: 16, width: 160 }}
              placeholder={user.username}
              autoFocus
            />
            <button onClick={saveName} disabled={saving} style={{
              background: 'white', color: 'var(--green)', borderRadius: 10,
              padding: '8px 14px', fontWeight: 900
            }}>
              {saving ? t('profile.saving') : t('profile.saveBtn')}
            </button>
            <button onClick={() => setEditingName(false)} style={{
              background: 'rgba(255,255,255,0.3)', color: 'white', borderRadius: 10, padding: '8px 12px', fontWeight: 900
            }}>✕</button>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 4 }}>
            <h1 style={{ fontSize: 26, fontWeight: 900 }}>{user.username}</h1>
            <button onClick={() => { setNameInput(user.username); setEditingName(true); }} style={{
              background: 'rgba(255,255,255,0.25)', borderRadius: 8, padding: '3px 8px',
              color: 'white', fontSize: 13, fontWeight: 800
            }}>{t('profile.editHint')}</button>
          </div>
        )}

        <p style={{ opacity: 0.9, fontWeight: 700 }}>{t('profile.level')} {user.level} {t('profile.title')}</p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 16 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 900 }}>{user.xp}</div>
            <div style={{ fontSize: 11, opacity: 0.8, fontWeight: 700 }}>{t('profile.totalXP')}</div>
          </div>
          <div style={{ width: 1, background: 'rgba(255,255,255,0.3)' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 900 }}>{user.streak}</div>
            <div style={{ fontSize: 11, opacity: 0.8, fontWeight: 700 }}>{t('profile.dayStreak')}</div>
          </div>
          <div style={{ width: 1, background: 'rgba(255,255,255,0.3)' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 900 }}>{completed.length}</div>
            <div style={{ fontSize: 11, opacity: 0.8, fontWeight: 700 }}>{t('profile.lessons')}</div>
          </div>
        </div>
      </div>

      {/* Language Switcher */}
      <div style={{
        background: 'white', borderRadius: 16, padding: 16,
        border: '2px solid var(--border)', marginBottom: 16
      }}>
        <h3 style={{ fontWeight: 900, marginBottom: 12 }}>{t('lang.label')}</h3>
        <div style={{ display: 'flex', gap: 8 }}>
          {LANGUAGES.map(lang => (
            <button
              key={lang.code}
              onClick={() => i18n.changeLanguage(lang.code)}
              style={{
                flex: 1, padding: '10px 6px', borderRadius: 12,
                background: i18n.language === lang.code ? '#58CC02' : 'var(--gray-light)',
                color: i18n.language === lang.code ? 'white' : 'var(--gray)',
                border: `2px solid ${i18n.language === lang.code ? '#45A800' : 'var(--border)'}`,
                fontWeight: 800, fontSize: 12, cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              <div style={{ fontSize: 20, marginBottom: 3 }}>{lang.flag}</div>
              <div style={{ fontSize: 10 }}>{lang.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Hearts & Gems */}
      <div style={{
        background: 'white', borderRadius: 16, padding: 16,
        border: '2px solid var(--border)', marginBottom: 16
      }}>
        <h3 style={{ fontWeight: 900, marginBottom: 12 }}>{t('profile.livesAndGems')}</h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div>
            <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} style={{ fontSize: 22, opacity: i < user.hearts ? 1 : 0.2 }}>❤️</span>
              ))}
            </div>
            <p style={{ fontSize: 13, color: 'var(--gray)', fontWeight: 700 }}>
              {t('profile.heartsRemaining', { hearts: user.hearts })}
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: 20, fontWeight: 900, color: 'var(--blue)' }}>💎 {user.gems}</p>
          </div>
        </div>
        {user.hearts < 5 && (
          <button onClick={restoreHearts} style={{
            width: '100%', padding: '12px', borderRadius: 12,
            background: user.gems >= 350 ? 'var(--blue)' : 'var(--border)',
            color: user.gems >= 350 ? 'white' : 'var(--gray)',
            fontWeight: 900, fontSize: 14,
            boxShadow: user.gems >= 350 ? '0 3px 0 var(--blue-dark)' : 'none',
          }}>
            {t('profile.restoreBtn')}
          </button>
        )}
        {user.hearts === 5 && (
          <p style={{ textAlign: 'center', color: 'var(--green)', fontWeight: 800, fontSize: 14 }}>
            {t('profile.fullHearts')}
          </p>
        )}
      </div>

      {/* Progress Stats */}
      <div style={{
        background: 'white', borderRadius: 16, padding: 16,
        border: '2px solid var(--border)', marginBottom: 16
      }}>
        <h3 style={{ fontWeight: 900, marginBottom: 12 }}>{t('profile.progress')}</h3>
        {UNITS.map(unit => {
          const done = unit.lessons.filter(l =>
            completed.some(c => c.unit_id === unit.id && c.lesson_id === l.id)
          ).length;
          const pct = Math.round((done / unit.lessons.length) * 100);
          return (
            <div key={unit.id} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontWeight: 800, fontSize: 14 }}>{unit.icon} {locUnit(unit).title}</span>
                <span style={{ fontWeight: 700, fontSize: 13, color: unit.color }}>{pct}%</span>
              </div>
              <div style={{ background: 'var(--border)', borderRadius: 99, height: 8, overflow: 'hidden' }}>
                <div style={{ background: unit.color, height: '100%', width: `${pct}%`, borderRadius: 99 }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Achievements */}
      <div style={{ background: 'white', borderRadius: 16, padding: 16, border: '2px solid var(--border)' }}>
        <h3 style={{ fontWeight: 900, marginBottom: 12 }}>
          {t('profile.achievements')} ({earnedAchievements.size}/{ACHIEVEMENTS.length})
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {ACHIEVEMENTS.map(ach => {
            const earned = earnedAchievements.has(ach.id);
            return (
              <div key={ach.id} style={{
                background: earned ? '#FFF9E6' : 'var(--gray-light)',
                border: `2px solid ${earned ? 'var(--yellow)' : 'var(--border)'}`,
                borderRadius: 14, padding: '12px 10px', textAlign: 'center',
                opacity: earned ? 1 : 0.5,
              }}>
                <div style={{ fontSize: 28, marginBottom: 4, filter: earned ? 'none' : 'grayscale(1)' }}>
                  {ach.icon}
                </div>
                <p style={{ fontWeight: 800, fontSize: 12 }}>{ach.title}</p>
                <p style={{ fontSize: 11, color: 'var(--gray)', fontWeight: 600 }}>{ach.desc}</p>
                {earned && <p style={{ fontSize: 10, color: 'var(--yellow)', fontWeight: 800, marginTop: 2 }}>{t('profile.earned')}</p>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
