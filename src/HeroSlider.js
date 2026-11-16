import React, { useState, useEffect } from 'react';
import './HeroSlider.css';

const SLIDES = [
  {
    id: 1,
    eyebrow: 'AUTUMN / WINTER COLLECTION',
    title: 'Quiet Luxury, Shaped by Hand',
    subtitle: 'Heirloom teakwood furniture and raw handloom textiles crafted for unhurried living.',
    ctaText: 'Explore the Collection',
    targetId: 'collection-grid',
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=2000&q=85'
  },
  {
    id: 2,
    eyebrow: 'THE WOODCRAFT STUDIO',
    title: 'Seasoned Teak & Joinery',
    subtitle: 'Traditional mortise-and-tenon silhouettes finished with natural beeswax.',
    ctaText: 'Discover Woodcraft',
    targetId: 'collection-grid',
    image: 'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?auto=format&fit=crop&w=2000&q=85'
  },
  {
    id: 3,
    eyebrow: 'LOOM & TEXTILE',
    title: 'Woven in Maheshwar & Kutch',
    subtitle: 'Breathable organic cottons and raw silks dyed in small botanical batches.',
    ctaText: 'Shop Handlooms',
    targetId: 'collection-grid',
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=2000&q=85'
  }
];

const HeroSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
    }, 6500);
    return () => clearInterval(timer);
  }, []);

  const scrollToCollection = (targetId) => {
    const el = document.getElementById(targetId);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="nico-hero">
      {SLIDES.map((slide, index) => {
        const isActive = index === currentIndex;
        return (
          <div
            key={slide.id}
            className={`nico-hero-slide ${isActive ? 'active' : ''}`}
          >
            <div
              className="nico-hero-bg"
              style={{ backgroundImage: `url(${slide.image})` }}
            />
            <div className="nico-hero-overlay" />

            <div className="nico-hero-content">
              <span className="nico-eyebrow">{slide.eyebrow}</span>
              <h1 className="nico-title">{slide.title}</h1>
              <p className="nico-subtitle">{slide.subtitle}</p>
              <button
                className="nico-cta-link"
                onClick={() => scrollToCollection(slide.targetId)}
              >
                {slide.ctaText}
              </button>
            </div>
          </div>
        );
      })}

      {/* Minimalist Progress Indicators */}
      <div className="nico-hero-dots">
        {SLIDES.map((slide, idx) => (
          <button
            key={slide.id}
            aria-label={`Slide ${idx + 1}`}
            className={`nico-dot ${idx === currentIndex ? 'active' : ''}`}
            onClick={() => setCurrentIndex(idx)}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSlider;