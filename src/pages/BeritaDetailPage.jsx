import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import PageBanner from '../components/PageBanner';
import newsService from '../services/newsService';
import './BeritaDetailPage.css';

function BeritaDetailPage() {
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNewsDetail = async () => {
      try {
        setLoading(true);
        const data = await newsService.getNewsById(id);
        setNews(data);
      } catch (err) {
        console.error("Error fetching news detail:", err);
        setError("Gagal memuat detail berita.");
      } finally {
        setLoading(false);
      }
    };
    fetchNewsDetail();
  }, [id]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#1a1a1a', color: '#f5a623', fontSize: '24px' }}>
        MEMUAT DATA...
      </div>
    );
  }

  if (error || !news) {
    return (
      <div className="berita-detail-error">
        <PageBanner title="DETAIL BERITA" backgroundImage="/images/food-banner.png" />
        <div className="berita-detail-error__container">
          <h2>{error || 'Berita tidak ditemukan'}</h2>
          <Link to="/berita" className="back-btn">Kembali ke Berita</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="berita-detail-page" id="berita-detail-page">
      <PageBanner title="DETAIL BERITA" backgroundImage="/images/food-banner.png" />
      
      <div className="berita-detail__container">
        <Link to="/berita" className="berita-detail__back" id="back-to-news-list-btn">
          <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
          </svg>
          <span>Kembali ke Berita</span>
        </Link>

        <article className="berita-detail__article">
          <h1 className="berita-detail__title">{news.title}</h1>
          <div className="berita-detail__meta">
            <span className="berita-detail__date">
              {news.published_at ? new Date(news.published_at).toLocaleDateString('id-ID', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }) : ''}
            </span>
          </div>

          {news.image && (
            <div className="berita-detail__image-wrapper">
              <img src={news.image} alt={news.title} className="berita-detail__image" />
            </div>
          )}

          <div className="berita-detail__content">
            {news.content ? news.content.split('\n').map((paragraph, index) => (
              paragraph.trim() && <p key={index}>{paragraph.trim()}</p>
            )) : <p>{news.excerpt}</p>}
          </div>
        </article>
      </div>
    </div>
  );
}

export default BeritaDetailPage;
