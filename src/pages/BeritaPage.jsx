import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageBanner from '../components/PageBanner';
import NewsCard from '../components/NewsCard';
import newsService from '../services/newsService';
import './BeritaPage.css';

function BeritaPage() {
  const [newsList, setNewsList] = useState([]);
  const [featuredNews, setFeaturedNews] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const featuredData = await newsService.getFeaturedNews();
        setFeaturedNews(featuredData);

        const newsData = await newsService.getNews(1);
        setNewsList(newsData.data || []);
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
  }, [loading, newsList]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#1a1a1a', color: '#f5a623', fontSize: '24px' }}>
        MEMUAT DATA...
      </div>
    );
  }

  return (
    <div className="berita-page" id="berita-page">
      <PageBanner
        title="BERITA KAMI"
        backgroundImage="/images/food-banner.png"
      />

      {/* Featured Article */}
      {featuredNews && (
        <section className="berita-featured reveal" id="berita-featured-section">
          <div className="berita-featured__container">
            <div className="berita-featured__image">
              <img
                src={featuredNews.image}
                alt={featuredNews.title}
              />
            </div>
            <div className="berita-featured__content">
              <h2 className="berita-featured__title">
                {featuredNews.title}
              </h2>
              <p className="berita-featured__text">
                {featuredNews.excerpt}
              </p>
              <Link to={`/berita/${featuredNews.id}`} className="berita-featured__btn" id="featured-read-more-btn">
                BACA SELENGKAPNYA
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Other News */}
      <section className="berita-list reveal" id="berita-list-section">
        <div className="berita-list__container">
          <h2 className="berita-list__title">BERITA LAINNYA</h2>
          <div className="berita-list__grid">
            {newsList.map((item) => (
              <NewsCard key={item.id} {...item} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default BeritaPage;

