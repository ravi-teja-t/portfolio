import { AboutSnippet } from "@/components/sections/AboutSnippet";
import { Closing } from "@/components/sections/Closing";
import { Faq } from "@/components/sections/Faq";
import { FeaturedWork } from "@/components/sections/FeaturedWork";
import { Hero } from "@/components/sections/Hero";
import { HowIWork } from "@/components/sections/HowIWork";
import { Proof } from "@/components/sections/Proof";
import { Services } from "@/components/sections/Services";
import { TechStack } from "@/components/sections/TechStack";
import { Testimonials } from "@/components/sections/Testimonials";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("/");

export default function Home() {
  return (
    <>
      <Hero />
      <Proof />
      <Services />
      <FeaturedWork />
      <HowIWork />
      <TechStack />
      <AboutSnippet />
      <Testimonials />
      <Faq />
      <Closing />
    </>
  );
}
