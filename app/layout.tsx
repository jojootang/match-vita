// app/layout.tsx
import { Inter } from 'next/font/google';
import './globals.css';
import DailyContentWidget from '@/components/DailyContentWidget';
import Navigation from '@/components/Navigation';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'MatchVita - Health & Wellness',
  description: 'Personalized health recommendations',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <body className={`${inter.className} bg-gray-50`}>
        <Navigation />
        <main className="min-h-screen">
          {children}
        </main>
        
        {/* Daily Content Widget ในทุกหน้า */}
        <DailyContentWidget 
          position="bottom-right"
          collapsed={false}
        />
        
        {/* Cookie Consent / Notification (Optional) */}
        <div id="notification-container"></div>
      </body>
    </html>
  );
}