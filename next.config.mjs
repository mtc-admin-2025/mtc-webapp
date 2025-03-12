/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode:true,
    images:{
        domains:['192.168.0.105','res.cloudinary.com','whimsical-oasis-b2dd051418.strapiapp.com']
    },
    onDemandEntries: {
        maxInactiveAge: 25 * 1000,
        pagesBufferLength: 2,
    },
    experimental: {
        appDir: false,
    }
};

export default nextConfig;
