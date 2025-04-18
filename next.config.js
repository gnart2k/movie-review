/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
    devIndicators: false,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'image.tmdb.org',
                pathname: '/t/p/**',
            },
            {
                protocol: 'https',
                hostname: 'www.themoviedb.org',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'img.clerk.com',
                pathname: '/**',
            },
        ],
    },
};

export default config;
