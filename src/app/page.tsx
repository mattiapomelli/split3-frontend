// import { CreatorsSection } from "@components/landing/creators-section";
import { FeaturesSection } from "@components/landing/features-section";
import { Hero } from "@components/landing/hero";
// import { IntroducationSecion } from "@components/landing/introduction-section";
import { TechnologiesSecion } from "@components/landing/technologies-section";

export default function Home() {
  return (
    <>
      <Hero />
      {/* <IntroducationSecion /> */}
      <FeaturesSection />
      {/* <CreatorsSection /> */}
      <TechnologiesSecion />
    </>
  );
}
