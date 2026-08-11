import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Foldboard Lab — прототип клавиатуры",
  description: "Интерактивный прототип экранной клавиатуры для раскрывающегося смартфона.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
