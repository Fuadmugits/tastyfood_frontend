import { Link } from 'react-router-dom';
import './NewsCard.css';

function NewsCard({ id, image, title, excerpt, className = '' }) {
  return (
    <article className={`news-card ${className}`} id={`news-card-${id}`}>
      <div className="news-card__image-wrapper">
        <img src={image} alt={title} className="news-card__image" loading="lazy" />
        <div className="news-card__image-overlay"></div>
      </div>
      <div className="news-card__content">
        <h3 className="news-card__title">{title}</h3>
        <p className="news-card__excerpt">{excerpt}</p>
        <div className="news-card__footer">
          <Link to={`/berita/${id}`} className="news-card__link">
            Baca selengkapnya
          </Link>
          <button className="news-card__more" aria-label="More options">
            •••
          </button>
        </div>
      </div>
    </article>
  );
}

export default NewsCard;
