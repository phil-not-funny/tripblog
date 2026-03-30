"use client";

import dynamic from "next/dynamic";

// use a dynamic import to load the map component only on the client side
const SimpleMap = dynamic(() => import("./MapClient"), { ssr: false });

const ShowcaseMap = dynamic(
  () => import("./MapClient").then((mod) => mod.ShowcaseMap),
  { ssr: false },
);

export { ShowcaseMap };

export default SimpleMap;
