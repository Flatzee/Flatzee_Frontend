"use client";

import { useEffect, useRef } from "react";

export function useAutoplay() {
  const observerRef = useRef<IntersectionObserver | undefined>(undefined);
  const activeCardRef = useRef<Element | null>(null);

  useEffect(() => {
    // Respect reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Use root scroller on mobile, inner scroller on desktop
    const rootElement = window.innerWidth < 768 ? null : document.getElementById('feed-scroll');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const card = entry.target;
          const videos = card.querySelectorAll('video');
          
          if (entry.isIntersecting && entry.intersectionRatio >= 0.9) {
            // This card is fully visible - activate autoplay
            if (activeCardRef.current && activeCardRef.current !== card) {
              // Pause previous active card
              const prevVideos = activeCardRef.current.querySelectorAll('video');
              prevVideos.forEach(video => {
                video.pause();
                video.currentTime = 0;
              });
            }
            
            activeCardRef.current = card;
            
            // Play videos in current card
            videos.forEach(video => {
              video.play().catch(() => {
                // Autoplay failed - fail gracefully
                console.debug('Autoplay failed for video');
              });
            });
          } else {
            // Card not fully visible - pause
            videos.forEach(video => {
              video.pause();
            });
            
            if (activeCardRef.current === card) {
              activeCardRef.current = null;
            }
          }
        });
      },
      {
        root: rootElement,
        rootMargin: '-10px 0px -10px 0px', // Small margin to ensure full visibility
        threshold: [0.9, 0.95] // High threshold for precise detection
      }
    );

    observerRef.current = observer;

    // Observe all listing cards
    const cards = document.querySelectorAll('.snap-card');
    cards.forEach(card => observer.observe(card));

    return () => {
      observer.disconnect();
      activeCardRef.current = null;
    };
  }, []);

  // Re-observe when cards change or screen size changes
  useEffect(() => {
    const handleResize = () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        
        // Recreate observer with correct root
        const rootElement = window.innerWidth < 768 ? null : document.getElementById('feed-scroll');
        
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              const card = entry.target;
              const videos = card.querySelectorAll('video');
              
              if (entry.isIntersecting && entry.intersectionRatio >= 0.9) {
                if (activeCardRef.current && activeCardRef.current !== card) {
                  const prevVideos = activeCardRef.current.querySelectorAll('video');
                  prevVideos.forEach(video => {
                    video.pause();
                    video.currentTime = 0;
                  });
                }
                
                activeCardRef.current = card;
                videos.forEach(video => {
                  video.play().catch(() => {});
                });
              } else {
                videos.forEach(video => {
                  video.pause();
                });
                
                if (activeCardRef.current === card) {
                  activeCardRef.current = null;
                }
              }
            });
          },
          {
            root: rootElement,
            rootMargin: '-10px 0px -10px 0px',
            threshold: [0.9, 0.95]
          }
        );

        observerRef.current = observer;
        
        const cards = document.querySelectorAll('.snap-card');
        cards.forEach(card => observer.observe(card));
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return null;
}