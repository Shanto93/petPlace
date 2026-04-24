import HeroSection from "@/components/home/HeroSection";
import Newsletter from "@/components/home/Newsletter";
import ShopByPet from "@/components/home/ShopByPet";
import Testimonials from "@/components/home/Testimonials";
import TrendingTreats from "@/components/home/TrendingTreats";

export default function LandingPage() {
  return (
    <div className="space-y-24 pb-12 overflow-hidden">
      <HeroSection />
      <ShopByPet />
      <TrendingTreats />
      <Testimonials />
      <Newsletter />
    </div>
  );
}
