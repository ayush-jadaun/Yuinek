// src/components/layout/Footer.tsx

import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white mt-12">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-4">
            <Link href="/" className="-m-1.5 p-1.5">
              <span className="text-xl font-bold tracking-tight">
                ShoeStore
              </span>
            </Link>
            <p className="text-sm leading-6 text-gray-300">
              The best place to find your sole mate. High-quality footwear for
              all occasions.
            </p>
          </div>
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6">Shop</h3>
                <ul role="list" className="mt-6 space-y-4">
                  <li>
                    <Link
                      href="/products"
                      className="text-sm leading-6 text-gray-300 hover:text-white"
                    >
                      All Products
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/categories/men"
                      className="text-sm leading-6 text-gray-300 hover:text-white"
                    >
                      Men
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/categories/women"
                      className="text-sm leading-6 text-gray-300 hover:text-white"
                    >
                      Women
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold leading-6">Support</h3>
                <ul role="list" className="mt-6 space-y-4">
                  <li>
                    <Link
                      href="/contact"
                      className="text-sm leading-6 text-gray-300 hover:text-white"
                    >
                      Contact Us
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/faq"
                      className="text-sm leading-6 text-gray-300 hover:text-white"
                    >
                      FAQ
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/shipping"
                      className="text-sm leading-6 text-gray-300 hover:text-white"
                    >
                      Shipping & Returns
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6">Company</h3>
                <ul role="list" className="mt-6 space-y-4">
                  <li>
                    <Link
                      href="/about"
                      className="text-sm leading-6 text-gray-300 hover:text-white"
                    >
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/careers"
                      className="text-sm leading-6 text-gray-300 hover:text-white"
                    >
                      Careers
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/press"
                      className="text-sm leading-6 text-gray-300 hover:text-white"
                    >
                      Press
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-16 border-t border-white/10 pt-8 sm:mt-20 lg:mt-24">
          <p className="text-xs leading-5 text-gray-400">
            © {currentYear} ShoeStore, Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
