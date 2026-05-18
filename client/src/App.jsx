import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useStory } from './hooks/useStory.js';
import Splash         from './pages/Splash.jsx';
import LangSelect     from './pages/LangSelect.jsx';
import Prologue       from './pages/Prologue.jsx';
import CharacterCreate from './pages/CharacterCreate.jsx';
import Home           from './pages/Home.jsx';
import WorldMap       from './pages/WorldMap.jsx';
import UnitIntro      from './pages/UnitIntro.jsx';
import LessonLearn    from './pages/LessonLearn.jsx';
import Lesson         from './pages/Lesson.jsx';
import Epilogue       from './pages/Epilogue.jsx';
import Profile        from './pages/Profile.jsx';
import Navbar         from './components/Navbar.jsx';

// Redirects unauthenticated users to /splash
function RequireSetup({ children }) {
  const { isFirstLaunch, getPlayer } = useStory();
  const player = getPlayer();
  if (isFirstLaunch() || !player.name) return <Navigate to="/splash" replace />;
  return children;
}

function AppLayout() {
  const location = useLocation();
  const fullscreen = ['/', '/splash', '/lang', '/prologue', '/start', '/epilogue'].includes(location.pathname) ||
    location.pathname.startsWith('/unit-intro') ||
    location.pathname.startsWith('/lesson');

  return (
    <div style={{ minHeight: '100vh', background: 'var(--gray-light)' }}>
      {!fullscreen && <Navbar />}
      <Routes>
        {/* Onboarding flow */}
        <Route path="/splash"   element={<Splash />} />
        <Route path="/lang"     element={<LangSelect />} />
        <Route path="/prologue" element={<Prologue />} />
        <Route path="/start"    element={<CharacterCreate />} />

        {/* Main app */}
        <Route path="/" element={<RequireSetup><Home /></RequireSetup>} />
        <Route path="/learn" element={<RequireSetup><WorldMap /></RequireSetup>} />
        <Route path="/unit-intro/:unitId" element={<RequireSetup><UnitIntro /></RequireSetup>} />
        <Route path="/lesson/:unitId/:lessonId/learn" element={<RequireSetup><LessonLearn /></RequireSetup>} />
        <Route path="/lesson/:unitId/:lessonId" element={<RequireSetup><Lesson /></RequireSetup>} />
        <Route path="/epilogue" element={<RequireSetup><Epilogue /></RequireSetup>} />
        <Route path="/profile" element={<RequireSetup><Profile /></RequireSetup>} />

        <Route path="*" element={<Navigate to="/splash" replace />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}
