import { Link } from 'react-router-dom';
import { useProgress } from '../hooks/useProgress.js';
import { UNITS } from '../data/curriculum.js';

export default function Learn() {
  const { completed, loading } = useProgress();
  if (loading) return null;

  const isCompleted = (unitId, lessonId) =>
    completed.some(c => c.unit_id === unitId && c.lesson_id === lessonId);

  // Determine which lesson is next (first incomplete)
  let nextUnitId = null, nextLessonId = null;
  outer: for (const unit of UNITS) {
    for (const lesson of unit.lessons) {
      if (!isCompleted(unit.id, lesson.id)) {
        nextUnitId = unit.id;
        nextLessonId = lesson.id;
        break outer;
      }
    }
  }

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: '24px 16px 100px' }}>
      <h1 style={{ fontSize: 26, fontWeight: 900, marginBottom: 4 }}>🗺️ Skill Path</h1>
      <p style={{ color: 'var(--gray)', fontWeight: 700, marginBottom: 24, fontSize: 14 }}>
        Master Python one quest at a time
      </p>

      {UNITS.map((unit, unitIdx) => {
        const unitCompleted = unit.lessons.filter(l => isCompleted(unit.id, l.id)).length;
        const allDone = unitCompleted === unit.lessons.length;

        // Unit is locked if previous unit isn't started
        const prevUnit = UNITS[unitIdx - 1];
        const prevCompleted = prevUnit
          ? prevUnit.lessons.filter(l => isCompleted(prevUnit.id, l.id)).length
          : unit.lessons.length;
        const unitLocked = prevUnit && prevCompleted === 0;

        return (
          <div key={unit.id} style={{ marginBottom: 32 }}>
            {/* Unit Header */}
            <div style={{
              background: unitLocked ? '#f0f0f0' : unit.colorLight,
              border: `3px solid ${unitLocked ? 'var(--border)' : unit.borderColor}`,
              borderRadius: 20, padding: '16px 20px', marginBottom: 16,
              opacity: unitLocked ? 0.6 : 1,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 32 }}>{unitLocked ? '🔒' : unit.icon}</span>
                <div>
                  <p style={{ fontSize: 11, fontWeight: 800, color: unit.borderColor, letterSpacing: 1, textTransform: 'uppercase' }}>
                    UNIT {unit.id}
                  </p>
                  <h2 style={{ fontSize: 18, fontWeight: 900 }}>{unit.title}</h2>
                  <p style={{ fontSize: 12, color: 'var(--text-light)', fontWeight: 600 }}>{unit.description}</p>
                </div>
                {allDone && <span style={{ marginLeft: 'auto', fontSize: 24 }}>✅</span>}
              </div>
              <div style={{ marginTop: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-light)' }}>
                    {unitCompleted}/{unit.lessons.length} lessons
                  </span>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.6)', borderRadius: 99, height: 8, overflow: 'hidden' }}>
                  <div style={{
                    background: unit.color, height: '100%',
                    width: `${(unitCompleted / unit.lessons.length) * 100}%`,
                    borderRadius: 99, transition: 'width 0.5s',
                  }} />
                </div>
              </div>
            </div>

            {/* Lessons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingLeft: 8 }}>
              {unit.lessons.map((lesson, lessonIdx) => {
                const done = isCompleted(unit.id, lesson.id);
                const isNext = unit.id === nextUnitId && lesson.id === nextLessonId;

                // Lock lesson if previous lesson not done (except first of each unit)
                const prevLesson = unit.lessons[lessonIdx - 1];
                const locked = unitLocked || (prevLesson && !isCompleted(unit.id, prevLesson.id));

                return (
                  <LessonNode
                    key={lesson.id}
                    lesson={lesson}
                    unit={unit}
                    done={done}
                    isNext={isNext}
                    locked={locked}
                  />
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function LessonNode({ lesson, unit, done, isNext, locked }) {
  const content = (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 14,
      background: locked ? '#f5f5f5' : done ? unit.colorLight : 'white',
      border: `2px solid ${locked ? 'var(--border)' : done ? unit.borderColor : isNext ? unit.color : 'var(--border)'}`,
      borderRadius: 16, padding: '14px 16px',
      opacity: locked ? 0.5 : 1,
      boxShadow: isNext ? `0 4px 0 ${unit.borderColor}` : 'none',
      textDecoration: 'none', color: 'var(--text)',
      transform: isNext ? 'scale(1.02)' : 'scale(1)',
      transition: 'all 0.15s',
      cursor: locked ? 'not-allowed' : 'pointer',
    }}>
      {/* Icon Circle */}
      <div style={{
        width: 48, height: 48, borderRadius: '50%',
        background: done ? unit.color : locked ? 'var(--border)' : unit.colorLight,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 22, flexShrink: 0,
        border: `3px solid ${done ? unit.borderColor : locked ? 'var(--border)' : unit.color}`,
      }}>
        {done ? '✓' : locked ? '🔒' : lesson.icon}
      </div>

      <div style={{ flex: 1 }}>
        <p style={{ fontWeight: 800, fontSize: 15 }}>{lesson.title}</p>
        <p style={{ fontSize: 12, color: 'var(--text-light)', fontWeight: 600 }}>
          {lesson.exercises.length} challenges · +{lesson.xpReward} XP
        </p>
      </div>

      {isNext && !locked && (
        <div style={{
          background: unit.color, color: 'white',
          padding: '6px 14px', borderRadius: 99,
          fontSize: 12, fontWeight: 900
        }}>START</div>
      )}
      {done && (
        <div style={{ color: unit.borderColor, fontSize: 12, fontWeight: 800 }}>+{lesson.xpReward} XP</div>
      )}
    </div>
  );

  if (locked) return content;

  return (
    <Link to={`/lesson/${unit.id}/${lesson.id}`} style={{ textDecoration: 'none' }}>
      {content}
    </Link>
  );
}
