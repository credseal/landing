import { Helmet } from "react-helmet-async";
import { useNavScrolled } from "@/hooks/useNavScroll";
import { useReveal } from "@/hooks/useReveal";
import { Plausible } from "@/components/Plausible";
import { CtaSection } from "./CtaSection";
import { EmailCapture } from "./EmailCapture";
import { FaqSection } from "./FaqSection";
import { FeaturesSection } from "./FeaturesSection";
import { HeroSection } from "./HeroSection";
import { HowItWorksSection } from "./HowItWorksSection";
import { IntegrationsSection } from "./IntegrationsSection";
import { LandingFooter } from "./LandingFooter";
import { LandingNav } from "./LandingNav";
import { PricingSection } from "./PricingSection";
import { TrustBar } from "./TrustBar";

export function HomePage() {
  const scrolled = useNavScrolled();
  useReveal();

  return (
    <>
      <Helmet>
        <title>IdentArk — Credential Isolation for AI Agents</title>
        <meta
          name="description"
          content="Your AI agents should not hold API keys. IdentArk is the open-source credential isolation layer for production agents. Zero secrets in code. Full audit trail."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://identark.io/" />
        <meta property="og:title" content="IdentArk — Credential Isolation for AI Agents" />
        <meta property="og:description" content="Zero secrets in your agents. Full audit trail. Open source." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      <Plausible />

      <div className="banner">
        🚀 identark-sdk v1.1.0 is live on PyPI — streaming support + n8n adapter &nbsp;
        <a href="https://github.com/identark/sdk/releases" target="_blank" rel="noopener noreferrer">
          Read the release →
        </a>
      </div>

      <LandingNav scrolled={scrolled} />

      <main>
        <HeroSection />
        <TrustBar />
        <HowItWorksSection />
        <FeaturesSection />
        <IntegrationsSection />
        <PricingSection />
        <FaqSection />
        <EmailCapture />
        <CtaSection />
      </main>

      <LandingFooter />
    </>
  );
}
