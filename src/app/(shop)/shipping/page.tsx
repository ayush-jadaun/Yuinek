export default function ShippingAndReturnsPage() {
  return (
    <main className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
        Shipping &amp; Returns
      </h1>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Shipping Information</h2>
        <ul className="list-disc pl-6 text-gray-700 space-y-2">
          <li>
            <b>Processing Time:</b> Orders are processed within 1-2 business
            days after payment is received.
          </li>
          <li>
            <b>Shipping Rates &amp; Delivery Estimates:</b> Shipping charges for
            your order will be calculated and displayed at checkout. Delivery
            times vary by location, typically 3-7 business days within the
            Philippines.
          </li>
          <li>
            <b>Order Tracking:</b> You will receive a tracking number by email
            once your order has shipped.
          </li>
          <li>
            <b>International Shipping:</b> At this time, we only ship within the
            Philippines.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Returns &amp; Exchanges</h2>
        <ul className="list-disc pl-6 text-gray-700 space-y-2">
          <li>
            <b>Return Window:</b> You can return items within 14 days of
            receiving your order.
          </li>
          <li>
            <b>Eligibility:</b> Items must be unused, in the same condition that
            you received them, and in the original packaging.
          </li>
          <li>
            <b>Non-Returnable Items:</b> Sale items, gift cards, and perishable
            goods are not eligible for return.
          </li>
          <li>
            <b>How to Return:</b> To initiate a return, contact our support team
            at{" "}
            <a
              href="mailto:support@example.com"
              className="text-indigo-600 underline"
            >
              support@example.com
            </a>{" "}
            with your order number and reason for return.
          </li>
          <li>
            <b>Refunds:</b> Once your return is received and inspected, we will
            notify you of the approval or rejection of your refund. If approved,
            your refund will be processed to your original payment method.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Questions?</h2>
        <p className="text-gray-700">
          If you have any questions about shipping or returns, please contact us
          at{" "}
          <a
            href="mailto:support@example.com"
            className="text-indigo-600 underline"
          >
            support@example.com
          </a>
          .
        </p>
      </section>
    </main>
  );
}
