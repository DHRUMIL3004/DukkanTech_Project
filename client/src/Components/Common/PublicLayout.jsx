import { Outlet } from "react-router-dom";
import LandingNavbar from "../NavBar/LandingNavbar";


const PublicLayout = () => {
  return (
    <>
      <LandingNavbar />
      <Outlet />
    </>
  );
};

export default PublicLayout;