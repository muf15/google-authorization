import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get("/auth/me");
        if (response.data.success) {
          setUser(response.data.user);
        } else {
          navigate("/login");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        navigate("/login");
      }
    };

    fetchUser();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      // Add a logout API call here that clears the cookie
      await api.post("/auth/logout");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <div className="flex flex-col items-center gap-4">
                  <img
                    src={user.image}
                    alt={user.name}
                    className="w-24 h-24 rounded-full border-2 border-gray-300"
                  />
                  <h1 className="text-2xl font-bold text-gray-900">
                    {user.name}
                  </h1>
                  <p className="text-gray-600">{user.email}</p>
                  <button
                    onClick={handleLogout}
                    className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
