"use client";

import dynamic from "next/dynamic";

// use a dynamic import to load the map component only on the client side
const SimpleMap = dynamic(() => import("./MapClient"), { ssr: false });

export default SimpleMap;
