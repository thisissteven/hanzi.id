import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ["pg", "@prisma/adapter-pg", "@prisma/client"],
  i18n: {
    locales: ["en", "id"],
    defaultLocale: "en",
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
      {
        hostname: "img.youtube.com",
        pathname: "/**",
        port: "",
        protocol: "https",
      },
      {
        hostname: "api-cdn.dioco.io",
        pathname: "/**",
        port: "",
        protocol: "https",
      },
      {
        hostname: "cdn.langeek.co",
        pathname: "/**",
        port: "",
        protocol: "https",
      },
    ],
  },

  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        dns: false,
      };
    }

    // load worker files as a urls with `file-loader`
    config.module.rules.unshift({
      test: /pdf\.worker\.(min\.)?js/,
      use: [
        {
          loader: "file-loader",
          options: {
            name: "[contenthash].[ext]",
            publicPath: "_next/static/worker",
            outputPath: "static/worker",
          },
        },
      ],
    });

    return config;
  },
};

export default withPWA({
  ...nextConfig,
});
