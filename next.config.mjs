/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode:true,
    images:{
        domains:['192.168.0.105','res.cloudinary.com','peaceful-connection-5961e0bd31.media.strapiapp.com']
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
