import './globals.css';
import { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Admin Panel",
  description: "Admin Panel Login",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 overflow-x-hidden">{children}</body>
    </html>
  );
}
