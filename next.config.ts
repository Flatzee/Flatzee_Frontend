/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },

      // your hosts — examples:
      { protocol: "https", hostname: "flatzee.com" },
      { protocol: "https", hostname: "cdn.flatzee.com" },
      { protocol: "https", hostname: "flatzee.s3.amazonaws.com" },

      // if you use multiple subdomains on the same domain:
      { protocol: "https", hostname: "**.flatzee.com" }, // wildcard subdomains
    ],
  },
};
module.exports = nextConfig;
