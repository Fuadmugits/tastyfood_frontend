import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer" id="main-footer">
      <div className="footer__container">
        <div className="footer__grid">
          {/* Brand Column */}
          <div className="footer__brand">
            <h3 className="footer__logo">Tasty Food</h3>
            <p className="footer__description">
              Menyajikan makanan sehat dan lezat untuk keluarga Indonesia.
              Kami berkomitmen menggunakan bahan-bahan segar berkualitas tinggi
              untuk setiap hidangan yang kami sajikan.
            </p>
            <div className="footer__socials">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="footer__social-link" aria-label="Facebook">
                <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="footer__social-link" aria-label="Twitter">
                <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Useful Links */}
          <div className="footer__column">
            <h4 className="footer__column-title">Useful links</h4>
            <ul className="footer__links">
              <li><Link to="/berita" className="footer__link">Blog</Link></li>
              <li><Link to="/berita" className="footer__link">Hewan</Link></li>
              <li><Link to="/galeri" className="footer__link">Galeri</Link></li>
              <li><Link to="/berita" className="footer__link">Testimonial</Link></li>
            </ul>
          </div>

          {/* Privacy */}
          <div className="footer__column">
            <h4 className="footer__column-title">Privacy</h4>
            <ul className="footer__links">
              <li><Link to="/berita" className="footer__link">Karir</Link></li>
              <li><Link to="/tentang" className="footer__link">Tentang Kami</Link></li>
              <li><Link to="/kontak" className="footer__link">Kontak Kami</Link></li>
              <li><Link to="/tentang" className="footer__link">Servis</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer__column">
            <h4 className="footer__column-title">Contact Info</h4>
            <ul className="footer__contact">
              <li className="footer__contact-item">
                <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
                <span>tastyfood@gmail.com</span>
              </li>
              <li className="footer__contact-item">
                <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                </svg>
                <span>+62 812 3456 7890</span>
              </li>
              <li className="footer__contact-item">
                <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                <span>Kota Bandung, Jawa Barat</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <p>Copyright ©2023 All rights reserved</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
