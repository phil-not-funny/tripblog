import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./../globals.css";
import "leaflet/dist/leaflet.css";
import Navbar from "@/components/Navbar";
import { Locale, NextIntlClientProvider } from "next-intl";
import { CookiesProvider } from "next-client-cookies/server";
import favicon from "@/public/favicon.ico";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Philip's Blog",
    template: "Philip's Blog \u2014 %s",
  },
  description: "Read about Philip's travels and hikes around the world.",
  icons: {
    icon: favicon.src,
  },
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string; lang: string }>;
}) {
  const { lang } = await params;
  const messages = (await import(`../../dictionaries/${lang}.json`)).default;

  return (
    <html lang={lang} suppressHydrationWarning>
      <head>
        {/* eslint-disable-next-line react/no-danger */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
            const t = localStorage.getItem('theme');
            const d = t ? t === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (d) document.documentElement.classList.add('dark');
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-display antialiased`}
      >
        <NextIntlClientProvider locale={lang} messages={messages}>
          <CookiesProvider>
            <Navbar locale={lang} />
            <main className="min-h-screen from-green-100 to-amber-100 bg-linear-to-b dark:from-green-950 dark:to-stone-900 p-4">
              {children}
            </main>
            <Footer locale={lang} />
          </CookiesProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
