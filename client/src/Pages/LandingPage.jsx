import About from "../Components/About/About";
import Features from "../Components/Features/Features";
import Working from "../Components/Features/Working/Working";
import Footer from "../Components/Footer/Footer";
import Hero from "../Components/Hero/Hero";
import LandingNavbar from "../Components/NavBar/LandingNavbar";
import NavBar from "../Components/NavBar/NavBar";



const LandingPage = () => {
  return (
    <>
      <LandingNavbar/>
      <Hero/>
      <Features/>
      <Working/>
      <About/>
      <Footer/>
    </>
  );
};

export default LandingPage;