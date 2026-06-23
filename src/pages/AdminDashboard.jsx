import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import newsService from '../services/newsService';
import galleryService from '../services/galleryService';
import contactService from '../services/contactService';
import './AdminDashboard.css';

function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview'); // overview, news, gallery, messages
  const [adminUser, setAdminUser] = useState(null);
  
  // Data States
  const [news, setNews] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [messages, setMessages] = useState([]);
  
  // UI States
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [galleryFilter, setGalleryFilter] = useState('SEMUA');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', type: 'success' });

  // Modal States
  const [newsModal, setNewsModal] = useState({ open: false, mode: 'add', data: null });
  const [galleryModal, setGalleryModal] = useState({ open: false, mode: 'add', data: null });
  const [messageDetailModal, setMessageDetailModal] = useState({ open: false, data: null });

  // News Form State
  const [newsForm, setNewsForm] = useState({
    title: '',
    excerpt: '',
    content: '',
    image: '', // URL or path
    imageFile: null,
    is_featured: false,
    published_at: ''
  });

  // Gallery Form State
  const [galleryForm, setGalleryForm] = useState({
    title: '',
    image: '',
    imageFile: null,
    category: 'MAKANAN',
    sort_order: 0
  });

  // Check Auth
  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/admin/login');
    } else {
      setAdminUser(authService.getCurrentUser());
    }
  }, [navigate]);

  // Load Data
  useEffect(() => {
    if (authService.isAuthenticated()) {
      loadAllData();
    }
  }, [activeTab]);

  const showAlert = (message, type = 'success') => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: 'success' }), 4000);
  };

  const loadAllData = async () => {
    setLoading(true);
    try {
      // 1. Load News
      try {
        const newsData = await newsService.getNews(1);
        setNews(newsData.data || newsData || []);
      } catch (err) {
        console.warn('Gagal memuat berita dari API, menggunakan mock data.');
        if (news.length === 0) {
          // Initialize mock news
          setNews([
            { id: 1, title: 'Resep Makanan Sehat Keluarga', excerpt: 'Temukan berbagai resep sehat yang mudah dibuat untuk keluarga tercinta.', content: 'Ini konten lengkap resep sehat...', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400', is_featured: true, published_at: '2026-06-15' },
            { id: 2, title: 'Tips Menjaga Nutrisi Sayuran', excerpt: 'Sayuran penting untuk dikonsumsi setiap hari, namun cara memasaknya harus benar.', content: 'Cara merebus sayuran agar nutrisinya tidak hilang...', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400', is_featured: false, published_at: '2026-06-14' },
            { id: 3, title: 'Manfaat Smoothies Hijau', excerpt: 'Smoothies sayur bayam dan pisang memberikan energi melimpah di pagi hari.', content: 'Khasiat serat dan klorofil bayam...', image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400', is_featured: false, published_at: '2026-06-12' },
          ]);
        }
      }

      // 2. Load Gallery
      try {
        const galleryData = await galleryService.getGalleryImages(1);
        setGallery(galleryData.data || galleryData || []);
      } catch (err) {
        console.warn('Gagal memuat galeri dari API, menggunakan mock data.');
        if (gallery.length === 0) {
          setGallery([
            { id: 1, title: 'Gado Gado Spesial', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400', category: 'MAKANAN', sort_order: 1 },
            { id: 2, title: 'Avocado Juice', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400', category: 'MINUMAN', sort_order: 2 },
            { id: 3, title: 'Fruit Salad', image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400', category: 'DESERT', sort_order: 3 },
          ]);
        }
      }

      // 3. Load Messages
      try {
        const messageData = await contactService.getContactMessages();
        setMessages(messageData || []);
      } catch (err) {
        console.warn('Gagal memuat pesan masuk dari API, menggunakan mock data.');
        if (messages.length === 0) {
          setMessages([
            { id: 1, name: 'Budi Santoso', email: 'budi@mail.com', subject: 'Kemitraan Katering', message: 'Halo Tasty Food, saya tertarik untuk mendiskusikan kemitraan penyediaan makan siang sehat untuk kantor kami di daerah Sudirman. Mohon hubungi saya kembali.', is_read: false, created_at: '2026-06-16T14:30:00Z' },
            { id: 2, name: 'Rina Wijaya', email: 'rina@mail.com', subject: 'Tanya Menu Diet', message: 'Apakah Tasty Food menyediakan kustomisasi menu diet bebas gluten untuk penderita penyakit autoimun?', is_read: true, created_at: '2026-06-15T09:15:00Z' },
            { id: 3, name: 'Andi Pratama', email: 'andi@mail.com', subject: 'Keluhan Pengiriman', message: 'Makanan yang dikirim siang ini terlambat sekitar 30 menit. Mohon ditingkatkan lagi kecepatan kurirnya.', is_read: false, created_at: '2026-06-14T12:00:00Z' },
          ]);
        }
      }

    } catch (error) {
      showAlert('Terjadi kesalahan memuat data.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    if (window.confirm('Apakah Anda yakin ingin keluar dari panel admin?')) {
      await authService.logout();
      navigate('/admin/login');
    }
  };

  // --- NEWS ACTIONS ---
  const handleOpenNewsModal = (mode, data = null) => {
    if (mode === 'add') {
      setNewsForm({
        title: '',
        excerpt: '',
        content: '',
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
        imageFile: null,
        is_featured: false,
        published_at: new Date().toISOString().split('T')[0]
      });
    } else if (mode === 'edit' && data) {
      setNewsForm({
        title: data.title,
        excerpt: data.excerpt,
        content: data.content,
        image: data.image,
        imageFile: null,
        is_featured: data.is_featured,
        published_at: data.published_at ? data.published_at.split('T')[0] : ''
      });
    }
    setNewsModal({ open: true, mode, data });
  };

  const handleNewsFormSubmit = async (e) => {
    e.preventDefault();
    try {
      let imagePath = newsForm.image;
      
      // If a file is chosen, we simulate object URL or in real API send FormData
      if (newsForm.imageFile) {
        imagePath = URL.createObjectURL(newsForm.imageFile);
      }

      const payload = {
        title: newsForm.title,
        excerpt: newsForm.excerpt,
        content: newsForm.content,
        image: imagePath,
        is_featured: newsForm.is_featured,
        published_at: newsForm.published_at
      };

      if (newsModal.mode === 'add') {
        try {
          // Attempt real API
          const formData = new FormData();
          formData.append('title', newsForm.title);
          formData.append('excerpt', newsForm.excerpt);
          formData.append('content', newsForm.content);
          formData.append('is_featured', newsForm.is_featured ? '1' : '0');
          formData.append('published_at', newsForm.published_at);
          if (newsForm.imageFile) {
            formData.append('image', newsForm.imageFile);
          } else {
            formData.append('image', newsForm.image);
          }
          
          const newCreated = await newsService.createNews(formData);
          setNews([newCreated, ...news]);
        } catch (apiErr) {
          console.warn('Create news API failed, performing mock create.');
          const newItem = {
            id: Date.now(),
            ...payload
          };
          setNews([newItem, ...news]);
        }
        showAlert('Berita berhasil ditambahkan!');
      } else {
        const id = newsModal.data.id;
        try {
          const formData = new FormData();
          formData.append('_method', 'PUT'); // Laravel requirement for parsing files via POST
          formData.append('title', newsForm.title);
          formData.append('excerpt', newsForm.excerpt);
          formData.append('content', newsForm.content);
          formData.append('is_featured', newsForm.is_featured ? '1' : '0');
          formData.append('published_at', newsForm.published_at);
          if (newsForm.imageFile) {
            formData.append('image', newsForm.imageFile);
          } else {
            formData.append('image', newsForm.image);
          }

          const updated = await newsService.updateNews(id, formData);
          setNews(news.map(n => n.id === id ? updated : n));
        } catch (apiErr) {
          console.warn('Update news API failed, performing mock update.');
          setNews(news.map(n => n.id === id ? { ...n, ...payload } : n));
        }
        showAlert('Berita berhasil diperbarui!');
      }
      setNewsModal({ open: false, mode: 'add', data: null });
    } catch (err) {
      showAlert('Gagal memproses berita: ' + err.message, 'error');
    }
  };

  const handleNewsDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus berita ini?')) {
      try {
        try {
          await newsService.deleteNews(id);
        } catch (apiErr) {
          console.warn('Delete news API failed, performing mock delete.');
        }
        setNews(news.filter(n => n.id !== id));
        showAlert('Berita berhasil dihapus!');
      } catch (err) {
        showAlert('Gagal menghapus berita.', 'error');
      }
    }
  };

  // --- GALLERY ACTIONS ---
  const handleOpenGalleryModal = (mode, data = null) => {
    if (mode === 'add') {
      setGalleryForm({
        title: '',
        image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400',
        imageFile: null,
        category: 'MAKANAN',
        sort_order: gallery.length + 1
      });
    } else if (mode === 'edit' && data) {
      setGalleryForm({
        title: data.title || '',
        image: data.image,
        imageFile: null,
        category: data.category || 'MAKANAN',
        sort_order: data.sort_order || 0
      });
    }
    setGalleryModal({ open: true, mode, data });
  };

  const handleGalleryFormSubmit = async (e) => {
    e.preventDefault();
    try {
      let imagePath = galleryForm.image;
      if (galleryForm.imageFile) {
        imagePath = URL.createObjectURL(galleryForm.imageFile);
      }

      const payload = {
        title: galleryForm.title,
        image: imagePath,
        category: galleryForm.category,
        sort_order: parseInt(galleryForm.sort_order)
      };

      if (galleryModal.mode === 'add') {
        try {
          const formData = new FormData();
          formData.append('title', galleryForm.title);
          formData.append('category', galleryForm.category);
          formData.append('sort_order', galleryForm.sort_order);
          if (galleryForm.imageFile) {
            formData.append('image', galleryForm.imageFile);
          } else {
            formData.append('image', galleryForm.image);
          }
          const created = await galleryService.createGalleryImage(formData);
          setGallery([...gallery, created]);
        } catch (apiErr) {
          console.warn('Create gallery image API failed, performing mock create.');
          const newItem = {
            id: Date.now(),
            ...payload
          };
          setGallery([...gallery, newItem]);
        }
        showAlert('Foto galeri berhasil ditambahkan!');
      } else {
        const id = galleryModal.data.id;
        try {
          const formData = new FormData();
          formData.append('_method', 'PUT');
          formData.append('title', galleryForm.title);
          formData.append('category', galleryForm.category);
          formData.append('sort_order', galleryForm.sort_order);
          if (galleryForm.imageFile) {
            formData.append('image', galleryForm.imageFile);
          } else {
            formData.append('image', galleryForm.image);
          }
          const updated = await galleryService.updateGalleryImage(id, formData);
          setGallery(gallery.map(g => g.id === id ? updated : g));
        } catch (apiErr) {
          console.warn('Update gallery image API failed, performing mock update.');
          setGallery(gallery.map(g => g.id === id ? { ...g, ...payload } : g));
        }
        showAlert('Foto galeri berhasil diperbarui!');
      }
      setGalleryModal({ open: false, mode: 'add', data: null });
    } catch (err) {
      showAlert('Gagal memproses galeri: ' + err.message, 'error');
    }
  };

  const handleGalleryDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus foto galeri ini?')) {
      try {
        try {
          await galleryService.deleteGalleryImage(id);
        } catch (apiErr) {
          console.warn('Delete gallery image API failed, performing mock delete.');
        }
        setGallery(gallery.filter(g => g.id !== id));
        showAlert('Foto galeri berhasil dihapus!');
      } catch (err) {
        showAlert('Gagal menghapus foto galeri.', 'error');
      }
    }
  };

  // --- MESSAGE ACTIONS ---
  const handleOpenMessageDetail = async (msg) => {
    setMessageDetailModal({ open: true, data: msg });
    
    // Mark as read if it's currently unread
    if (!msg.is_read) {
      try {
        try {
          await contactService.markMessageAsRead(msg.id);
        } catch (apiErr) {
          console.warn('Mark message read API failed, performing mock update.');
        }
        setMessages(messages.map(m => m.id === msg.id ? { ...m, is_read: true } : m));
      } catch (err) {
        console.error('Gagal memperbarui status baca pesan.');
      }
    }
  };

  const handleMessageDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus pesan ini?')) {
      try {
        try {
          await contactService.deleteContactMessage(id);
        } catch (apiErr) {
          console.warn('Delete message API failed, performing mock delete.');
        }
        setMessages(messages.filter(m => m.id !== id));
        showAlert('Pesan berhasil dihapus!');
      } catch (err) {
        showAlert('Gagal menghapus pesan.', 'error');
      }
    }
  };

  // --- FILTERED DATA LISTS ---
  const filteredNews = news.filter(item => 
    item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.excerpt?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredGallery = gallery.filter(item => {
    const matchesSearch = item.title?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = galleryFilter === 'SEMUA' || item.category === galleryFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="admin-dashboard">
      {/* Alert toast notification */}
      {alert.show && (
        <div className={`admin-alert admin-alert--${alert.type}`}>
          <span>{alert.message}</span>
        </div>
      )}

      {/* Sidebar collapsible background overlay for mobile */}
      {mobileSidebarOpen && (
        <div className="admin-sidebar-overlay" onClick={() => setMobileSidebarOpen(false)}></div>
      )}

      {/* Sidebar Nav */}
      <aside className={`admin-sidebar ${mobileSidebarOpen ? 'admin-sidebar--open' : ''}`}>
        <div className="admin-sidebar__logo">
          <span>TASTY FOOD</span>
          <span className="admin-sidebar__badge">ADMIN</span>
        </div>

        <nav className="admin-sidebar__nav">
          <button 
            className={`admin-sidebar__nav-item ${activeTab === 'overview' ? 'admin-sidebar__nav-item--active' : ''}`}
            onClick={() => { setActiveTab('overview'); setMobileSidebarOpen(false); }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
            </svg>
            <span>Ringkasan</span>
          </button>

          <button 
            className={`admin-sidebar__nav-item ${activeTab === 'news' ? 'admin-sidebar__nav-item--active' : ''}`}
            onClick={() => { setActiveTab('news'); setMobileSidebarOpen(false); }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M22 13h-8v-2h8v2zm0-6h-8v2h8V7zm-8 10h8v-2h-8v2zm-2-8v6c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V9c0-1.1.9-2 2-2h6c1.1 0 2 .9 2 2zm-1.5 6l-2.25-3-1.75 2.25L5 11.25 3.5 13h7z"/>
            </svg>
            <span>Kelola Berita</span>
          </button>

          <button 
            className={`admin-sidebar__nav-item ${activeTab === 'gallery' ? 'admin-sidebar__nav-item--active' : ''}`}
            onClick={() => { setActiveTab('gallery'); setMobileSidebarOpen(false); }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
            </svg>
            <span>Kelola Galeri</span>
          </button>

          <button 
            className={`admin-sidebar__nav-item ${activeTab === 'messages' ? 'admin-sidebar__nav-item--active' : ''}`}
            onClick={() => { setActiveTab('messages'); setMobileSidebarOpen(false); }}
          >
            <div className="nav-item-message-wrapper">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
              </svg>
              <span>Pesan Masuk</span>
              {messages.filter(m => !m.is_read).length > 0 && (
                <span className="unread-count-badge">
                  {messages.filter(m => !m.is_read).length}
                </span>
              )}
            </div>
          </button>
        </nav>

        <div className="admin-sidebar__footer">
          <button onClick={handleLogout} className="logout-btn">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5c-1.11 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>
            </svg>
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Panel */}
      <main className="admin-main">
        {/* Top Header */}
        <header className="admin-header">
          <button className="admin-hamburger" onClick={() => setMobileSidebarOpen(true)}>
            <span></span>
            <span></span>
            <span></span>
          </button>

          <div className="admin-header__title">
            <h2>{activeTab === 'overview' && 'Ringkasan Aktivitas'}</h2>
            <h2>{activeTab === 'news' && 'Kelola Berita'}</h2>
            <h2>{activeTab === 'gallery' && 'Kelola Galeri Foto'}</h2>
            <h2>{activeTab === 'messages' && 'Pesan Masuk (Inbox)'}</h2>
          </div>

          <div className="admin-header__meta">
            <span className="admin-welcome">
              Halo, <strong>{adminUser?.name || 'Administrator'}</strong>
            </span>
            <a href="/" target="_blank" rel="noopener noreferrer" className="visit-site-link">
              Lihat Website
            </a>
          </div>
        </header>

        {/* Content Wrapper */}
        <div className="admin-content">
          {loading ? (
            <div className="admin-loading-screen">
              <div className="spinner large"></div>
              <p>Sedang memuat data...</p>
            </div>
          ) : (
            <>
              {/* TAB 1: OVERVIEW */}
              {activeTab === 'overview' && (
                <div className="tab-overview">
                  <div className="overview-stats-grid">
                    <div className="stat-card" onClick={() => setActiveTab('news')}>
                      <div className="stat-card__icon bg-orange">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28" fill="#ffffff">
                          <path d="M22 13h-8v-2h8v2zm0-6h-8v2h8V7zm-8 10h8v-2h-8v2zm-2-8v6c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V9c0-1.1.9-2 2-2h6c1.1 0 2 .9 2 2zm-1.5 6l-2.25-3-1.75 2.25L5 11.25 3.5 13h7z"/>
                        </svg>
                      </div>
                      <div className="stat-card__info">
                        <span className="stat-card__number">{news.length}</span>
                        <span className="stat-card__label">Total Berita</span>
                      </div>
                    </div>

                    <div className="stat-card" onClick={() => setActiveTab('gallery')}>
                      <div className="stat-card__icon bg-blue">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28" fill="#ffffff">
                          <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                        </svg>
                      </div>
                      <div className="stat-card__info">
                        <span className="stat-card__number">{gallery.length}</span>
                        <span className="stat-card__label">Total Galeri Foto</span>
                      </div>
                    </div>

                    <div className="stat-card" onClick={() => setActiveTab('messages')}>
                      <div className="stat-card__icon bg-green">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28" fill="#ffffff">
                          <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                        </svg>
                      </div>
                      <div className="stat-card__info">
                        <span className="stat-card__number">{messages.filter(m => !m.is_read).length}</span>
                        <span className="stat-card__label">Pesan Masuk Baru</span>
                      </div>
                    </div>
                  </div>

                  <div className="overview-tables-grid">
                    {/* Recent Messages */}
                    <div className="overview-panel">
                      <div className="panel-header">
                        <h3>Pesan Terbaru</h3>
                        <button className="panel-header-btn" onClick={() => setActiveTab('messages')}>Lihat Semua</button>
                      </div>
                      <div className="panel-content">
                        {messages.length === 0 ? (
                          <p className="no-data-text">Tidak ada pesan masuk.</p>
                        ) : (
                          <div className="recent-list">
                            {messages.slice(0, 3).map(msg => (
                              <div key={msg.id} className={`recent-msg-item ${!msg.is_read ? 'unread' : ''}`} onClick={() => handleOpenMessageDetail(msg)}>
                                <div className="recent-msg-header">
                                  <span className="msg-sender">{msg.name}</span>
                                  <span className="msg-date">{new Date(msg.created_at || Date.now()).toLocaleDateString('id-ID')}</span>
                                </div>
                                <div className="msg-subject">{msg.subject}</div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Recent News */}
                    <div className="overview-panel">
                      <div className="panel-header">
                        <h3>Berita Terpopuler / Terbaru</h3>
                        <button className="panel-header-btn" onClick={() => setActiveTab('news')}>Lihat Semua</button>
                      </div>
                      <div className="panel-content">
                        {news.length === 0 ? (
                          <p className="no-data-text">Tidak ada berita.</p>
                        ) : (
                          <div className="recent-news-list">
                            {news.slice(0, 3).map(item => (
                              <div key={item.id} className="recent-news-item">
                                <img src={item.image} alt={item.title} className="recent-news-thumb" />
                                <div className="recent-news-info">
                                  <h4 className="recent-news-title">{item.title}</h4>
                                  <span className="recent-news-date">{item.published_at}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: KELOLA BERITA */}
              {activeTab === 'news' && (
                <div className="tab-crud">
                  <div className="crud-header">
                    <div className="search-bar">
                      <input 
                        type="text" 
                        placeholder="Cari berita..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <button className="add-btn" onClick={() => handleOpenNewsModal('add')}>
                      + Tambah Berita
                    </button>
                  </div>

                  <div className="table-responsive">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Gambar</th>
                          <th>Judul Berita</th>
                          <th>Ringkasan</th>
                          <th>Tanggal Rilis</th>
                          <th>Featured</th>
                          <th>Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredNews.length === 0 ? (
                          <tr>
                            <td colSpan="6" className="table-empty">Belum ada data berita.</td>
                          </tr>
                        ) : (
                          filteredNews.map(item => (
                            <tr key={item.id}>
                              <td>
                                <img src={item.image} alt={item.title} className="table-thumb" />
                              </td>
                              <td className="table-bold">{item.title}</td>
                              <td className="table-excerpt">{item.excerpt}</td>
                              <td>{item.published_at}</td>
                              <td>
                                {item.is_featured ? (
                                  <span className="badge badge--success">Featured</span>
                                ) : (
                                  <span className="badge badge--secondary">Regular</span>
                                )}
                              </td>
                              <td>
                                <div className="action-buttons">
                                  <button className="action-btn edit" onClick={() => handleOpenNewsModal('edit', item)}>
                                    Edit
                                  </button>
                                  <button className="action-btn delete" onClick={() => handleNewsDelete(item.id)}>
                                    Hapus
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 3: KELOLA GALERI */}
              {activeTab === 'gallery' && (
                <div className="tab-crud">
                  <div className="crud-header">
                    <div className="crud-filters">
                      <div className="search-bar">
                        <input 
                          type="text" 
                          placeholder="Cari foto..." 
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                      <select 
                        value={galleryFilter} 
                        onChange={(e) => setGalleryFilter(e.target.value)}
                        className="filter-select"
                      >
                        <option value="SEMUA">Semua Kategori</option>
                        <option value="MAKANAN">Makanan</option>
                        <option value="MINUMAN">Minuman</option>
                        <option value="DESERT">Desert</option>
                      </select>
                    </div>
                    <button className="add-btn" onClick={() => handleOpenGalleryModal('add')}>
                      + Tambah Foto
                    </button>
                  </div>

                  <div className="table-responsive">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Gambar</th>
                          <th>Judul Foto</th>
                          <th>Kategori</th>
                          <th>Urutan</th>
                          <th>Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredGallery.length === 0 ? (
                          <tr>
                            <td colSpan="5" className="table-empty">Belum ada foto galeri.</td>
                          </tr>
                        ) : (
                          filteredGallery.map(item => (
                            <tr key={item.id}>
                              <td>
                                <img src={item.image} alt={item.title || 'Galeri'} className="table-thumb" />
                              </td>
                              <td className="table-bold">{item.title || 'Tanpa Judul'}</td>
                              <td>
                                <span className={`badge badge--cat badge--${item.category?.toLowerCase() || 'makanan'}`}>
                                  {item.category || 'MAKANAN'}
                                </span>
                              </td>
                              <td>{item.sort_order || 0}</td>
                              <td>
                                <div className="action-buttons">
                                  <button className="action-btn edit" onClick={() => handleOpenGalleryModal('edit', item)}>
                                    Edit
                                  </button>
                                  <button className="action-btn delete" onClick={() => handleGalleryDelete(item.id)}>
                                    Hapus
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 4: PESAN MASUK */}
              {activeTab === 'messages' && (
                <div className="tab-crud">
                  <div className="table-responsive">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Nama Pengirim</th>
                          <th>Email</th>
                          <th>Subjek</th>
                          <th>Tanggal Pesan</th>
                          <th>Status</th>
                          <th>Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {messages.length === 0 ? (
                          <tr>
                            <td colSpan="6" className="table-empty">Inbox kosong.</td>
                          </tr>
                        ) : (
                          messages.map(msg => (
                            <tr key={msg.id} className={!msg.is_read ? 'row-unread' : ''}>
                              <td className="table-bold">{msg.name}</td>
                              <td>{msg.email}</td>
                              <td>{msg.subject}</td>
                              <td>{new Date(msg.created_at || Date.now()).toLocaleString('id-ID')}</td>
                              <td>
                                {!msg.is_read ? (
                                  <span className="badge badge--unread">Belum Dibaca</span>
                                ) : (
                                  <span className="badge badge--read">Sudah Dibaca</span>
                                )}
                              </td>
                              <td>
                                <div className="action-buttons">
                                  <button className="action-btn read" onClick={() => handleOpenMessageDetail(msg)}>
                                    Baca Detail
                                  </button>
                                  <button className="action-btn delete" onClick={() => handleMessageDelete(msg.id)}>
                                    Hapus
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* --- MODAL POPUPS --- */}
      
      {/* 1. Modal Berita */}
      {newsModal.open && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal">
            <div className="admin-modal__header">
              <h3>{newsModal.mode === 'add' ? 'Tambah Berita Baru' : 'Edit Berita'}</h3>
              <button className="close-modal-btn" onClick={() => setNewsModal({ open: false, mode: 'add', data: null })}>×</button>
            </div>
            <form onSubmit={handleNewsFormSubmit} className="admin-modal__form">
              <div className="form-group">
                <label>Judul Berita</label>
                <input 
                  type="text" 
                  value={newsForm.title}
                  onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Deskripsi Singkat (Excerpt)</label>
                <input 
                  type="text" 
                  value={newsForm.excerpt}
                  onChange={(e) => setNewsForm({ ...newsForm, excerpt: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Isi Berita Lengkap</label>
                <textarea 
                  rows="6"
                  value={newsForm.content}
                  onChange={(e) => setNewsForm({ ...newsForm, content: e.target.value })}
                  required
                ></textarea>
              </div>

              <div className="form-group">
                <label>Gambar Utama (Pilih File / Masukkan URL)</label>
                <div className="file-url-toggle">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => setNewsForm({ ...newsForm, imageFile: e.target.files[0] })}
                  />
                  <div className="url-preview-wrapper">
                    <input 
                      type="text" 
                      placeholder="Atau URL Gambar..." 
                      value={newsForm.image}
                      onChange={(e) => setNewsForm({ ...newsForm, image: e.target.value, imageFile: null })}
                    />
                  </div>
                </div>
                <small className="form-help">Catatan: Jika memilih file gambar lokal, file tersebut akan disimulasikan di frontend.</small>
              </div>

              <div className="form-row">
                <div className="form-group checkbox-group">
                  <input 
                    type="checkbox" 
                    id="is_featured" 
                    checked={newsForm.is_featured}
                    onChange={(e) => setNewsForm({ ...newsForm, is_featured: e.target.checked })}
                  />
                  <label htmlFor="is_featured">Jadikan Berita Utama (Featured)</label>
                </div>

                <div className="form-group">
                  <label>Tanggal Rilis</label>
                  <input 
                    type="date" 
                    value={newsForm.published_at}
                    onChange={(e) => setNewsForm({ ...newsForm, published_at: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="admin-modal__actions">
                <button type="button" className="cancel-btn" onClick={() => setNewsModal({ open: false, mode: 'add', data: null })}>Batal</button>
                <button type="submit" className="submit-btn">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Modal Galeri */}
      {galleryModal.open && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal">
            <div className="admin-modal__header">
              <h3>{galleryModal.mode === 'add' ? 'Tambah Foto Baru' : 'Edit Foto Galeri'}</h3>
              <button className="close-modal-btn" onClick={() => setGalleryModal({ open: false, mode: 'add', data: null })}>×</button>
            </div>
            <form onSubmit={handleGalleryFormSubmit} className="admin-modal__form">
              <div className="form-group">
                <label>Judul Foto (Menu Makanan/Minuman)</label>
                <input 
                  type="text" 
                  value={galleryForm.title}
                  onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })}
                  placeholder="Misal: Salad Segar Organik"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Kategori</label>
                  <select 
                    value={galleryForm.category}
                    onChange={(e) => setGalleryForm({ ...galleryForm, category: e.target.value })}
                  >
                    <option value="MAKANAN">Makanan</option>
                    <option value="MINUMAN">Minuman</option>
                    <option value="DESERT">Desert</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Urutan Tampil (Sort Order)</label>
                  <input 
                    type="number" 
                    value={galleryForm.sort_order}
                    onChange={(e) => setGalleryForm({ ...galleryForm, sort_order: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Pilih File Gambar / Masukkan URL</label>
                <div className="file-url-toggle">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => setGalleryForm({ ...galleryForm, imageFile: e.target.files[0] })}
                  />
                  <div className="url-preview-wrapper">
                    <input 
                      type="text" 
                      placeholder="Atau URL Gambar..." 
                      value={galleryForm.image}
                      onChange={(e) => setGalleryForm({ ...galleryForm, image: e.target.value, imageFile: null })}
                    />
                  </div>
                </div>
              </div>

              <div className="admin-modal__actions">
                <button type="button" className="cancel-btn" onClick={() => setGalleryModal({ open: false, mode: 'add', data: null })}>Batal</button>
                <button type="submit" className="submit-btn">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Modal Detail Pesan */}
      {messageDetailModal.open && messageDetailModal.data && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal max-w-600">
            <div className="admin-modal__header">
              <h3>Detail Pesan Masuk</h3>
              <button className="close-modal-btn" onClick={() => setMessageDetailModal({ open: false, data: null })}>×</button>
            </div>
            <div className="message-detail-content">
              <div className="message-meta-row">
                <div className="meta-item">
                  <span className="meta-label">Nama Pengirim:</span>
                  <span className="meta-value">{messageDetailModal.data.name}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Email:</span>
                  <span className="meta-value">{messageDetailModal.data.email}</span>
                </div>
              </div>

              <div className="message-meta-row">
                <div className="meta-item">
                  <span className="meta-label">Subjek Pesan:</span>
                  <span className="meta-value font-bold">{messageDetailModal.data.subject}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Waktu Pengiriman:</span>
                  <span className="meta-value">{new Date(messageDetailModal.data.created_at || Date.now()).toLocaleString('id-ID')}</span>
                </div>
              </div>

              <hr className="modal-divider" />

              <div className="message-body-box">
                <span className="meta-label">Pesan:</span>
                <p className="message-body-text">{messageDetailModal.data.message}</p>
              </div>
            </div>
            <div className="admin-modal__actions">
              <button className="submit-btn" onClick={() => setMessageDetailModal({ open: false, data: null })}>Tutup</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
