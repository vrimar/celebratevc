import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Layout({ children }) {
  const router = useRouter();

  return (
    <div className="page">
      <nav className="nav">
        <div className="nav-inner">
          <Link href="/" className="nav-brand">
            V <span className="nav-amp">&amp;</span> C
            <span className="nav-sep">|</span>
            <span className="nav-label">WEDDING</span>
          </Link>
          <ul className="nav-links">
            <li>
              <Link href="/" className={router.pathname === '/' ? 'active' : ''}>
                Home
              </Link>
            </li>
            <li>
              <Link href="/rsvp" className={router.pathname === '/rsvp' ? 'active' : ''}>
                RSVP
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {children}

      <footer className="footer">
        <div className="footer-text">
          <span className="footer-script">With Love</span>
          <span className="ornament">✦</span>
          <span>August 27, 2026</span>
          <span className="ornament">✦</span>
          <span>Niagara Falls</span>
        </div>
      </footer>
    </div>
  );
}
