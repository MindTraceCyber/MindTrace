import './globals.css';
import Pixel from '@/components/pixel'; // ✅ or '../components/pixel' if no alias set

export const metadata = {
  title: 'MindTrace Cyber',
  description: 'Cyber OSINT app',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* Pixel shows on every page */}
        <Pixel />
        <main>{children}</main>
      </body>
    </html>
  );
}
