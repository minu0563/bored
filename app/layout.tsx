'use client';

import { usePathname } from 'next/navigation';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const hideFooter = pathname === '/' || pathname === '/tree';

  return (
    <html lang="en">
      <body className="bg-black text-white flex flex-col min-h-screen m-0">
        <main className="flex-1 flex flex-col items-center justify-center">
          {children}
        </main>

        {!hideFooter && (
          <footer className="text-center py-2 border-t border-gray-700 mt-auto">
            Made by Kwak Do Young
          </footer>
        )}
      </body>
    </html>
  )
}