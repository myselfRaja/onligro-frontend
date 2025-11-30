export async function getAllSalons(filters = {}, sort = "rating-desc") {
  try {
    const params = new URLSearchParams({ ...filters, sort }).toString();

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/public/salon?${params}`,
      { cache: "no-store" }
    );

    if (!res.ok) throw new Error("Failed to fetch salons");

    const data = await res.json();
    return data.salons || [];
  } catch (error) {
    console.error("GET SALONS ERROR:", error.message);
    return [];
  }
}
