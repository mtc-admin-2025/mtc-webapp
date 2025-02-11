/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode:true,
    images:{
        domains:['192.168.0.105','res.cloudinary.com','deserving-friendship-7abc601c03.strapiapp.com']
    },
    onDemandEntries: {
        maxInactiveAge: 25 * 1000,
        pagesBufferLength: 2,
    },
    experimental: {
        appDir: true,
    }
};

export default nextConfig;
