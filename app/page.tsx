import Navbar from "@/components/navbar";
import HeroSection from "@/components/hero-section";
import PortfolioSection from "@/components/portfolio-section";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <PortfolioSection />
      </main>
    </>
  );
}
