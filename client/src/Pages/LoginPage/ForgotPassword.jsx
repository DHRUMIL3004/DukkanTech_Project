import {
  sendOtp,
  verifyOtp,
  resetPassword,
} from "../../Service/ForgetPassword";
import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { getBackendErrorMessage } from "../../Service/errorMessage";
import Password from "../../Components/PasswordField/Password";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [otpLoading, setOtpLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const navigate = useNavigate();

  //  Send OTP
  const handleSendOtp = async (e) => {
    
    e.preventDefault();

    if (!email) {
      toast.error("Please enter email");
      return;
    }

    try {
      setOtpLoading(true);
      await sendOtp(email);
      toast.success("OTP sent to your email!");
      setOtpLoading(false);
      setStep(2);
    } catch (error) {
      console.error(error);
      toast.error(getBackendErrorMessage(error, "Failed to send OTP"));
      setOtpLoading(false);
    }
    finally {
      setOtpLoading(false);
    }
  };

  //  Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (!otp) {
      toast.error("Please enter OTP");
      return;
    }

    try {
      setVerifyLoading(true);
      const response = await verifyOtp(email, otp);

      if (response === "otp is varified") {
        toast.success("OTP verified!");
        setStep(3);
      } else {
        toast.error("Invalid OTP");
      }
    } catch (error) {
      console.error(error);
      toast.error(getBackendErrorMessage(error, "Something went wrong"));
    } finally {
      setVerifyLoading(false);
    }
  };

  //  Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      toast.error("Enter all fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      setResetLoading(true);
      await resetPassword(email, password);
      toast.success("Password reset successfully!");

      setEmail("");
      setOtp("");
      setPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      console.error(error);
      toast.error(getBackendErrorMessage(error, "Failed to reset password"));
    } finally {
      setResetLoading(false);
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
                  <div className="text-center mb-2 pb-3">
                    <img src="/Logo.png" alt="logo" className="logo" />
                    <h5 className="mt-4">Reset Password</h5>
                  </div>

                  <p className="text-center text-muted">
                    {step === 1 && "Enter your email to receive OTP"}
                    {step === 2 && "Check your email for OTP"}
                    {step === 3 && "Set your new password"}
                  </p>
                  <form>
                    {/* STEP 1 */}
                    {step === 1 && (
                      <>
                        <div className="mb-3">
                          <input
                            type="email"
                            className="form-control form-control-lg"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </div>

                        <div className="d-grid">
                          <button
                            onClick={handleSendOtp}
                            className="btn login_btn btn-lg"
                            disabled={otpLoading}
                          >
                            {otpLoading ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Sending...
                              </>
                            ) : (
                              "Send OTP"
                            )}
                          </button>
                        </div>
                      </>
                    )}

                    {/* STEP 2 */}
                    {step === 2 && (
                      <>
                        <div className="mb-3 text-center">
                          <small>Enter OTP sent to {email}</small>
                        </div>

                        <div className="mb-3">
                          <input
                            type="number"
                            className="form-control form-control-lg text-center"
                            placeholder="Enter OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                          />
                        </div>

                        <div className="d-grid">
                          <button
                            onClick={handleVerifyOtp}
                            className="btn login_btn btn-lg"
                            disabled={verifyLoading}
                          >
                            {verifyLoading ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Verifying...
                              </>
                            ) : (
                              "Verify OTP"
                            )}
                          </button>
                        </div>
                      </>
                    )}

                    {/* STEP 3 */}
                    {step === 3 && (
                      <>
                        <div className="mb-3">
                          {/* new password */}
                          <Password
                            onchange={(e) => setPassword(e.target.value)}
                            className={"form-control form-control-lg mb-3"}
                            placeholder={"New Password"}
                            value={password}
                          />

                          {/* confirm password */}
                          <Password
                            onchange={(e) => setConfirmPassword(e.target.value)}
                            className={"form-control form-control-lg "}
                            placeholder={"Confirm Password"}
                            value={confirmPassword}
                          />
                        </div>

                        <div className="d-grid">
                          <button
                            onClick={handleResetPassword}
                            className="btn login_btn btn-lg"
                            disabled={resetLoading}
                          >
                            {resetLoading ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Setting Password...
                              </>
                            ) : (
                              "Reset Password"
                            )}
                          </button>
                        </div>
                      </>
                    )}
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

export default ForgotPassword;
