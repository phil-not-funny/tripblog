/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import useGallery from "@/hooks/useGallery";
import { Spinner } from "./ui/spinner";
import Image from "next/image";

export default function Gallery({ imagePaths }: { imagePaths: string[] }) {
  const t = useTranslations();
  const { sortedUrls, isOpen, currentIndex, current, show, close, next, prev } =
    useGallery(imagePaths);

  return (
    <div className="flex flex-col items-center gap-4">
      <h2 className="text-2xl font-semibold text-foreground">
        {t("components.PageSwitcher.gallery").toUpperCase()}
      </h2>

      {/* Grid */}
      <div className="lg:w-5xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
        {sortedUrls.length === imagePaths.length ? (
          sortedUrls.map((src, i) => (
            <motion.div
              key={src}
              onClick={() => show(i)}
              className="relative aspect-4/3 overflow-hidden rounded-2xl shadow-md bg-card cursor-pointer"
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              <Image
                src={src}
                alt={`gallery-img-${i}`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover"
              />
            </motion.div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center w-full">
            <Spinner className="size-16" />
          </div>
        )}
      </div>

      {/* Modal */}
      <Dialog open={isOpen} onOpenChange={(val) => (val ? null : close())}>
        <DialogContent
          showCloseButton={false}
          className={`max-w-[90vw] max-h-[90vh] w-full h-full m-0 p-0 z-9999 bg-black/60 text-white border-none **:data-dialog-close:hidden`}
        >
          <DialogTitle className="sr-only">
            {t("components.Gallery.modalTitle")}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {t("components.Gallery.modalTitle")}
          </DialogDescription>
          <div className="relative flex items-center justify-center w-full h-[90vh] overflow-hidden">
            <button
              onClick={() => close()}
              className="absolute top-4 right-4 z-20 p-3 rounded-full bg-black/60 hover:bg-black/80"
            >
              <X className="w-6 h-6" />
            </button>

            <button
              onClick={prev}
              className="absolute left-4 z-20 p-3 rounded-full bg-black/60 hover:bg-black/80"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={next}
              className="absolute right-4 z-20 p-3 rounded-full bg-black/60 hover:bg-black/80"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Image */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex ?? "no-img"}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="relative w-full h-full"
              >
                <Image
                  src={current ?? ""}
                  alt={`expanded-img-${currentIndex ?? "-"}`}
                  fill
                  sizes="90vw"
                  className="object-contain"
                  priority
                />
              </motion.div>
            </AnimatePresence>

            {/* Pagination Dots */}
            <div className="absolute bottom-6 flex gap-2 z-30 bg-black/80 p-2 rounded-full">
              {sortedUrls.map((_, idx) => (
                <motion.button
                  key={idx}
                  onClick={() => show(idx)}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  animate={{
                    scale: currentIndex === idx ? 1.3 : 1,
                    opacity: currentIndex === idx ? 1 : 0.4,
                  }}
                  className="h-3 w-3 rounded-full bg-white"
                />
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
