/** @type {import('next').NextConfig} */
const nextConfig = {
  // reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/api/chat",
        headers: [
          {
            key: "Connection",
            value: "Keep-Alive",
          },
          {
            key: "Keep-Alive",
            value: "timeout=120, max=2000",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;

//Connection: Keep-Alive
//Keep-Alive: timeout=5, max=1000
