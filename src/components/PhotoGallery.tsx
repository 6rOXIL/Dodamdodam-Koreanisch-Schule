"use client";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { getImagePath } from "@/lib/utils/imagePath";

interface PhotoGalleryProps {
  photos: string[];
  /** e.g. "Gallery image" → "Gallery image 1" */
  altPrefix?: string;
}

export default function PhotoGallery({ photos, altPrefix = "Photo" }: PhotoGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const goToPrevious = useCallback(() => {
    setSelectedIndex((currentIndex) => {
      if (currentIndex === null) return null;
      return currentIndex > 0 ? currentIndex - 1 : photos.length - 1;
    });
  }, [photos.length]);

  const goToNext = useCallback(() => {
    setSelectedIndex((currentIndex) => {
      if (currentIndex === null) return null;
      return currentIndex < photos.length - 1 ? currentIndex + 1 : 0;
    });
  }, [photos.length]);

  useEffect(() => {
    if (selectedIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goToPrevious();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goToNext();
      } else if (e.key === "Escape") {
        e.preventDefault();
        setSelectedIndex(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, goToPrevious, goToNext]);

  return (
    <>
      <div className="grid grid-cols-2 gap-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
        {photos.map((photo, index) => (
          <div
            key={index}
            className="relative aspect-square cursor-pointer overflow-hidden rounded-md shadow-md transition-all duration-300 group hover:shadow-xl sm:rounded-lg image-container"
            onClick={() => setSelectedIndex(index)}
            onContextMenu={(e) => e.preventDefault()}
            onDragStart={(e) => e.preventDefault()}
          >
            <Image
              src={getImagePath(`/images/${photo}`)}
              alt={`${altPrefix} ${index + 1}`}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300 select-none"
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
              onDragStart={(e) => e.preventDefault()}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
              }}
            />
          </div>
        ))}
      </div>

      {selectedIndex !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-2 sm:p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedIndex(null);
            }
          }}
        >
          <div className="relative max-h-[90dvh] w-full max-w-6xl">
            <button
              onClick={() => setSelectedIndex(null)}
              className="absolute right-4 top-[max(0.5rem,env(safe-area-inset-top))] z-20 flex h-11 min-w-11 items-center justify-center rounded-full bg-black/50 text-3xl font-bold text-surface transition-colors hover:bg-black/70 hover:text-gray-200"
              aria-label="닫기"
            >
              ×
            </button>

            {photos.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevious();
                }}
                className="absolute left-1 top-1/2 z-20 flex h-12 min-w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-3xl font-bold text-surface transition-colors hover:bg-black/70 sm:left-4 sm:text-4xl"
                aria-label="이전 사진"
              >
                ‹
              </button>
            )}

            {photos.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
                className="absolute right-1 top-1/2 z-20 flex h-12 min-w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-3xl font-bold text-surface transition-colors hover:bg-black/70 sm:right-4 sm:text-4xl"
                aria-label="다음 사진"
              >
                ›
              </button>
            )}

            {photos.length > 1 && (
              <div className="absolute bottom-[max(0.5rem,env(safe-area-inset-bottom))] left-1/2 z-20 -translate-x-1/2 rounded-full bg-black/50 px-4 py-2 text-sm text-surface">
                {selectedIndex + 1} / {photos.length}
              </div>
            )}

            <div
              className="relative w-full h-full flex items-center justify-center image-container"
              onContextMenu={(e) => e.preventDefault()}
              onDragStart={(e) => e.preventDefault()}
            >
              <Image
                src={getImagePath(`/images/${photos[selectedIndex]}`)}
                alt={`${altPrefix} ${selectedIndex + 1}`}
                width={1200}
                height={1200}
                className="max-h-[85dvh] max-w-full select-none rounded-md object-contain sm:max-h-[90vh] sm:rounded-lg"
                priority
                draggable={false}
                onContextMenu={(e) => e.preventDefault()}
                onDragStart={(e) => e.preventDefault()}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
