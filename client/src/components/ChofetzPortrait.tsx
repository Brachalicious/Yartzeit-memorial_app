// ChofetzPortrait.tsx
import React from "react";

type Props = {
  size?: number;        // pixel size for width/height (square)
  className?: string;
  src?: string;         // default to our existing asset path
  alt?: string;
};

export default function ChofetzPortrait({
  size,
  className = "",
  src = "/chofetz_chaim.svg",
  alt = "Chofetz Chaim",
}: Props) {
  return (
    <img
      src={src}
      alt={alt}
      // Only set width/height if size is provided
      {...(size ? { width: size, height: size } : {})}
      className={`block object-contain rounded-none select-none ${className}`}
      style={{ aspectRatio: "1 / 1" }}
      loading="lazy"
      draggable={false}
    />
  );
}
