// import "./Login.css";

import { useEffect } from "react";
import { useTranslation } from "react-i18next";

function Login() {

  const {t,i18n}=useTranslation("login");
  

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

                  <form>
                    <div className="mb-3">
                      <input
                        type="email"
                        className="form-control form-control-lg"
                        placeholder={t('email')}
                      />
                    </div>

                    <div className="mb-3">
                      <input
                        type="password"
                        className="form-control form-control-lg"
                        placeholder={t('password')}
                      />
                    </div>
                    <div className="mb-3">
                      <select className="form-select form-select-lg">
                        <option value="">{t('selectRole')}</option>
                        <option value="ADMIN">{t('admin')}</option>
                        <option value="EMPLOYEE">{t('employee')}</option>
                      </select>
                    </div>

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
