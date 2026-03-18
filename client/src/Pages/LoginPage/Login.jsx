// import "./Login.css";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {jwtDecode} from "jwt-decode";

function Login() {

  const {t,i18n}=useTranslation("login");
  const [email,setEmail]=useState("");
  const[password,setPassword]=useState("");


  const handleLogin=async(e)=>{
    e.preventDefault();

    if(!email || !password){
      alert("Please fill all fields");
      return;
    }

    try{
      const response=await fetch ("http://localhost:8080/api/auth/login",{
        method:"POST",
        headers:{
          "Content-type":"application/json",
        },
        body:JSON.stringify({email,password}),
      });
      
      if(!response.ok){
        const err=await response.json();
       alert(err.message || "Login failed");
       return;
      }

      const data=await response.json();
      console.log("Login Success",data);

      const decoded=jwtDecode(data.token);

      console.log("Decoded JWT:", decoded);

      //store jwt
      const token=data.token;
      localStorage.setItem("token",token);
      console.log(token);

      // redirect user based on role
      if (decoded.role === "ADMIN") {
        window.location.href = "/manage-user";
      } else {
        window.location.href = "/employee-dashboard";
      }

    }
    catch(err){
      console.log("Login error : ",err);
      alert("Something went wrong");
    }
  };

  return (
    <div>
      <section className="vh-100 login_form d-flex align-items-center">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6 col-lg-5">
              <div className="card login_card">
                <div className="card-body p-5">
                  <div className="text-center mb-2">
                    <img src="/Logo.png" alt="logo" className="logo" />
                     <h4 className="mt-4">{t("welcome")}</h4>
                    <p className="text pt-3">{t('signIn')}</p>
                  </div>

                  <form onSubmit={handleLogin} >
                    <div className="mb-3">
                      <input
                        type="email"
                        className="form-control form-control-lg"
                        placeholder={t('email')}
                        onChange={(e)=>setEmail(e.target.value)}
                      />
                    </div>

                    <div className="mb-3">
                      <input
                        type="password"
                        className="form-control form-control-lg"
                        placeholder={t('password')}
                         onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                    {/* <div className="mb-3">
                      <select className="form-select form-select-lg" onChange={(e) => setRole(e.target.value)}>
                        <option value="">{t('selectRole')}</option>
                        <option value="ADMIN">{t('admin')}</option>
                        <option value="EMPLOYEE">{t('employee')}</option>
                      </select>
                    </div> */}

                    <div className="d-grid mb-3">
                      <button className="btn login_btn btn-lg">{t('login')}</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Login;

// style={{backgroundColor: '#9A616D'}}
