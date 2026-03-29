/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";

export default function useGallery(imageUrls: string[]) {
  const [sortedUrls, setSortedUrls] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!imageUrls || imageUrls.length === 0) return;

    const normalized = imageUrls.map((url) => url.replaceAll("\\", "/"));
    const sorted = [...normalized].sort((a, b) =>
      a.split("/").pop()!.localeCompare(b.split("/").pop()!),
    );
    setSortedUrls(sorted);
  }, [imageUrls.join(",")]);

  useEffect(() => {
    if (currentIndex === null) return;
    if (sortedUrls.length === 0) {
      setCurrentIndex(null);
      setIsOpen(false);
      return;
    }
    if (currentIndex >= sortedUrls.length) {
      setCurrentIndex(sortedUrls.length - 1);
    }
  }, [sortedUrls, currentIndex]);

  const show = (index: number) => {
    if (index >= 0 && index < sortedUrls.length) {
      setCurrentIndex(index);
      setIsOpen(true);
    }
  };

  const close = () => {
    setIsOpen(false);
    setCurrentIndex(null);
  };

  const next = () => {
    if (!sortedUrls.length) return;
    setCurrentIndex((ci) => ((ci ?? 0) + 1) % sortedUrls.length);
    setIsOpen(true);
  };

  const prev = () => {
    if (!sortedUrls.length) return;
    setCurrentIndex(
      (ci) => ((ci ?? 0) - 1 + sortedUrls.length) % sortedUrls.length,
    );
    setIsOpen(true);
  };

  const current = currentIndex !== null ? sortedUrls[currentIndex] : null;

  return { sortedUrls, isOpen, currentIndex, current, show, close, next, prev };
}
