import React, { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Maximize2, Play, Projector, Rows3 } from "lucide-react";
import { presentationDecks } from "./presentationData";

export function PresentationDecks() {
  const [deckId, setDeckId] = useState(presentationDecks[0].id);
  const [slideIndex, setSlideIndex] = useState(0);
  const deck = useMemo(() => presentationDecks.find((item) => item.id === deckId) || presentationDecks[0], [deckId]);
  const slide = deck.slides[slideIndex] || deck.slides[0];

  useEffect(() => {
    const handleKey = (event) => {
      if (event.key === "ArrowRight" || event.key === "PageDown" || event.key === " ") {
        event.preventDefault();
        setSlideIndex((current) => Math.min(deck.slides.length - 1, current + 1));
      }
      if (event.key === "ArrowLeft" || event.key === "PageUp") {
        event.preventDefault();
        setSlideIndex((current) => Math.max(0, current - 1));
      }
      if (event.key === "Home") setSlideIndex(0);
      if (event.key === "End") setSlideIndex(deck.slides.length - 1);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [deck.slides.length]);

  const chooseDeck = (id) => {
    setDeckId(id);
    setSlideIndex(0);
  };

  return (
    <section className="presentation-page">
      <div className="deck-sidebar">
        <div className="deck-brand">
          <img src={deck.logo} alt="生態探員任務 Logo" />
          <div>
            <p className="eyebrow">網頁式簡報</p>
            <h2>六堂課投影片</h2>
          </div>
        </div>
        <div className="deck-list">
          {presentationDecks.map((item) => (
            <button key={item.id} className={item.id === deck.id ? "active" : ""} onClick={() => chooseDeck(item.id)}>
              <span>第 {item.number} 堂</span>
              <strong>{item.title}</strong>
              <small>{item.slides.length} 頁</small>
            </button>
          ))}
        </div>
      </div>

      <div className="deck-stage-wrap">
        <div className="deck-toolbar">
          <div>
            <span>{deck.title}</span>
            <strong>{String(slideIndex + 1).padStart(2, "0")} / {deck.slides.length}</strong>
          </div>
          <div className="deck-actions">
            <button onClick={() => setSlideIndex(0)} title="回到封面">
              <Rows3 size={18} />
            </button>
            <button onClick={() => document.querySelector(".slide-stage")?.requestFullscreen?.()} title="全螢幕">
              <Maximize2 size={18} />
            </button>
          </div>
        </div>

        <article className={`slide-stage slide-${slide.type} accent-${deck.accent}`}>
          <img className="slide-bg" src={slide.image} alt="" />
          <div className="slide-scrim" />
          <div className="slide-header">
            <img src={deck.logo} alt="" />
            <span>第 {deck.number} 堂｜{deck.title}</span>
          </div>
          <div className="slide-content">
            <p className="slide-kicker">{slide.type === "cover" ? "Eco Detective Mission" : `Slide ${String(slideIndex + 1).padStart(2, "0")}`}</p>
            <h1>{slide.title}</h1>
            {slide.subtitle && <h2>{slide.subtitle}</h2>}
            <ul>
              {slide.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
            {slide.prompt && (
              <div className="slide-question">
                <Projector size={20} />
                <span>{slide.prompt}</span>
              </div>
            )}
          </div>
          <div className="slide-footer">
            <span>生態探員任務</span>
            <i style={{ width: `${((slideIndex + 1) / deck.slides.length) * 100}%` }} />
          </div>
        </article>

        <div className="deck-nav">
          <button onClick={() => setSlideIndex((current) => Math.max(0, current - 1))} disabled={slideIndex === 0}>
            <ChevronLeft size={18} />
            <span>上一頁</span>
          </button>
          <button onClick={() => setSlideIndex((current) => Math.min(deck.slides.length - 1, current + 1))} disabled={slideIndex === deck.slides.length - 1}>
            <span>下一頁</span>
            <ChevronRight size={18} />
          </button>
          <button onClick={() => setSlideIndex(0)}>
            <Play size={18} />
            <span>重新開始</span>
          </button>
        </div>
      </div>
    </section>
  );
}

