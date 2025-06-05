import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "StretchFlow - Daily Micro-Stretching",
  description:
    "Daily micro-stretching exercises for better health and productivity. Integrate 30-second to 2-minute stretching exercises into your routine.",
  keywords:
    "stretching, exercise, health, productivity, micro-workouts, wellness",
  authors: [{ name: "StretchFlow Team" }],
  creator: "StretchFlow",
  publisher: "StretchFlow",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/icon-152x152.png", sizes: "152x152", type: "image/png" },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "StretchFlow",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "StretchFlow",
    title: "StretchFlow - Daily Micro-Stretching",
    description:
      "Daily micro-stretching exercises for better health and productivity",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "StretchFlow App",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "StretchFlow - Daily Micro-Stretching",
    description:
      "Daily micro-stretching exercises for better health and productivity",
    images: ["/og-image.png"],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#3b82f6" },
    { media: "(prefers-color-scheme: dark)", color: "#1e40af" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="application-name" content="StretchFlow" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="StretchFlow" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#3b82f6" />
        <meta name="msapplication-tap-highlight" content="no" />

        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <link
          rel="mask-icon"
          href="/icons/safari-pinned-tab.svg"
          color="#3b82f6"
        />
        <link rel="shortcut icon" href="/favicon.ico" />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:url" content="https://stretchflow.app" />
        <meta name="twitter:title" content="StretchFlow" />
        <meta
          name="twitter:description"
          content="Daily micro-stretching exercises for better health and productivity"
        />
        <meta
          name="twitter:image"
          content="https://stretchflow.app/icons/icon-192x192.png"
        />
        <meta name="twitter:creator" content="@stretchflow" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="StretchFlow" />
        <meta
          property="og:description"
          content="Daily micro-stretching exercises for better health and productivity"
        />
        <meta property="og:site_name" content="StretchFlow" />
        <meta property="og:url" content="https://stretchflow.app" />
        <meta
          property="og:image"
          content="https://stretchflow.app/icons/icon-512x512.png"
        />
      </head>
      <body
        className={`${inter.className} min-h-screen bg-gray-50 dark:bg-gray-900`}
      >
        <div className="flex min-h-screen flex-col">
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
