import Navbar from "./Navbar";
import Hero from "./Hero";
import BentoSection from "./BentoSection";
import Experience from "./Experience";
import Projects from "./Projects";
import Certificates from "./Certificates";
import Documentation from "./Documentation";
import Footer from "./Footer";

export default function Portfolio() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <BentoSection />
        <Experience />
        <Projects />
        <Certificates />
        <Documentation />
      </main>
      <Footer />
    </>
  );
}
