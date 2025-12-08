import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Login({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Halaman Masuk";
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (email === "admin@example.com" && password === "admin123") {
      localStorage.setItem("authUser", JSON.stringify({ email }));
      console.log("SAVED:", localStorage.getItem("authUser"));

      onSuccess();
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8 border border-gray-100">
        {/* Title Section */}
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">
          Aplikasi Dashboard
        </h1>

        {/* Login Form */}
        <form className="space-y-5" onSubmit={handleLogin}>
          <div>
            <label className="text-gray-700 font-medium text-sm">Email</label>
            <input
              type="email"
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
            />
          </div>

          <div>
            <label className="text-gray-700 font-medium text-sm">
              Password
            </label>
            <input
              type="password"
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <p className="text-sm text-red-500 bg-red-50 p-2 rounded text-center">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="
    w-full bg-blue-600 text-white p-3 rounded-lg font-semibold 
    border border-transparent
    hover:bg-white hover:text-blue-600 hover:border-blue-600
    transition shadow-sm active:scale-[0.98]
  "
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
