import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Navbar() {
  const loc = useLocation();
  const { t } = useTranslation();
  const hidden = loc.pathname === '/' || loc.pathname.startsWith('/lesson') ||
    loc.pathname.startsWith('/unit-intro') || ['/splash','/prologue','/start'].includes(loc.pathname);
  if (hidden) return null;

  const links = [
    { to: '/learn',   label: t('nav.map'),  icon: '🗺️' },
    { to: '/',        label: t('nav.camp'), icon: '🏕️' },
    { to: '/profile', label: t('nav.hero'), icon: '🐉' },
  ];

  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      background: '#0d0d1a', borderTop: '1px solid rgba(255,255,255,0.08)',
      display: 'flex', justifyContent: 'center',
      zIndex: 100, padding: '8px 0 14px',
    }}>
      {links.map(l => {
        const active = loc.pathname === l.to;
        return (
          <Link key={l.to} to={l.to} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: 3, padding: '4px 36px', textDecoration: 'none',
            color: active ? '#58CC02' : 'rgba(255,255,255,0.3)',
            borderTop: active ? '2px solid #58CC02' : '2px solid transparent',
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 7, letterSpacing: 1,
            transition: 'all 0.15s',
          }}>
            <span style={{ fontSize: 20 }}>{l.icon}</span>
            <span>{l.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
