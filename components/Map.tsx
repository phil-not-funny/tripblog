"use client";

import dynamic from "next/dynamic";

const SimpleMap = dynamic(
  () => import("./MapClient"), // move your map component to a separate client-only file
  { ssr: false }
);

export default SimpleMap;
