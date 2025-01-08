import "./globals.css"
import LocalFont from "next/font/local"

export const calSans = LocalFont({
  src: "../fonts/CalSans-SemiBold.ttf",
  variable: "--font-calsans",
})

const defaultUrl = process.env.VERCEL_URL
  ? `https://www.builderscabal.com`
  : "http://localhost:3000"

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "BuildersCabal Directory | Find startups, tools, products, and services within the builderscabal community",
  description:
    "One of the underrated '1000 Ways To Die' is Building a startup in Africa. It can be a very rewarding adventure going by the successes of Flutterwave, Andela and Paystack. One of the hack to building faster is doing it with a community of like-minded superstars who are solving Africa's most challenging problems across multiple industries.",
  keywords:
    "Startups, Products, Brands, African Startups, SAAS tools, FinTech Startups, HealthTech Startups, AgriTech Startups, African Innovations, Emerging Tech in Africa, African Entrepreneurs, Startup Ecosystem, SAAS Solutions, FinTech Innovations, HealthTech Solutions, AgriTech Innovations, Tech Startups, Disruptive Technologies, Africa’s Leading Startups, African Business Directory, African Tech Ecosystem, Innovative Products, Business Solutions, African Markets, Digital Transformation, Startup Community, Investment Opportunities, Tech Hubs in Africa, African Business Growth, Startup Success Stories, African Business Network, Tech Pioneers in Africa, African Startup Showcase, Rising Entrepreneurs, Africa’s Future Leaders, Tech Revolution, African Business Innovations",
  structuredData: {
    "@context": "http://schema.org",
    "@type": "WebSite",
    name: "BuildersCabal Directory | Find startups, tools, products, and services within the builderscabal community",
    url: "https://www.builderscabal.com",
    description:
      "One of the underrated '1000 Ways To Die' is Building a startup in Africa. It can be a very rewarding adventure going by the successes of Flutterwave, Andela and Paystack. One of the hack to building faster is doing it with a community of like-minded superstars who are solving Africa's most challenging problems across multiple industries.",
  },
  socialMediaTags: {
    "og:title": "BuildersCabal Directory | Find startups, tools, products, and services within the builderscabal community",
    "og:description":
      "One of the underrated '1000 Ways To Die' is Building a startup in Africa. It can be a very rewarding adventure going by the successes of Flutterwave, Andela and Paystack. One of the hack to building faster is doing it with a community of like-minded superstars who are solving Africa's most challenging problems across multiple industries.",
    "twitter:card": "summary_large_image",
  },
};