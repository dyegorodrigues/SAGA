import React, { useState, useEffect } from "react";

interface TransparentMascotImageProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
}

// Memory cache for processed images so we don't re-process the canvas on every render
const processedCache = new Map<string, string>();

export function TransparentMascotImage({ src, alt, className, style }: TransparentMascotImageProps) {
  const [processedSrc, setProcessedSrc] = useState<string | null>(processedCache.get(src) || null);
  const [loading, setLoading] = useState(!processedSrc);

  useEffect(() => {
    // If already cached, just use it
    if (processedCache.has(src)) {
      setProcessedSrc(processedCache.get(src)!);
      setLoading(false);
      return;
    }

    setLoading(true);
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = src;

    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth || img.width;
        canvas.height = img.naturalHeight || img.height;
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          setProcessedSrc(src);
          setLoading(false);
          return;
        }

        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // Chroma key: find white/near-white pixels and make them transparent
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const a = data[i + 3];

          if (a === 0) continue;

          // If all channels are very bright (near white background)
          if (r > 232 && g > 232 && b > 232) {
            const avg = (r + g + b) / 3;
            if (avg >= 246) {
              // Complete transparency for solid background
              data[i + 3] = 0;
            } else {
              // Smooth feathering to avoid jagged edges (anti-aliasing)
              const factor = (246 - avg) / (246 - 232);
              data[i + 3] = Math.floor(a * factor);
            }
          }
        }

        ctx.putImageData(imageData, 0, 0);
        const dataUrl = canvas.toDataURL("image/png");
        processedCache.set(src, dataUrl);
        setProcessedSrc(dataUrl);
      } catch (err) {
        console.error("Error removing background from image:", err);
        // Fallback to original image if anything fails
        setProcessedSrc(src);
      } finally {
        setLoading(false);
      }
    };

    img.onerror = () => {
      console.error("Failed to load mascot image for background removal:", src);
      setProcessedSrc(src);
      setLoading(false);
    };
  }, [src]);

  if (loading) {
    return (
      <div className={`flex items-center justify-center ${className}`} style={{ ...style, aspectRatio: "1/1" }}>
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <img
      src={processedSrc || src}
      alt={alt}
      className={className}
      style={style}
      referrerPolicy="no-referrer"
    />
  );
}
