// src/app/(dashboard)/admin/users/page.tsx

import { IUser } from "@/models/User";
import type { Metadata } from "next";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "Manage Users",
  description: "Admin page to view and manage registered users.",
};

async function getUsers() {
  try {
    const apiUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const cookieStore = cookies();
    const token = cookieStore.get("accessToken");

    // Fetch users using the admin's access token for authorization
    const res = await fetch(`${apiUrl}/api/users`, {
      cache: "no-store",
      headers: {
        Cookie: `accessToken=${token?.value}`,
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Failed to fetch users");
    }
    const data = await res.json();
    return data.users;
  } catch (error) {
    console.error("[GET_ADMIN_USERS_ERROR]", error);
    return [];
  }
}

export default async function AdminUsersPage() {
  const users: IUser[] = await getUsers();

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Users</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all the users in your store including their name, email,
            and role.
          </p>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Email
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Role
                    </th>
                    <th
                      scope="col"
                      className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                    >
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {users.map((user) => (
                    <tr key={user.email}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {user.first_name} {user.last_name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {user.email}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {user.is_active ? (
                          <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
                            Inactive
                          </span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 capitalize">
                        {user.user_type}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <a
                          href="#"
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Edit
                          <span className="sr-only">, {user.first_name}</span>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
