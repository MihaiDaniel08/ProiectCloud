import "./globals.css";
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: "Study Tracker Simplu",
  description: "Proiect Cloud",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ro">
      <body className="bg-white min-h-screen text-black">
        <Toaster />
        {children}
      </body>
    </html>
  );
}