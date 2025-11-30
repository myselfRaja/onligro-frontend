export const API_URL =
  typeof window !== "undefined" &&
  window.location.hostname === "localhost"
    ? process.env.NEXT_PUBLIC_LOCAL_API
    : process.env.NEXT_PUBLIC_PROD_API;
