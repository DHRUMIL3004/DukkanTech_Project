// import "./Login.css";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { jwtDecode } from "jwt-decode";
import { Link } from "react-router-dom";

import { Eye, EyeOff } from "lucide-react";
import Password from "../../Components/PasswordField/Password";

function Login() {
  const { t, i18n } = useTranslation("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const raw = await response.text();
      let data;
      try {
        data = raw ? JSON.parse(raw) : {};
      } catch {
        data = raw;
      }

      console.log("RAW RESPONSE:", data);
      if (!response.ok) {
        if (typeof data === "string") {
          alert(data || "Login failed");
        } else {
          alert(data?.message || "Login failed");
        }
        return;
      }

      console.log("Login Success", data);

      const decoded = jwtDecode(data.token);

      console.log("Decoded JWT:", decoded);

      //store jwt
      const token = data.token;
      localStorage.setItem("token", token);
      localStorage.setItem("role", decoded.role);

      console.log(token);

      // redirect user based on role
      if (decoded.role === "ADMIN") {
        window.location.href = "/dashboard";
      } else {
        window.location.href = "/billing";
      }
    } catch (err) {
      console.log("Login error : ", err);
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
                    <p className="text pt-3">{t("signIn")}</p>
                  </div>

                  <form onSubmit={handleLogin}>
                    <div className="mb-3">
                      <input
                        type="email"
                        className="form-control form-control-lg"
                        placeholder={t("email")}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>

                    <div className="mb-3">
                      <Password
                        onchange={(e) => setPassword(e.target.value)}
                        className={"form-control form-control-lg"}
                        placeholder={t("password")}
                      />
                    </div>

                    <div className="d-grid mb-3">
                      <button className="btn login_btn btn-lg">
                        {t("login")}
                      </button>
                    </div>
                    <div className="d-flex justify-content-end mb-3">
                      <Link
                        to="/forgot-password"
                        className="small text-primary"
                      >
                        Forgot Password?
                      </Link>
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
