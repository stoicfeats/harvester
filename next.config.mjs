/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export', // Tells Next.js to generate the 'out' folder
    images: {
        unoptimized: true, // Required for static exports
    },
};

export default nextConfig;