"use client";

import "@mantine/core/styles.css";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { MantineProvider } from '@mantine/core';

if (typeof window !== 'undefined') {
require("@/oneko.js");
}

export default function App({ Component, pageProps }: AppProps) {
  return <MantineProvider>
    <Component {...pageProps} />
  </MantineProvider>
}
