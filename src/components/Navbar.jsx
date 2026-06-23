import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`} id="main-navbar">
      <div className="navbar__container">
        <Link to="/" className="navbar__logo" onClick={closeMenu}>
          TASTY FOOD
        </Link>

        <button
          className={`navbar__hamburger ${menuOpen ? 'navbar__hamburger--active' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
          id="hamburger-btn"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <ul className={`navbar__menu ${menuOpen ? 'navbar__menu--open' : ''}`}>
          <li>
            <NavLink to="/" end className={({ isActive }) => isActive ? 'navbar__link navbar__link--active' : 'navbar__link'} onClick={closeMenu}>
              HOME
            </NavLink>
          </li>
          <li>
            <NavLink to="/tentang" className={({ isActive }) => isActive ? 'navbar__link navbar__link--active' : 'navbar__link'} onClick={closeMenu}>
              TENTANG
            </NavLink>
          </li>
          <li>
            <NavLink to="/berita" className={({ isActive }) => isActive ? 'navbar__link navbar__link--active' : 'navbar__link'} onClick={closeMenu}>
              BERITA
            </NavLink>
          </li>
          <li>
            <NavLink to="/galeri" className={({ isActive }) => isActive ? 'navbar__link navbar__link--active' : 'navbar__link'} onClick={closeMenu}>
              GALERI
            </NavLink>
          </li>
          <li>
            <NavLink to="/kontak" className={({ isActive }) => isActive ? 'navbar__link navbar__link--active' : 'navbar__link'} onClick={closeMenu}>
              KONTAK
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
