import type { Metadata } from "next";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "TikTok English — Learn TikTok English with Claude",
  description:
    "One real English sentence at a time — pulled from actual TikTok comments, explained in Japanese.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Kalam:wght@400;700&family=Inter:wght@400;500;600;700&family=Noto+Sans+JP:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen font-body antialiased">
        <div className="mx-auto flex min-h-screen max-w-md flex-col md:max-w-2xl">
          <SiteHeader />
          <main className="flex-1 px-4 pb-16 pt-4 md:px-6">{children}</main>
        </div>
      </body>
    </html>
  );
}