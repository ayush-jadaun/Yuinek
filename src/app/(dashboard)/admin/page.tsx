// src/app/(dashboard)/admin/page.tsx

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Admin dashboard for ShoeStore.",
};

// In a real app, you would fetch real data here
async function getDashboardStats() {
  // Fake data for now
  return {
    totalRevenue: 1250345.67,
    totalSales: 834,
    newCustomers: 45,
    pendingOrders: 12,
  };
}

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  const formattedStats = [
    { name: "Total Revenue", value: `₱${stats.totalRevenue.toLocaleString()}` },
    { name: "Total Sales", value: stats.totalSales.toLocaleString() },
    {
      name: "New Customers This Month",
      value: stats.newCustomers.toLocaleString(),
    },
    { name: "Pending Orders", value: stats.pendingOrders.toLocaleString() },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
        Dashboard
      </h1>

      <div className="mt-8">
        <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {formattedStats.map((item) => (
            <div
              key={item.name}
              className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6"
            >
              <dt className="truncate text-sm font-medium text-gray-500">
                {item.name}
              </dt>
              <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                {item.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      {/* You could add more sections here like recent orders, top products etc. */}
    </div>
  );
}
