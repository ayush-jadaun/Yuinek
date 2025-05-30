// app/layout.tsx
import "./globals.css";
import { ReactNode } from "react";
import Header from "@/components/homepage/Header";
import Footer from "@/components/homepage/Footer";

export const metadata = {
  title: "Your Site",
  description: "Best fashion store in the Philippines",
};

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
};

export default RootLayout;
