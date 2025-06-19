// src/app/(dashboard)/admin/orders/page.tsx

import { IOrder } from "@/models/Order";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Manage Orders",
  description: "Admin page to view and manage all customer orders.",
};

const formatPrice = (price: number | undefined) => {
  if (price === undefined) return "N/A";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "PHP",
  }).format(price);
};

async function getOrders() {
  try {
    const apiUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const cookieStore = cookies();
    const token = cookieStore.get("accessToken");

    const res = await fetch(`${apiUrl}/api/orders?all=true`, {
      cache: "no-store",
      headers: {
        Cookie: `accessToken=${token?.value}`,
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Failed to fetch orders");
    }
    const data = await res.json();
    return data.orders;
  } catch (error) {
    console.error("[GET_ADMIN_ORDERS_ERROR]", error);
    return [];
  }
}

export default async function AdminOrdersPage() {
  const orders: IOrder[] = await getOrders();

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Orders</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all the orders placed in your store.
          </p>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="bg-white shadow sm:rounded-lg">
              <ul role="list" className="divide-y divide-gray-200">
                {orders.map((order) => (
                  <li key={order._id}>
                    <Link
                      href={`/admin/orders/${order._id}`}
                      className="block hover:bg-gray-50"
                    >
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <p className="truncate text-sm font-medium text-indigo-600">
                            {order.order_number}
                          </p>
                          <div className="ml-2 flex flex-shrink-0">
                            <p className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800 capitalize">
                              {order.status}
                            </p>
                          </div>
                        </div>
                        <div className="mt-2 sm:flex sm:justify-between">
                          <div className="sm:flex">
                            <p className="flex items-center text-sm text-gray-500">
                              {order.user_id.first_name}{" "}
                              {order.user_id.last_name}
                            </p>
                            <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                            <p>{formatPrice(order.total_amount)}</p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
