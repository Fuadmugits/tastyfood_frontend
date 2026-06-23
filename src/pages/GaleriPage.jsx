import { useState, useEffect, useCallback } from 'react';
import PageBanner from '../components/PageBanner';
import galleryService from '../services/galleryService';
import './GaleriPage.css';

function GaleriPage() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        setLoading(true);
        // Fetch page 1 (returns paginated data with data array)
        const response = await galleryService.getGalleryImages(1);
        // Laravel paginated result has 'data' property
        setImages(response.data || response || []);
      } catch (error) {
        console.error("Error fetching gallery images:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  // Determine slider images (first 3 images from database, or fallback to static ones if empty)
  const sliderImages = images.slice(0, 3).map((item) => item.image) || [
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=900&h=500&fit=crop',
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=900&h=500&fit=crop',
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=900&h=500&fit=crop',
  ];

  const nextSlide = useCallback(() => {
    if (sliderImages.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
  }, [sliderImages.length]);

  const prevSlide = useCallback(() => {
    if (sliderImages.length === 0) return;
    setCurrentSlide((prev) => (prev - 1 + sliderImages.length) % sliderImages.length);
  }, [sliderImages.length]);

  useEffect(() => {
    if (sliderImages.length > 0) {
      const interval = setInterval(nextSlide, 5000);
      return () => clearInterval(interval);
    }
  }, [nextSlide, sliderImages.length]);

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
  }, [loading, images]);

  const openLightbox = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = '';
  };

  const lightboxNext = () => {
    setLightboxIndex((prev) => (prev + 1) % images.length);
  };

  const lightboxPrev = () => {
    setLightboxIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#1a1a1a', color: '#f5a623', fontSize: '24px' }}>
        MEMUAT DATA...
      </div>
    );
  }

  return (
    <div className="galeri-page" id="galeri-page">
      <PageBanner
        title="GALERI KAMI"
        backgroundImage="/images/food-banner.png"
      />

      {/* Image Slider */}
      {sliderImages.length > 0 && (
        <section className="galeri-slider reveal" id="galeri-slider-section">
          <div className="galeri-slider__container">
            <div className="galeri-slider__wrapper">
              <div
                className="galeri-slider__track"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {sliderImages.map((img, index) => (
                  <div className="galeri-slider__slide" key={index}>
                    <img src={img} alt={`Slide ${index + 1}`} />
                  </div>
                ))}
              </div>

              <button
                className="galeri-slider__btn galeri-slider__btn--prev"
                onClick={prevSlide}
                aria-label="Previous slide"
                id="slider-prev-btn"
              >
                ‹
              </button>
              <button
                className="galeri-slider__btn galeri-slider__btn--next"
                onClick={nextSlide}
                aria-label="Next slide"
                id="slider-next-btn"
              >
                ›
              </button>

              <div className="galeri-slider__dots">
                {sliderImages.map((_, index) => (
                  <button
                    key={index}
                    className={`galeri-slider__dot ${currentSlide === index ? 'galeri-slider__dot--active' : ''}`}
                    onClick={() => setCurrentSlide(index)}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Gallery Grid */}
      <section className="galeri-grid reveal" id="galeri-grid-section">
        <div className="galeri-grid__container">
          <div className="galeri-grid__items">
            {images.map((item, index) => (
              <div
                className="galeri-grid__item"
                key={item.id || index}
                onClick={() => openLightbox(index)}
              >
                <img src={item.image} alt={item.title || `Gallery ${index + 1}`} loading="lazy" />
                <div className="galeri-grid__overlay">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
                    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightboxOpen && images.length > 0 && (
        <div className="lightbox" onClick={closeLightbox} id="lightbox-modal">
          <div className="lightbox__content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox__close" onClick={closeLightbox} aria-label="Close lightbox">
              ✕
            </button>
            <button className="lightbox__nav lightbox__nav--prev" onClick={lightboxPrev} aria-label="Previous image">
              ‹
            </button>
            <img
              src={images[lightboxIndex]?.image}
              alt={images[lightboxIndex]?.title || `Gallery ${lightboxIndex + 1}`}
              className="lightbox__image"
            />
            <button className="lightbox__nav lightbox__nav--next" onClick={lightboxNext} aria-label="Next image">
              ›
            </button>
            <div className="lightbox__counter">
              {lightboxIndex + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GaleriPage;

