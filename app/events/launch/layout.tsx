import Head from "next/head";

const defaultUrl = process.env.VERCEL_URL
  ? `https://www.builderscabal.com/events/launch`
  : "http://localhost:3000/events/launch";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Virtual Launch Party 🎉 | BuildersCabal",
  description:
    "Join us as we officially unveil BuildersCabal, an impact-driven community for tech builders across Africa. BuildersCabal connects founders, operators, and innovators who are actively building and scaling tech companies, united by a shared vision: to unlock prosperity in Africa through innovation and collaboration.",
  keywords:
    "Startups, Products, Brands, African Startups, SAAS tools, FinTech Startups, HealthTech Startups, AgriTech Startups, African Innovations, Emerging Tech in Africa, African Entrepreneurs, Startup Ecosystem, SAAS Solutions, FinTech Innovations, HealthTech Solutions, AgriTech Innovations, Tech Startups, Disruptive Technologies, Africa’s Leading Startups, African Business Directory, African Tech Ecosystem, Innovative Products, Business Solutions, African Markets, Digital Transformation, Startup Community, Investment Opportunities, Tech Hubs in Africa, African Business Growth, Startup Success Stories, African Business Network, Tech Pioneers in Africa, African Startup Showcase, Rising Entrepreneurs, Africa’s Future Leaders, Tech Revolution, African Business Innovations, Innovation Hubs, Technology Conferences, Digital Ecosystems, Entrepreneurship in Africa, Business Networking, Virtual Events, Tech Communities, Startup Funding, Ecosystem Builders, Collaborative Platforms, Scaling Businesses, Market Disruptions, Future of Work, Sustainable Development, Social Impact",
  openGraph: {
    images: [
      {
        url: "https://www.builderscabal.com/images/launch-event.png",
        width: 1200,
        height: 630,
        alt: "Join us as we officially unveil BuildersCabal, an impact-driven community for tech builders across Africa. BuildersCabal connects founders, operators, and innovators who are actively building and scaling tech companies, united by a shared vision: to unlock prosperity in Africa through innovation and collaboration.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Virtual Launch Party 🎉 | BuildersCabal",
    description: "Join us as we officially unveil BuildersCabal, an impact-driven community for tech builders across Africa. BuildersCabal connects founders, operators, and innovators who are actively building and scaling tech companies, united by a shared vision: to unlock prosperity in Africa through innovation and collaboration.",
    image: "https://www.builderscabal.com/images/launch-event.png",
  },
  structuredData: {
    "@context": "http://schema.org",
    "@type": "WebSite",
    name: "Virtual Launch Party 🎉 | BuildersCabal",
    url: "https://www.builderscabal.com/events/launch",
    description:
      "Join us as we officially unveil BuildersCabal, an impact-driven community for tech builders across Africa. BuildersCabal connects founders, operators, and innovators who are actively building and scaling tech companies, united by a shared vision: to unlock prosperity in Africa through innovation and collaboration.",
  },
  socialMediaTags: {
    "og:title": "Virtual Launch Party 🎉 | BuildersCabal",
    "og:description":
      "Join us as we officially unveil BuildersCabal, an impact-driven community for tech builders across Africa. BuildersCabal connects founders, operators, and innovators who are actively building and scaling tech companies, united by a shared vision: to unlock prosperity in Africa through innovation and collaboration.",
    "og:image": "https://www.builderscabal.com/images/launch-event.png",
    "twitter:card": "summary_large_image",
    "twitter:image": "https://www.builderscabal.com/images/launch-event.png",
    "twitter:title": "Virtual Launch Party 🎉 | BuildersCabal",
    "twitter:description":
      "Join us as we officially unveil BuildersCabal, an impact-driven community for tech builders across Africa. BuildersCabal connects founders, operators, and innovators who are actively building and scaling tech companies, united by a shared vision: to unlock prosperity in Africa through innovation and collaboration.",
    "linkedin:image": "https://www.builderscabal.com/images/launch-event.png",
    "facebook:image": "https://www.builderscabal.com/images/launch-event.png",
  },
};

export default function JoinLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Head>
        <title>Virtual Launch Party 🎉 | BuildersCabal</title>
        <meta
          name="description"
          content="Join us as we officially unveil BuildersCabal, an impact-driven community for tech builders across Africa. BuildersCabal connects founders, operators, and innovators who are actively building and scaling tech companies, united by a shared vision: to unlock prosperity in Africa through innovation and collaboration."
        />
        <meta property="og:url" content={defaultUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Virtual Launch Party 🎉 | BuildersCabal" />
        <meta
          property="og:description"
          content="Join us as we officially unveil BuildersCabal, an impact-driven community for tech builders across Africa. BuildersCabal connects founders, operators, and innovators who are actively building and scaling tech companies, united by a shared vision: to unlock prosperity in Africa through innovation and collaboration."
        />
        <meta
          property="og:image"
          content="https://www.builderscabal.com/images/launch-event.png"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://www.builderscabal.com/images/launch-event.png" />
        <meta name="twitter:title" content="Virtual Launch Party 🎉 | BuildersCabal" />
        <meta
          name="twitter:description"
          content="Join us as we officially unveil BuildersCabal, an impact-driven community for tech builders across Africa. BuildersCabal connects founders, operators, and innovators who are actively building and scaling tech companies, united by a shared vision: to unlock prosperity in Africa through innovation and collaboration."
        />
      </Head>
      <main>{children}</main>
    </>
  );
};