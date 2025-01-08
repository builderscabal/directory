import { Metadata } from "next";

export const socials = [
  {
    id: 1,
    name: "Twitter",
    url: "https://x.com/builderscabal",
    handle: "@builderscabal",
  }
];

const title = "Directory | BuildersCabal";
const description =
  "Find startups, tools, and products in Africa";
const image =
  "";

export const metaData: Metadata = {
  title: title,
  description: description,
  openGraph: {
    title,
    description,
    url: "https://x.com/builderscabal",
    siteName: "builderscabal",
    images: [{ url: image }],
    locale: "en-US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  twitter: {
    title: title,
    description: description,
    card: "summary_large_image",
    images: [image],
    creator: "@builderscabal",
  },
};