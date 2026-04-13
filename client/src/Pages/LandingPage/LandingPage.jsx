import LandingNavbar from "../../Components/NavBar/LandingNavbar";
import About from "../../Modules/About/About";
import Features from "../../Modules/Features/Features";
import Working from "../../Modules/Features/Working/Working";
import Footer from "../../Components/Footer/Footer";
import Hero from "../../Modules/Hero/Hero";

const LandingPage = () => {
  return (
    <>
      <LandingNavbar />
      <Hero />
      <Features />
      <Working />
      <About />
      <Footer />
    </>
  );
};

export default LandingPage;
