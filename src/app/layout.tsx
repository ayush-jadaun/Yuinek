// app/layout.tsx
import "./globals.css";
import { ReactNode } from "react";
export const metadata = {
  title: "Yuinek",
  description: "Best fashion store in the Philippines",
};


const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
    
        <main className="flex-1">{children}</main>
     
      </body>
    </html>
  );
};

export default RootLayout;
