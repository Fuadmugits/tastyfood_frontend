import { useEffect, useState } from 'react';
import PageBanner from '../components/PageBanner';
import aboutService from '../services/aboutService';
import './TentangPage.css';

function TentangPage() {
  const [aboutInfo, setAboutInfo] = useState(null);
  const [visiMisi, setVisiMisi] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const aboutData = await aboutService.getAboutInfo();
        setAboutInfo(aboutData);

        const visiMisiData = await aboutService.getVisiMisi();
        setVisiMisi(visiMisiData);
      } catch (error) {
        console.error("Error fetching about/visi-misi data:", error);
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
  }, [loading]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#1a1a1a', color: '#f5a623', fontSize: '24px' }}>
        MEMUAT DATA...
      </div>
    );
  }

  const visi = visiMisi.find((item) => item.type === 'visi');
  const misi = visiMisi.find((item) => item.type === 'misi');

  return (
    <div className="tentang-page" id="tentang-page">
      <PageBanner
        title="TENTANG KAMI"
        backgroundImage="/images/food-banner.png"
      />

      {/* About Section */}
      <section className="tentang-about reveal" id="tentang-about-section">
        <div className="tentang-about__container">
          <div className="tentang-about__content">
            <h2 className="tentang-about__title">{aboutInfo?.title || 'TASTY FOOD'}</h2>
            {aboutInfo?.description_bold && (
              <p className="tentang-about__text tentang-about__text--bold">
                {aboutInfo.description_bold}
              </p>
            )}
            <p className="tentang-about__text">
              {aboutInfo?.description || 'Tasty Food adalah perusahaan kuliner yang berdedikasi untuk menyajikan makanan sehat dan lezat bagi keluarga Indonesia.'}
            </p>
          </div>
          <div className="tentang-about__images">
            <img
              src={aboutInfo?.image_1 || "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=350&fit=crop"}
              alt="About Tasty Food"
              className="tentang-about__img tentang-about__img--1"
            />
            <img
              src={aboutInfo?.image_2 || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=350&h=350&fit=crop"}
              alt="Fresh ingredients"
              className="tentang-about__img tentang-about__img--2"
            />
          </div>
        </div>
      </section>

      {/* Visi Section */}
      {visi && (
        <section className="tentang-visi reveal" id="tentang-visi-section">
          <div className="tentang-visi__container">
            <div className="tentang-visi__images">
              <img
                src={visi.image || "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=300&h=350&fit=crop"}
                alt="Visi Tasty Food"
                className="tentang-visi__img tentang-visi__img--1"
              />
              <img
                src="https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=300&h=350&fit=crop"
                alt="Visi Tasty Food"
                className="tentang-visi__img tentang-visi__img--2"
              />
            </div>
            <div className="tentang-visi__content">
              <h2 className="tentang-visi__title">VISI</h2>
              <p className="tentang-visi__text">
                {visi.content}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Misi Section */}
      {misi && (
        <section className="tentang-misi reveal" id="tentang-misi-section">
          <div className="tentang-misi__container">
            <div className="tentang-misi__content">
              <h2 className="tentang-misi__title">MISI</h2>
              <p className="tentang-misi__text">
                {misi.content}
              </p>
            </div>
            <div className="tentang-misi__image">
              <img
                src={misi.image || "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&h=400&fit=crop"}
                alt="Misi Tasty Food"
                className="tentang-misi__img"
              />
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default TentangPage;

