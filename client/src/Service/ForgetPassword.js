import axios from "axios";

const url = "http://localhost:8080/api/otp";

export const sendOtp = async (email) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.post(`${url}/send?email=${email}`);

    console.log("OTP sent successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw error;
  }
};

export const verifyOtp = async (email, otp) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.post(
      `${url}/verify?email=${email}&otp=${otp}`,
    );

    return response.data;
    console.log("OTP verified successfully:", response.data);
  } catch (error) {
    console.error("Error verifying OTP:", error);
    throw error;
  }
};

export const resetPassword = async (email, newPassword) => {
  const token = localStorage.getItem("token");

  try {
    const response = await axios.post(
      `${url}/reset-password?email=${email}&newPassword=${newPassword}`,
    );

    console.log("Password reset successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error resetting password:", error);
    throw error;
  }
};
