import Navbar from "@/components/navbar";
import HeroSection from "@/components/hero-section";
import PortfolioSection from "@/components/portfolio-section";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <PortfolioSection />
      </main>
      <Footer />
    </>
  );
}
