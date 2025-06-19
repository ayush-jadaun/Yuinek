// src/app/(dashboard)/admin/orders/[id]/page.tsx

import { IOrder } from "@/models/Order";
import { cookies } from "next/headers";
import type { Metadata } from "next";
import OrderStatusUpdater from "@/components/admin/OrderStatusUpdater";

interface OrderDetailPageProps {
  params: { id: string };
}

const formatPrice = (price: number = 0) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "PHP",
  }).format(price);
};

async function getOrder(id: string) {
  try {
    const apiUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const cookieStore = cookies();
    const token = cookieStore.get("accessToken");

    const res = await fetch(`${apiUrl}/api/orders/${id}`, {
      cache: "no-store",
      headers: { Cookie: `accessToken=${token?.value}` },
    });

    if (!res.ok) return null;
    const data = await res.json();
    return data.order;
  } catch (error) {
    console.error(`[GET_ADMIN_ORDER_ERROR: ${id}]`, error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: OrderDetailPageProps): Promise<Metadata> {
  const order: IOrder | null = await getOrder(params.id);
  if (!order) return { title: "Order Not Found" };
  return { title: `Order ${order.order_number}` };
}

export default async function AdminOrderDetailPage({
  params,
}: OrderDetailPageProps) {
  const order: IOrder | null = await getOrder(params.id);

  if (!order) {
    return (
      <p className="text-center text-red-500">
        Order not found or you do not have permission to view it.
      </p>
    );
  }

  return (
    <div>
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Order {order.order_number}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Placed on{" "}
            {new Date(order.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <OrderStatusUpdater
            orderId={order._id}
            currentStatus={order.status}
          />
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Order Items Section */}
        <div className="lg:col-span-2">
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-base font-semibold leading-6 text-gray-900">
                Items ({order.items.length})
              </h3>
              <ul role="list" className="mt-6 divide-y divide-gray-200">
                {order.items.map((item) => (
                  <li key={item.product_id} className="flex py-4">
                    {/* In a real app, you would have an image here */}
                    <div className="ml-3 flex flex-1 flex-col">
                      <div>
                        <div className="flex justify-between text-base font-medium text-gray-900">
                          <h3>{item.product_name}</h3>
                          <p className="ml-4">
                            {formatPrice(item.total_price)}
                          </p>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">
                          {item.color_name} / {item.size_name}
                        </p>
                      </div>
                      <div className="flex flex-1 items-end justify-between text-sm">
                        <p className="text-gray-500">Qty {item.quantity}</p>
                        <p className="text-gray-500">
                          Unit Price: {formatPrice(item.unit_price)}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Customer & Address Section */}
        <div className="lg:col-span-1">
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-base font-semibold leading-6 text-gray-900">
                Customer
              </h3>
              <div className="mt-4 text-sm text-gray-600">
                <p>
                  {order.user_id.first_name} {order.user_id.last_name}
                </p>
                <p>{order.user_id.email}</p>
              </div>
            </div>
          </div>
          <div className="mt-8 bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-base font-semibold leading-6 text-gray-900">
                Shipping Address
              </h3>
              <address className="mt-4 not-italic text-sm text-gray-600">
                <p>
                  {order.shipping_address.first_name}{" "}
                  {order.shipping_address.last_name}
                </p>
                <p>{order.shipping_address.address_line_1}</p>
                {order.shipping_address.address_line_2 && (
                  <p>{order.shipping_address.address_line_2}</p>
                )}
                <p>
                  {order.shipping_address.city},{" "}
                  {order.shipping_address.state_province}{" "}
                  {order.shipping_address.postal_code}
                </p>
                <p>{order.shipping_address.country}</p>
              </address>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
