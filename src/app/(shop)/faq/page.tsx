"use client";
import { useState } from "react";

const faqs = [
  {
    question: "How do I reset my password?",
    answer: (
      <>
        Click the <b>Forgot your password?</b> link on the{" "}
        <a href="/login" className="text-indigo-600 underline">
          login page
        </a>{" "}
        and follow the instructions to receive a reset link via email.
      </>
    ),
  },
  {
    question: "How can I contact support?",
    answer: (
      <>
        You can contact our support team by emailing{" "}
        <a
          href="mailto:support@example.com"
          className="text-indigo-600 underline"
        >
          support@example.com
        </a>
        .
      </>
    ),
  },
  {
    question: "How do I update my account information?",
    answer: (
      <>
        After logging in, visit your{" "}
        <a href="/account" className="text-indigo-600 underline">
          account page
        </a>{" "}
        to update your details.
      </>
    ),
  },
  {
    question: "Where can I view my orders?",
    answer: (
      <>
        Go to the{" "}
        <a href="/orders" className="text-indigo-600 underline">
          Orders
        </a>{" "}
        page after logging in to see your order history.
      </>
    ),
  },
  {
    question: "How do I delete my account?",
    answer: (
      <>
        Please contact support at{" "}
        <a
          href="mailto:support@example.com"
          className="text-indigo-600 underline"
        >
          support@example.com
        </a>{" "}
        to request account deletion.
      </>
    ),
  },
];

export default function FAQPage() {
  const [openIndexes, setOpenIndexes] = useState<number[]>([]);

  const toggle = (idx: number) => {
    setOpenIndexes((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  return (
    <main className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
        Frequently Asked Questions
      </h1>
      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div key={idx} className="border rounded-lg">
            <button
              onClick={() => toggle(idx)}
              className="w-full flex justify-between items-center px-4 py-3 text-left font-semibold text-gray-800 hover:bg-gray-50 focus:outline-none"
              aria-expanded={openIndexes.includes(idx)}
              aria-controls={`faq-answer-${idx}`}
            >
              <span>{faq.question}</span>
              <span className="ml-2">
                {openIndexes.includes(idx) ? "−" : "+"}
              </span>
            </button>
            {openIndexes.includes(idx) && (
              <div id={`faq-answer-${idx}`} className="px-4 pb-4 text-gray-700">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
