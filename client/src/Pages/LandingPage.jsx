import Features from "../Components/Features/Features";
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
    
      <Footer/>
    </>
  );
};

export default LandingPage;