import FAQ from "./landing/components/FAQ";
import Features from "./landing/components/Features";
import Footer from "./landing/components/Footer";
import Hero from "./landing/components/Hero";
import HowItWorks from "./landing/components/HowItWorks,";
import Navbar from "./landing/components/Navbar";
import Pricing from "./landing/components/Pricing";
import Testimonials from "./landing/components/Testimonials";
import TrustedBy from "./landing/components/TrustedBy";

export default function Home() {
  return (
   <>
   <Navbar />
   <Hero />
   <TrustedBy />
   <Features />
   <HowItWorks />
   <Pricing />
   <Testimonials />
   <FAQ />
   <Footer />
   
    </>
  );
}
