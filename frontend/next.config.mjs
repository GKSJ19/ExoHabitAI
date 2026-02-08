// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Ensure React 18 compatibility
  experimental: {
    esmExternals: 'loose',
  },

  // Optimize for Three.js
  webpack: (config, { isServer }) => {
    // Fix for R3F on server side
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push({
        three: 'three',
        '@react-three/fiber': '@react-three/fiber',
        '@react-three/drei': '@react-three/drei',
      });
    }

    return config;
  },

  // Transpile Three.js packages
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei'],
};

export default nextConfig;