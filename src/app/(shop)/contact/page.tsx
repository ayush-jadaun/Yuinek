// src/app/(shop)/contact/page.tsx

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with ShoeStore customer support.",
};

export default function ContactPage() {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600">
            Get in touch
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            We’d love to hear from you
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Whether you have a question about our products, need assistance with
            an order, or just want to say hello, our team is ready to answer all
            your questions.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-xl sm:mt-20">
          {/* In a real app, you would have a contact form here that sends an email or saves to a DB */}
          <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800">
              Contact Form Coming Soon
            </h3>
            <p className="mt-2 text-gray-500">
              For now, please reach out to us at{" "}
              <a
                href="mailto:support@shoestore.com"
                className="text-indigo-600 hover:underline"
              >
                support@shoestore.com
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
