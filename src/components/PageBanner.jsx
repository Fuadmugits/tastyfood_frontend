import './PageBanner.css';

function PageBanner({ title, backgroundImage }) {
  return (
    <section
      className="page-banner"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="page-banner__overlay">
        <div className="page-banner__content">
          <h1 className="page-banner__title">{title}</h1>
        </div>
      </div>
    </section>
  );
}

export default PageBanner;
