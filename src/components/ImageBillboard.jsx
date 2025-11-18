"use client";

import { useRef, useState, useEffect } from "react";
import { useImageBillboardStore } from "@/store/imageBillboard/imageBillboardStore";
import { getArtworkInfo, formatArtistName } from "@/utils/artworkInfo";
import CoordinateHighlighter from "./CoordinateHighlighter";

export default function ImageBillboard() {
  const { isOpen, setIsOpen, imagePath, highlightedCoordinates } = useImageBillboardStore();
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [hasImageError, setHasImageError] = useState(false);
  const imageRef = useRef(null);
  const containerRef = useRef(null);

  const artworkInfo = getArtworkInfo(imagePath);
  const artistName = formatArtistName(artworkInfo);

  useEffect(() => {
    if (isOpen && imagePath) {
      setIsImageLoading(true);
      setHasImageError(false);
      setTimeout(() => setIsVisible(true), 50);
    } else {
      setIsVisible(false);
    }
  }, [isOpen, imagePath]);

  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setIsVisible(false);
    setTimeout(() => {
      setIsClosing(false);
      setIsOpen(false);
    }, 300);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen && !isClosing) return null;

  const imageUrl = imagePath?.startsWith('/') ? imagePath : `/${imagePath}`;

  return (
    <div 
      className={`fixed inset-0 z-[1000] flex items-start justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={handleBackdropClick}
    >
      <div 
        className={`bg-[#e8ecf2] rounded-3xl w-full max-w-[500px] max-h-[85vh] flex flex-col overflow-hidden transition-transform duration-[400ms] ${
          isVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
        style={{
          boxShadow: '0.625rem 0.625rem 1.25rem rgba(163, 177, 198, 0.7), -0.625rem -0.625rem 1.25rem rgba(255, 255, 255, 0.9)',
          transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-[#e8ecf2] border-b border-[rgba(163,177,198,0.3)]">
          <div 
            className="flex-1 text-[1.1rem] font-semibold text-[#2c3e50]"
            style={{ textShadow: '0 1px 2px rgba(255, 255, 255, 0.8)' }}
          >
            {artistName || "Artwork"}
          </div>
          <button 
            className="w-8 h-8 flex items-center justify-center rounded-full bg-[#e8ecf2] text-[#666] cursor-pointer transition-all duration-200 hover:text-[#333] active:shadow-[inset_0.125rem_0.125rem_0.25rem_rgba(163,177,198,0.6),inset_-0.125rem_-0.125rem_0.25rem_rgba(255,255,255,0.8)]"
            style={{
              boxShadow: '0.1875rem 0.1875rem 0.375rem rgba(163, 177, 198, 0.6), -0.1875rem -0.1875rem 0.375rem rgba(255, 255, 255, 0.8)'
            }}
            onClick={handleClose}
            aria-label="Close image"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        
        <div 
          ref={containerRef}
          className="flex-1 flex items-center justify-center p-3 bg-[#dde3ed] min-h-[200px] relative"
        >
          {isImageLoading && !hasImageError && (
            <div className="text-[#666] text-base text-center p-8">Loading image...</div>
          )}
          {imagePath && (
            <>
              <img 
                ref={imageRef}
                src={imageUrl}
                alt="Gallery artwork"
                className={`max-w-full w-full h-auto object-contain rounded-xl transition-transform duration-200 hover:scale-[1.02] ${
                  isImageLoading && !hasImageError ? 'hidden' : 'block'
                }`}
                style={{
                  boxShadow: '0.3125rem 0.3125rem 0.625rem rgba(163, 177, 198, 0.6), -0.3125rem -0.3125rem 0.625rem rgba(255, 255, 255, 0.8)'
                }}
                onLoad={() => setIsImageLoading(false)}
                onError={(e) => {
                  console.error('Failed to load image:', imageUrl);
                  setIsImageLoading(false);
                  setHasImageError(true);
                  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRlM2VkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzY2NyIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBmb3VuZDwvdGV4dD48L3N2Zz4=';
                }}
              />
              <CoordinateHighlighter 
                points={highlightedCoordinates} 
                imageRef={imageRef} 
                containerRef={containerRef} 
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}