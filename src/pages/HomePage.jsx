import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import NewsCard from '../components/NewsCard';
import aboutService from '../services/aboutService';
import newsService from '../services/newsService';
import galleryService from '../services/galleryService';
import './HomePage.css';

// Food images for the menu section (static, no backend table exists for menu)
const menuItems = [
  {
    id: 1,
    image: '/images/food-bowl-1.png',
    title: 'SALAD BOWL',
    description: 'Salad segar dengan campuran sayuran organik, protein berkualitas, dan dressing spesial kami.',
  },
  {
    id: 2,
    image: '/images/food-bowl-2.png',
    title: 'GRILLED SALMON',
    description: 'Salmon panggang dengan bumbu rempah pilihan, disajikan dengan quinoa dan brokoli segar.',
  },
  {
    id: 3,
    image: '/images/food-bowl-3.png',
    title: 'RAMEN SPESIAL',
    description: 'Ramen Jepang autentik dengan kuah kaldu yang kaya rasa, telur setengah matang, dan udang segar.',
  },
  {
    id: 4,
    image: '/images/food-bowl-4.png',
    title: 'PLATTER MEDITERANIA',
    description: 'Platter mediterania dengan keju artisan, buah ara, zaitun, dan prosciutto pilihan.',
  },
];

function HomePage() {
  const [aboutInfo, setAboutInfo] = useState(null);
  const [featuredNews, setFeaturedNews] = useState(null);
  const [newsList, setNewsList] = useState([]);
  const [galleryList, setGalleryList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Load About
        const aboutData = await aboutService.getAboutInfo();
        setAboutInfo(aboutData);

        // Load Featured News
        const featuredData = await newsService.getFeaturedNews();
        setFeaturedNews(featuredData);

        // Load News List
        const newsData = await newsService.getNews(1);
        setNewsList(newsData.data || []);

        // Load Gallery Images
        const galleryData = await galleryService.getGalleryImages(1);
        setGalleryList(galleryData.data || galleryData || []);
      } catch (error) {
        console.error("Error loading home page data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!loading) {
      // Scroll reveal observer
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

  // Filter out the featured news from the lists so there's no duplicate on the home page
  const otherNews = newsList.filter((item) => item.id !== featuredNews?.id);

  // Slice news list for grid layout (2 items on right, 3 items at bottom)
  const rightNews = otherNews.slice(0, 2);
  const bottomNews = otherNews.slice(2, 5);

  // Slice first 8 gallery images
  const displayGallery = galleryList.slice(0, 8);

  return (
    <div className="home" id="home-page">
      {/* Hero Section */}
      <section className="hero" id="hero-section">
        <div className="hero__container">
          <div className="hero__content">
            <span className="hero__subtitle">HEALTHY</span>
            <h1 className="hero__title">{aboutInfo?.title || 'TASTY FOOD'}</h1>
            <p className="hero__text">
              {aboutInfo?.description || 'Menyajikan hidangan sehat dan lezat dengan bahan-bahan segar pilihan. Kami percaya bahwa makanan yang baik adalah fondasi kehidupan yang sehat. Nikmati pengalaman kuliner terbaik bersama kami.'}
            </p>
            <Link to="/tentang" className="hero__cta" id="hero-cta-btn">
              Tentang Kami
            </Link>
          </div>
          <div className="hero__image-wrapper">
            <img
              src="/images/hero-food.png"
              alt="Healthy tasty food bowl"
              className="hero__image"
            />
            <div className="hero__image-glow"></div>
          </div>
        </div>
      </section>

      {/* Tentang Kami Section */}
      <section className="home-about reveal" id="home-about-section">
        <div className="home-about__container">
          <h2 className="section-title">TENTANG KAMI</h2>
          <div className="section-divider"></div>
          <p className="home-about__text">
            {aboutInfo?.description || 'Tasty Food hadir untuk menyajikan makanan sehat dan lezat bagi keluarga Indonesia. Kami menggunakan bahan-bahan segar berkualitas tinggi yang dipilih langsung dari petani lokal. Setiap hidangan kami dibuat dengan cinta dan perhatian terhadap detail, memastikan Anda mendapatkan nutrisi terbaik tanpa mengorbankan rasa.'}
          </p>
        </div>
      </section>

      {/* Menu Section */}
      <section className="home-menu reveal" id="home-menu-section">
        <div className="home-menu__container">
          <div className="home-menu__grid">
            {menuItems.map((item) => (
              <div className="menu-card" key={item.id}>
                <div className="menu-card__image-wrapper">
                  <img src={item.image} alt={item.title} className="menu-card__image" />
                </div>
                <h3 className="menu-card__title">{item.title}</h3>
                <p className="menu-card__desc">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Berita Section */}
      <section className="home-news reveal" id="home-news-section">
        <div className="home-news__container">
          <h2 className="section-title">BERITA KAMI</h2>
          <div className="section-divider"></div>
          <div className="home-news__grid">
            {/* Featured Article */}
            {featuredNews && (
              <article className="home-news__featured" id="featured-news">
                <div className="home-news__featured-image">
                  <img
                    src={featuredNews.image}
                    alt={featuredNews.title}
                  />
                </div>
                <div className="home-news__featured-content">
                  <h3>{featuredNews.title}</h3>
                  <p>{featuredNews.excerpt}</p>
                  <Link to={`/berita/${featuredNews.id}`} className="home-news__featured-link">
                    Baca selengkapnya
                  </Link>
                </div>
              </article>
            )}
            {/* News Cards */}
            <div className="home-news__cards">
              {rightNews.map((item) => (
                <NewsCard key={item.id} {...item} />
              ))}
            </div>
            {/* Bottom Row */}
            <div className="home-news__bottom-row">
              {bottomNews.map((item) => (
                <NewsCard key={item.id} {...item} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Galeri Section */}
      <section className="home-gallery reveal" id="home-gallery-section">
        <div className="home-gallery__container">
          <h2 className="section-title">GALERI KAMI</h2>
          <div className="section-divider"></div>
          <div className="home-gallery__grid">
            {displayGallery.map((item, index) => (
              <div className="home-gallery__item" key={item.id || index}>
                <img src={item.image} alt={item.title || `Gallery ${index + 1}`} loading="lazy" />
                <div className="home-gallery__overlay">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                  </svg>
                </div>
              </div>
            ))}
          </div>
          <div className="home-gallery__action">
            <Link to="/galeri" className="home-gallery__btn" id="gallery-view-more-btn">
              LIHAT LEBIH BANYAK
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;

