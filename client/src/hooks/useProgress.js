import { useState, useEffect } from 'react';

export function useProgress() {
  const [user, setUser] = useState(null);
  const [completed, setCompleted] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProgress = async () => {
    try {
      const res = await fetch('/api/progress/user');
      const data = await res.json();
      setUser(data.user);
      setCompleted(data.completed);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProgress(); }, []);

  const isCompleted = (unitId, lessonId) =>
    completed.some(c => c.unit_id === unitId && c.lesson_id === lessonId);

  const completeLesson = async (unitId, lessonId, xpEarned, heartsLost) => {
    const res = await fetch('/api/progress/complete-lesson', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ unitId, lessonId, xpEarned, heartsLost })
    });
    const data = await res.json();
    if (data.success) {
      setUser(data.user);
      setCompleted(prev => {
        const exists = prev.some(c => c.unit_id === unitId && c.lesson_id === lessonId);
        if (exists) return prev;
        return [...prev, { unit_id: unitId, lesson_id: lessonId }];
      });
    }
    return data;
  };

  return { user, completed, loading, isCompleted, completeLesson, refetch: fetchProgress };
}
