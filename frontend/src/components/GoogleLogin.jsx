import { useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { googleAuth } from "../api";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

export default function GoogleLogin() {
  const navigate = useNavigate();
  const { refreshUserData } = useAuth();
  const [error, setError] = useState(null);

  const responseGoogle = async (authResult) => {
    try {
      if (authResult["code"]) {
        const result = await googleAuth(authResult["code"]);

        if (result?.data?.success) {
          // Refresh user data in context
          await refreshUserData();
          navigate("/dashboard");
        }
      }
    } catch (error) {
      console.error("Google Auth Error:", {
        message: error.message,
        response: error?.response?.data,
        status: error?.response?.status,
      });
      setError("Failed to login with Google. Please try again.");
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: () => setError("Google login failed. Please try again."),
    flow: "auth-code",
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">{error}</h3>
              </div>
            </div>
          </div>
        )}
        <div>
          <button
            onClick={() => {
              setError(null);
              googleLogin();
            }}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Login with Google
          </button>
        </div>
      </div>
    </div>
  );
}
