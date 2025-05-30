"use client";

// For real app, fetch reviews from API/db
const feedbacks = [
  {
    name: "Aarav S.",
    comment: "Absolutely love the quality and comfort! Highly recommended.",
    rating: 5,
  },
  {
    name: "Priya M.",
    comment: "Fast delivery and beautiful packaging. Will buy again.",
    rating: 4,
  },
  // Add more...
];

const CustomerFeedback = () => (
  <section className="w-full py-12 bg-yellow-50">
    <h2 className="text-3xl font-serif text-yellow-700 mb-8 text-center">
      Customer Feedback
    </h2>
    <div className="max-w-4xl mx-auto overflow-x-auto">
      <div className="flex gap-6 animate-scroll-x">
        {feedbacks.map((fb, idx) => (
          <div
            key={idx}
            className="min-w-[300px] bg-white rounded-lg shadow-md p-6 flex flex-col items-center"
          >
            <div className="flex items-center mb-2">
              {[...Array(fb.rating)].map((_, i) => (
                <span key={i} className="text-yellow-400 text-xl">
                  ★
                </span>
              ))}
              {[...Array(5 - fb.rating)].map((_, i) => (
                <span key={i} className="text-gray-200 text-xl">
                  ★
                </span>
              ))}
            </div>
            <div className="text-gray-700 italic mb-2">
              &quot;{fb.comment}&quot;
            </div>
            <div className="text-yellow-700 font-bold">{fb.name}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// Add this CSS to your global or module CSS for auto-scrolling effect:
// .animate-scroll-x { animation: scroll-x 30s linear infinite; }
// @keyframes scroll-x { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }

export default CustomerFeedback;
