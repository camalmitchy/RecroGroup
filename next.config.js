const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
    turbopack: {
        root: path.resolve(__dirname),
    },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "i.ytimg.com",
                pathname: "/vi/**",
            },
            {
                protocol: "https",
                hostname: "images.unsplash.com",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "placehold.co",
                pathname: "/**",
            },
        ],
    },
};

module.exports = nextConfig;
