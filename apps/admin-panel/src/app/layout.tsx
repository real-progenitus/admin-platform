import './globals.css';

export const metadata = {
  title: 'Admin Panel',
  description: 'Admin Panel Login',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50">{children}</body>
    </html>
  );
}
