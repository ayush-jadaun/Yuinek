"use client";

import Link from "next/link";
import { Search, User, ShoppingBag } from "lucide-react";

const Header = () => {
  return (
    <header className="border-b-[2.5px] border-yellow-500 bg-gradient-to-b from-yellow-50 to-yellow-100">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-4">
        {/* Left: Search Bar */}
        <div className="w-1/4">
          <div className="flex items-center border border-yellow-300 rounded-lg px-3 py-1 bg-yellow-50 shadow-inner">
            <Search className="h-5 w-5 text-yellow-600" />
            <input
              type="text"
              placeholder="Search"
              className="ml-2 w-full outline-none text-yellow-900 placeholder:text-yellow-400 bg-transparent"
            />
          </div>
        </div>

        {/* Center: Logo */}
        <div className="w-1/2 text-center">
          <Link
            href="/"
            className="text-4xl font-serif tracking-widest text-yellow-700 drop-shadow-lg"
          >
            Yuinek
            <div className="text-xs font-light tracking-wider italic text-yellow-500">
              CALPASINO VERVIQUE
            </div>
          </Link>
        </div>

        {/* Right: Icons */}
        <div className="w-1/4 flex justify-end gap-6 pr-2">
          <Link href="/auth/login">
            <User className="h-6 w-6 text-yellow-700 hover:text-yellow-900 transition" />
          </Link>
          <Link href="/cart">
            <ShoppingBag className="h-6 w-6 text-yellow-700 hover:text-yellow-900 transition" />
          </Link>
        </div>
      </div>

      {/* Bottom Menu */}
      <nav className="bg-yellow-50 shadow-sm border-t border-yellow-200">
        <ul className="flex justify-center gap-8 text-sm font-semibold text-yellow-800 py-2">
          <li>
            <Link
              className="hover:text-yellow-600 hover:border-b-2 hover:border-yellow-500 transition pb-1"
              href="/"
            >
              HOME
            </Link>
          </li>
          <li>
            <Link
              className="hover:text-yellow-600 hover:border-b-2 hover:border-yellow-500 transition pb-1"
              href="/products?type=loafers"
            >
              LOAFER SHOES
            </Link>
          </li>
          <li>
            <Link
              className="hover:text-yellow-600 hover:border-b-2 hover:border-yellow-500 transition pb-1"
              href="/products?type=sports"
            >
              SPORTS SHOES
            </Link>
          </li>
          <li>
            <Link
              className="hover:text-yellow-600 hover:border-b-2 hover:border-yellow-500 transition pb-1"
              href="/products?type=slippers"
            >
              SLIPPER
            </Link>
          </li>
          <li>
            <Link
              className="hover:text-yellow-600 hover:border-b-2 hover:border-yellow-500 transition pb-1"
              href="/products?type=sneakers"
            >
              SNEAKERS
            </Link>
          </li>
          <li>
            <Link
              className="hover:text-yellow-600 hover:border-b-2 hover:border-yellow-500 transition pb-1"
              href="/products?type=formal"
            >
              FORMAL SHOES
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
