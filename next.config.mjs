import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    domains: ["cdn.shopify.com"],
    formats: ["image/avif", "image/webp"],
  },
};

export default withNextIntl(nextConfig);
