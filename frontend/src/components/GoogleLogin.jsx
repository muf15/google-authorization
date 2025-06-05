import React from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { googleAuth } from "../api";

export default function GoogleLogin() {
  const navigate = useNavigate();

  const responseGoogle = async (authResult) => {
    try {
      if (authResult["code"]) {
        const result = await googleAuth(authResult["code"]);
        // console.log("Raw API Response:", result);

        if (result?.data?.success) {
          // Simply navigate to dashboard after successful login
          navigate("/dashboard");
        }
      }
    } catch (error) {
      console.error("Google Auth Error:", {
        message: error.message,
        response: error?.response?.data,
        status: error?.response?.status,
      });
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: responseGoogle,
    flow: "auth-code",
  });

  return (
    <div className="App">
      <button onClick={googleLogin}>Login with Google</button>
    </div>
  );
}
