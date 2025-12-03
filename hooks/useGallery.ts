import { useEffect, useState } from "react";

export default function useGallery(imageUrls: string[]) {
  const [ratios, setRatios] = useState<Record<number, string>>({});
  const [sortedUrls, setSortedUrls] = useState<string[]>([]);
  const [sortedOrientations, setSortedOrientations] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!imageUrls || imageUrls.length === 0) {
      return;
    }

    // Load all images to determine their natural sizes, then compute orientations
    const loaders = imageUrls.map(
      (url, i) =>
        new Promise<{ idx: number; landscape: boolean }>((resolve) => {
          const img = new Image();
          img.onload = () =>
            resolve({
              idx: i,
              landscape: img.naturalWidth > img.naturalHeight,
            });
          img.onerror = () => resolve({ idx: i, landscape: false });
          img.src = url;
        })
    );

    Promise.all(loaders).then((results) => {
      const newRatios: Record<number, string> = {};
      results.forEach((res) => {
        newRatios[res.idx] = res.landscape ? "landscape" : "portrait";
      });
      setRatios(newRatios);
      console.log(
        "unsorted",
        Object.values(newRatios).map((o) => (o === "landscape" ? "L" : "P"))
      );

      // After we have orientations, compute the masonry-sorted URLs grouped by orientation
      const { urls: sorted, orientations } = sortMasonry(imageUrls, newRatios);
      setSortedUrls(sorted);
      setSortedOrientations(orientations);
      console.log(
        "sorted",
        orientations.map((o) => (o === "landscape" ? "L" : "P"))
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageUrls]);

  const sortMasonry = (
    urls: string[],
    orientationMap: Record<number, string>
  ): { urls: string[]; orientations: string[] } => {
    // Build items with span based on orientation (landscape -> 2, portrait -> 1)
    const items = urls.map((url, idx) => ({
      src: url,
      span: orientationMap[idx] === "landscape" ? 2 : 1,
      orientation:
        orientationMap[idx] === "landscape" ? "landscape" : "portrait",
    }));

    // Separate queues preserving original order
    const portraits = items.filter((it) => it.orientation === "portrait");
    const landscapes = items.filter((it) => it.orientation === "landscape");

    const totalP = portraits.length;
    const totalL = landscapes.length;

    const out: { src: string; span: number; orientation: string }[] = [];

    // Row-aware builder: try to alternate orientation where possible, but allow
    // small groups when one side is abundant. Landscape span=2, portrait=1.
    let rowSpace = 3;
    let lastPlaced: string | null = null; // 'portrait' | 'landscape' | null

    // Helper to take next item from a queue that fits current rowSpace
    const takeFromQueue = (
      queue: typeof portraits | typeof landscapes
    ): { src: string; span: number; orientation: string } | null => {
      for (let i = 0; i < queue.length; i++) {
        if (queue[i].span <= rowSpace) return queue.splice(i, 1)[0];
      }
      return null;
    };

    // Alternate preference strategy with occasional randomness for variety
    // We'll decide a small "rowFlip" once at the start of each row so the flip
    // applies to the whole row (treating the row as a group).
    let rowFlip = false;
    while (portraits.length > 0 || landscapes.length > 0) {
      const preferOpposite =
        lastPlaced === "portrait" ? "landscape" : "portrait";

      // Decide target orientation for this placement
      let target: "portrait" | "landscape" | null = null;

      // If row is empty, pick an orientation that helps balance counts
      if (rowSpace === 3) {
        // decide flip for this row
        const flipChance = 0.4; // ~40% chance to flip the row preference
        rowFlip = Math.random() < flipChance;

        if (totalP > totalL * 2) {
          // many portraits: allow small portrait groups but try to inject an L every 2-3 P
          target = Math.random() < 0.15 ? "landscape" : "portrait";
        } else if (totalL > totalP * 2) {
          // many landscapes: randomly mix some L and occasionally place P to break runs
          target = Math.random() < 0.4 ? "landscape" : "portrait";
        } else {
          // balanced: start with the orientation that is opposite of last placed when possible
          target = preferOpposite === "portrait" ? "portrait" : "landscape";
        }

        // apply row-level flip if selected
        if (rowFlip) target = target === "portrait" ? "landscape" : "portrait";
      } else {
        // row partially filled: prefer to alternate to avoid same-orientation streaks
        target = preferOpposite;
      }

      let taken: { src: string; span: number; orientation: string } | null =
        null;
      if (target === "portrait") {
        taken = takeFromQueue(portraits);
        if (!taken) taken = takeFromQueue(landscapes);
      } else if (target === "landscape") {
        taken = takeFromQueue(landscapes);
        if (!taken) taken = takeFromQueue(portraits);
      }

      // If nothing fits in this row (e.g., remaining landscape with span 2 but rowSpace==1),
      // finish the row and start a new one
      if (!taken) {
        rowSpace = 3;
        lastPlaced = null;
        continue;
      }

      out.push(taken);
      rowSpace -= taken.span;
      lastPlaced = taken.orientation;

      // If row is full, reset rowSpace
      if (rowSpace === 0) {
        rowSpace = 3;
        lastPlaced = null;
      }
    }

    return {
      urls: out.map((s) => s.src),
      orientations: out.map((s) => s.orientation),
    };
  };

  // Keep currentIndex valid when sortedUrls change
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

  const show = (index: number | string) => {
    if (!sortedUrls || sortedUrls.length === 0) return;
    let idx: number | null = null;
    if (typeof index === "number") {
      if (index >= 0 && index < sortedUrls.length) idx = index;
    } else {
      idx = sortedUrls.indexOf(index);
      if (idx === -1) idx = null;
    }
    if (idx !== null) {
      setCurrentIndex(idx);
      setIsOpen(true);
    }
  };

  const close = () => {
    setIsOpen(false);
    setCurrentIndex(null);
  };

  const next = () => {
    if (!sortedUrls || sortedUrls.length === 0) return;
    setCurrentIndex((ci) => {
      const start = ci === null ? 0 : ci;
      return (start + 1) % sortedUrls.length;
    });
    setIsOpen(true);
  };

  const prev = () => {
    if (!sortedUrls || sortedUrls.length === 0) return;
    setCurrentIndex((ci) => {
      const start = ci === null ? 0 : ci;
      return (start - 1 + sortedUrls.length) % sortedUrls.length;
    });
    setIsOpen(true);
  };

  const current = currentIndex !== null ? sortedUrls[currentIndex] : null;

  return {
    ratios,
    sortedUrls,
    sortedOrientations,
    isOpen,
    currentIndex,
    current,
    show,
    close,
    next,
    prev,
  };
}
