const defaultUrl = process.env.VERCEL_URL
  ? `https://www.builderscabal.com/join`
  : "http://localhost:3000/join"

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Join the Community | BuildersCabal",
  description:
    "One of the underrated '1000 Ways To Die' is Building a startup in Africa. It can be a very rewarding adventure going by the successes of Flutterwave, Andela and Paystack. One of the hack to building faster is doing it with a community of like-minded superstars who are solving Africa's most challenging problems across multiple industries.",
  keywords:
    "Startups, Products, Brands, African Startups, SAAS tools, FinTech Startups, HealthTech Startups, AgriTech Startups, African Innovations, Emerging Tech in Africa, African Entrepreneurs, Startup Ecosystem, SAAS Solutions, FinTech Innovations, HealthTech Solutions, AgriTech Innovations, Tech Startups, Disruptive Technologies, Africa’s Leading Startups, African Business Directory, African Tech Ecosystem, Innovative Products, Business Solutions, African Markets, Digital Transformation, Startup Community, Investment Opportunities, Tech Hubs in Africa, African Business Growth, Startup Success Stories, African Business Network, Tech Pioneers in Africa, African Startup Showcase, Rising Entrepreneurs, Africa’s Future Leaders, Tech Revolution, African Business Innovations",
  openGraph: {
    images: [
      {
        url: "https://www.builderscabal.com/images/join.png",
        width: 1200,
        height: 630,
        alt: "One of the underrated '1000 Ways To Die' is Building a startup in Africa. It can be a very rewarding adventure going by the successes of Flutterwave, Andela and Paystack. One of the hack to building faster is doing it with a community of like-minded superstars who are solving Africa's most challenging problems across multiple industries.",
      },
    ],
  },
  structuredData: {
    "@context": "http://schema.org",
    "@type": "WebSite",
    name: "Join the Community | BuildersCabal",
    url: "https://www.builderscabal.com/join",
    description:
      "One of the underrated '1000 Ways To Die' is Building a startup in Africa. It can be a very rewarding adventure going by the successes of Flutterwave, Andela and Paystack. One of the hack to building faster is doing it with a community of like-minded superstars who are solving Africa's most challenging problems across multiple industries.",
  },
  socialMediaTags: {
    "og:title": "Join the Community | BuildersCabal",
    "og:description":
      "One of the underrated '1000 Ways To Die' is Building a startup in Africa. It can be a very rewarding adventure going by the successes of Flutterwave, Andela and Paystack. One of the hack to building faster is doing it with a community of like-minded superstars who are solving Africa's most challenging problems across multiple industries.",
    "og:image": "https://www.builderscabal.com/images/join.png",
    "twitter:card": "summary_large_image",
    "twitter:image": "https://www.builderscabal.com/images/join.png",
    "twitter:title": "Virtual Launch Party 🎉 | BuildersCabal",
    "twitter:description":
      "Join us as we officially unveil BuildersCabal, an impact-driven community for tech builders across Africa. BuildersCabal connects founders, operators, and innovators who are actively building and scaling tech companies, united by a shared vision: to unlock prosperity in Africa through innovation and collaboration.",
    "linkedin:image": "https://www.builderscabal.com/images/join.png",
    "facebook:image": "https://www.builderscabal.com/images/join.png",
  },
};

export default function JoinLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      {children}
    </main>
  );
};