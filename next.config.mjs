import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ["en", "id"],
    defaultLocale: "en",
    localeDetection: false,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        hostname: "res.cloudinary.com",
        pathname: "/**",
        port: "",
        protocol: "https",
      },
    ],
  },
};

export default withPWA({
  ...nextConfig,
});
