/** @type {import('next').NextConfig} */
const nextConfig = {
  // Empty turbopack config to acknowledge Turbopack is enabled in Next.js 16+
  // The webpack config below is only used when explicitly running with --webpack
  turbopack: {},
  webpack: (config, { isServer, dev }) => {
    // Fix webpack cache issues by using memory cache in development
    // This resolves the "Unable to snapshot resolve dependencies" warning
    // Memory cache avoids filesystem snapshot issues while still providing caching benefits
    if (dev && config.cache && config.cache.type === "filesystem") {
      config.cache = {
        type: "memory",
      };
    }
    return config;
  },
};

export default nextConfig;
