import { Outlet } from "react-router-dom";
import EmployeeNavbar from "../NavBar/EmployeeNavbar";


function EmployeeLayout() {
    return (
        <>
        <EmployeeNavbar/>
        <Outlet/>
        </>
      );
}

export default EmployeeLayout;