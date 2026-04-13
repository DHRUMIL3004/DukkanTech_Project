
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import "./Password.css";


function Password({onchange, className, placeholder="Enter password"}) {

    const [showPassword, setShowPassword] = useState(false);

   const togglePasswordVisibility = () => {
  
    setShowPassword((prevState) => !prevState);
 
};


    return ( 
        <div className="password-toggle">
               
               <input type={showPassword ? "text" : "password"} 
               className={className}
                onChange={onchange}
                placeholder={placeholder}
               />


            <button type="button" onClick={togglePasswordVisibility} className="password-toggle-button">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>

        </div>

  
     );
}

export default Password;