"use client";

import Link from "next/link";
import { Search, User, ShoppingBag } from "lucide-react";

const Header = () => {
  return (
    <header className="border-b-[2px] border-yellow-400">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-4">
        {/* Left: Search Bar */}
        <div className="w-1/4">
          <div className="flex items-center border rounded px-3 py-1">
            <Search className="h-5 w-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search"
              className="ml-2 w-full outline-none text-gray-700 placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Center: Logo */}
        <div className="w-1/2 text-center">
          <Link href="/" className="text-4xl font-serif tracking-widest">
            Yuinek
            <div className="text-xs font-light tracking-wider">
              CALPASINO VERVIQUE
            </div>
          </Link>
        </div>

        {/* Right: Icons */}
        <div className="w-1/4 flex justify-end gap-6 pr-2">
          <Link href="/auth/login">
            <User className="h-6 w-6 text-gray-700 hover:text-black" />
          </Link>
          <Link href="/cart">
            <ShoppingBag className="h-6 w-6 text-gray-700 hover:text-black" />
          </Link>
        </div>
      </div>

      {/* Bottom Menu */}
      <nav className="bg-white shadow-sm">
        <ul className="flex justify-center gap-8 text-sm font-semibold text-gray-800 py-2">
          <li>
            <Link href="/">HOME</Link>
          </li>
          <li>
            <Link href="/products?type=loafers">LOAFER SHOES</Link>
          </li>
          <li>
            <Link href="/products?type=sports">SPORTS SHOES</Link>
          </li>
          <li>
            <Link href="/products?type=slippers">SLIPPER</Link>
          </li>
          <li>
            <Link href="/products?type=sneakers">SNEAKERS</Link>
          </li>
          <li>
            <Link href="/products?type=formal">FORMAL SHOES</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
