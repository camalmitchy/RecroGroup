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
            {
                protocol: "https",
                hostname: "*.public.blob.vercel-storage.com",
                pathname: "/**",
            },
        ],
    },
    async headers() {
        return [
            {
                source: "/:path*",
                headers: [
                    { key: "X-Content-Type-Options", value: "nosniff" },
                    { key: "X-Frame-Options", value: "SAMEORIGIN" },
                    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
                    {
                        key: "Permissions-Policy",
                        value: "camera=(), microphone=(), geolocation=()",
                    },
                ],
            },
        ];
    },
};

module.exports = nextConfig;
