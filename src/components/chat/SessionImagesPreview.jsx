"use client";

import { useState, useEffect } from "react";
import { getSessionImages } from "@/actions/chat/get-session-images";

const SessionImagesPreview = ({ session }) => {
  const [images, setImages] = useState([]);
  const [loadedImages, setLoadedImages] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      const { data, error } = await getSessionImages(session.id);
      
      if (!error && data) {
        const filteredImages = data.filter(
          img => img.public_url !== session.cover_image
        );
        setImages(filteredImages);
      }
      
      setLoading(false);
    };

    fetchImages();
  }, [session.id, session.cover_image]);

  const handleImageLoad = (url) => {
    setLoadedImages(prev => new Set([...prev, url]));
  };

  const handleImageError = (url) => {
    setImages(prev => prev.filter(img => img.public_url !== url));
  };

  if (loading || images.length === 0) {
    return null;
  }

  const displayImages = images.slice(0, 3);
  const remainingCount = images.length - 3;

  return (
    <div className="flex gap-2 px-4 w-full justify-center">
      {displayImages.map((image, index) => (
        <div
          key={image.id}
          className="relative w-[calc(33.333%-0.333rem)] aspect-square rounded-lg overflow-hidden bg-gray-100"
          style={{ maxWidth: 'calc((100% - 1rem) / 3)' }}
        >
          <img
            src={image.public_url}
            alt=""
            onLoad={() => handleImageLoad(image.public_url)}
            onError={() => handleImageError(image.public_url)}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              loadedImages.has(image.public_url) ? "opacity-100" : "opacity-0"
            }`}
          />
          {index === 2 && remainingCount > 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                +{remainingCount}
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default SessionImagesPreview;
