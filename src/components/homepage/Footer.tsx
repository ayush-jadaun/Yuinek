"use client";

import Link from "next/link";
import { Facebook, Instagram, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-black text-white text-sm">
      {/* Top section */}
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Left: Brand info */}
        <div>
          <img src="/images/logo.png" alt="Fariste Logo" className="w-28 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Yuinek</h2>
          <p className="mb-4 text-gray-300">
            Welcome to Yuinek Corporation’s website. We are a forward-thinking
            company based in India, committed to delivering innovative and
            high-quality products to our customers worldwide.
          </p>
          <div className="flex gap-4">
            <a href="https://facebook.com" target="_blank" rel="noreferrer">
              <Facebook className="hover:text-gray-300" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer">
              <Instagram className="hover:text-gray-300" />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer">
              <Youtube className="hover:text-gray-300" />
            </a>
          </div>
        </div>

        {/* Right: Contact Info */}
        <div>
          <h3 className="text-md font-semibold mb-4">CONTACT US</h3>
          <p className="mb-1">Call: +63 9770918820</p>
          <p className="mb-1">WhatsApp: +63 9770918820</p>
          <p className="mb-1">Customer Support Time: 24/7</p>
          <p className="mb-1">Email: yuinekinc@gmail.com</p>
          <p className="mt-2">
            Address: 12 LAZARO ST., STO. NIÑO - 1800 MARIKINA CITY PHILIPPINES
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-700" />

      {/* Middle section - Policies */}
      <div className="max-w-7xl mx-auto px-4 py-4 flex flex-wrap justify-center gap-6 text-gray-300 text-xs font-medium">
        <Link href="/about">About Us</Link>
        <Link href="/privacy-policy">Privacy Policy</Link>
        <Link href="/return-policy">Return Policy</Link>
        <Link href="/shipping-policy">Shipping Policy</Link>
        <Link href="/terms">Terms and Condition</Link>
      </div>

      {/* Bottom section - Most searched */}
      <div className="max-w-7xl mx-auto px-4 py-6 text-gray-400 text-xs">
        <span className="font-semibold mr-2">Most searched on store</span>
        <div className="flex flex-wrap gap-3 mt-2">
          <Link href="/products?type=slippers">SLIPPER</Link>
          <span>|</span>
          <Link href="/products?type=spotlight">IN THE SPOTLIGHT</Link>
          <span>|</span>
          <Link href="/products?type=sneakers">SNEAKERS</Link>
          <span>|</span>
          <Link href="/products?type=sports">SPORTS SHOES</Link>
          <span>|</span>
          <Link href="/products?type=loafers">LOAFER SHOES</Link>
          <span>|</span>
          <Link href="/products?type=formal">FORMAL SHOES</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
