import About from "./About";
import Banner from "./Banner";
import Footer from "./Footer";
import Services from "./Services";
import Testimonials from "./Testimonials";
import FeaturedDoctorsSection from "@/components/FeaturedDoctorsSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import SpecialtiesSection from "@/components/SpecialtiesSection";
import NewsSection from "@/components/NewsSection";

const LandingPage = () => {
  return (
    <div className="flex flex-col">
      <Banner />
      <About />
      <SpecialtiesSection />
      <FeaturedDoctorsSection />
      <Services />
      <HowItWorksSection />
      <Testimonials />
      <NewsSection />
      <Footer />
    </div>
  );
};
export default LandingPage;
