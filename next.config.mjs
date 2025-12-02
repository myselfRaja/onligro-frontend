/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },

    async redirects() {
    return [
      // Redirect ONLY when user visits dashboard.onligro.com
      {
        source: "/",
        has: [
          {
            type: "host",
            value: "dashboard.onligro.com",
          },
        ],
        destination: "/owner/dashboard",
        permanent: true,
      },
    ];
  },
};


export default nextConfig;
