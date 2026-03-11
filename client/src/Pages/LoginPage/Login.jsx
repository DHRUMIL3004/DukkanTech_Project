// import "./Login.css";

function Login() {
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
                    <h4 className="mt-4">Built for Growing Businesses</h4>
                    <p className="text pt-3">Sign into your account</p>
                  </div>

                  <form>
                    <div className="mb-3">
                      <input
                        type="email"
                        className="form-control form-control-lg"
                        placeholder="Email address"
                      />
                    </div>

                    <div className="mb-3">
                      <input
                        type="password"
                        className="form-control form-control-lg"
                        placeholder="Password"
                      />
                    </div>
                    <div className="mb-3">
                      <select className="form-select form-select-lg">
                        <option value="">Select Role</option>
                        <option value="ADMIN">Admin</option>
                        <option value="EMPLOYEE">Employee</option>
                      </select>
                    </div>

                    <div className="d-grid mb-3">
                      <button className="btn login_btn btn-lg">Login</button>
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
