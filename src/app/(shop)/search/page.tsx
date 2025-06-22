interface SearchPageProps {
  searchParams: { q?: string };
}

async function fetchSearchResults(query: string) {
  // Call your API route with the search query, returns products array
  const res = await fetch(
    `${
      process.env.NEXT_PUBLIC_BASE_URL || ""
    }/api/products/search?q=${encodeURIComponent(query)}`,
    { cache: "no-store" }
  );
  if (!res.ok) {
    throw new Error("Failed to fetch search results");
  }
  const data = await res.json();
  return data.products || [];
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
    const { q = "" } = await searchParams;
    const query = q.trim();

  if (!query) {
    return (
      <section className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold mb-4">Search</h1>
        <p className="text-gray-600">Please enter a search query.</p>
      </section>
    );
  }

  let results: any[] = [];
  try {
    results = await fetchSearchResults(query);
  } catch {
    return (
      <section className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold mb-4">Search results</h1>
        <p className="text-red-600">
          Error fetching results. Please try again later.
        </p>
      </section>
    );
  }

  return (
    <section className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-4">
        Search results for &quot;{query}&quot;
      </h1>
      {results.length === 0 ? (
        <p className="text-gray-600">No products found.</p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {results.map((product: any) => (
            <li key={product._id} className="border rounded p-4 shadow">
              <h2 className="font-semibold">{product.name}</h2>
              {/* Add more product details here */}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
