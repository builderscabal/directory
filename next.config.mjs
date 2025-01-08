/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'giant-platypus-753.convex.cloud',
      },
      {
        protocol: 'https',
        hostname: 'neighborly-starling-797.convex.cloud',
      },
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
      },
      {
        protocol: 'https',
        hostname: 'i.vimeocdn.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.loom.com',
      },
      {
        protocol: 'https',
        hostname: 's1.dmcdn.net',  // Dailymotion
      },
      {
        protocol: 'https',
        hostname: 'embedwistia-a.akamaihd.net',  // Wistia
      },
      {
        protocol: 'https',
        hostname: 'platform-lookaside.fbsbx.com',  // Facebook video thumbnails
      },
      {
        protocol: 'https',
        hostname: 'static-cdn.jtvnw.net',  // Twitch
      },
      {
        protocol: 'https',
        hostname: 'p16-amd-va.tiktokcdn.com',  // TikTok
      },
      {
        protocol: 'https',
        hostname: 'scontent.cdninstagram.com',  // Instagram
      },
      {
        protocol: 'https',
        hostname: 'bcsecure01-a.akamaihd.net',  // Brightcove
      },
      {
        protocol: 'https',
        hostname: 'cdn.jwplayer.com',  // JW Player
      },
      {
        protocol: 'https',
        hostname: 'pbs.twimg.com',  // Twitter images
      },
      {
        protocol: 'https',
        hostname: 'video.twimg.com',  // Twitter videos
      },
      
      {
        protocol: 'https',
        hostname: 'drive.google.com',  // Google Drive PDFs
      },
      {
        protocol: 'https',
        hostname: 'dropbox.com',  // Dropbox PDFs
      },
      {
        protocol: 'https',
        hostname: 'docsend.com',  // DocSend PDFs
      },
      {
        protocol: 'https',
        hostname: 'scribd.com',  // Scribd PDFs
      },
      {
        protocol: 'https',
        hostname: 'box.com',  // Box PDFs
      },
      {
        protocol: 'https',
        hostname: 'issuu.com',  // Issuu PDFs
      },
      {
        protocol: 'https',
        hostname: 'yumpu.com',  // Yumpu PDFs
      },
      {
        protocol: 'https',
        hostname: 'flipsnack.com',  // Flipsnack PDFs
      },
      {
        protocol: 'https',
        hostname: 'publitas.com',  // Publitas PDFs
      },
      {
        protocol: 'https',
        hostname: 'calameo.com',  // Calaméo PDFs
      },
      {
        protocol: 'https',
        hostname: 'papermark.io',  // Papermark PDFs
      },
      {
        protocol: 'https',
        hostname: 'pitch.com',  // Pitch PDFs
      },
      {
        protocol: 'https',
        hostname: 'flowpaper.com',  // Flowpaper PDFs
      },
    ],
  },
};

export default nextConfig;