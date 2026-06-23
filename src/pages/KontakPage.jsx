import { useState, useEffect } from 'react';
import PageBanner from '../components/PageBanner';
import contactService from '../services/contactService';
import './KontakPage.css';

function KontakPage() {
  const [formData, setFormData] = useState({
    subject: '',
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [contactInfo, setContactInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      await contactService.sendContactMessage(formData);
      setSubmitStatus('success');
      setFormData({ subject: '', name: '', email: '', message: '' });
    } catch (error) {
      console.error('Failed to send message:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        setLoading(true);
        const data = await contactService.getContactInfo();
        setContactInfo(data);
      } catch (error) {
        console.error('Failed to fetch contact info:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchContactInfo();
  }, []);

  useEffect(() => {
    if (!loading) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('reveal--visible');
            }
          });
        },
        { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
      );

      document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
      return () => observer.disconnect();
    }
  }, [loading]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#1a1a1a', color: '#f5a623', fontSize: '24px' }}>
        MEMUAT DATA...
      </div>
    );
  }

  return (
    <div className="kontak-page" id="kontak-page">
      <PageBanner
        title="KONTAK KAMI"
        backgroundImage="/images/food-banner.png"
      />

      {/* Contact Form */}
      <section className="kontak-form-section reveal" id="kontak-form-section">
        <div className="kontak-form__container">
          <h2 className="kontak-form__title">KONTAK KAMI</h2>
          <form className="kontak-form" onSubmit={handleSubmit} id="contact-form">
            <div className="kontak-form__grid">
              <div className="kontak-form__left">
                <div className="kontak-form__group">
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Subject"
                    className="kontak-form__input"
                    required
                    id="contact-subject"
                  />
                </div>
                <div className="kontak-form__group">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Name"
                    className="kontak-form__input"
                    required
                    id="contact-name"
                  />
                </div>
                <div className="kontak-form__group">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                    className="kontak-form__input"
                    required
                    id="contact-email"
                  />
                </div>
              </div>
              <div className="kontak-form__right">
                <div className="kontak-form__group">
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Message"
                    className="kontak-form__textarea"
                    rows="8"
                    required
                    id="contact-message"
                  ></textarea>
                </div>
              </div>
            </div>
            <button
              type="submit"
              className={`kontak-form__submit ${isSubmitting ? 'kontak-form__submit--loading' : ''}`}
              disabled={isSubmitting}
              id="contact-submit-btn"
            >
              {isSubmitting ? 'MENGIRIM...' : 'KIRIM'}
            </button>
            {submitStatus === 'success' && (
              <p className="kontak-form__status kontak-form__status--success">
                ✓ Pesan berhasil dikirim! Kami akan segera menghubungi Anda.
              </p>
            )}
            {submitStatus === 'error' && (
              <p className="kontak-form__status kontak-form__status--error">
                ✗ Gagal mengirim pesan. Silakan coba lagi nanti.
              </p>
            )}
          </form>
        </div>
      </section>

      {/* Contact Info */}
      <section className="kontak-info reveal" id="kontak-info-section">
        <div className="kontak-info__container">
          <div className="kontak-info__grid">
            <div className="kontak-info__card">
              <div className="kontak-info__icon">
                <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
              </div>
              <h3 className="kontak-info__label">EMAIL</h3>
              <p className="kontak-info__value">{contactInfo?.email || 'tastyfood@gmail.com'}</p>
            </div>

            <div className="kontak-info__card">
              <div className="kontak-info__icon">
                <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                </svg>
              </div>
              <h3 className="kontak-info__label">PHONE</h3>
              <p className="kontak-info__value">{contactInfo?.phone || '+62 812 3456 7890'}</p>
            </div>

            <div className="kontak-info__card">
              <div className="kontak-info__icon">
                <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
              </div>
              <h3 className="kontak-info__label">LOCATION</h3>
              <p className="kontak-info__value">{contactInfo?.address || 'Jakarta Selatan, Indonesia'}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      {contactInfo?.map_embed_url && (
        <section className="kontak-map" id="kontak-map-section">
          <iframe
            src={contactInfo.map_embed_url}
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Tasty Food Location"
          ></iframe>
        </section>
      )}
    </div>
  );
}

export default KontakPage;

