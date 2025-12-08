import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem("authUser");
    if (raw) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <Routes>
      <Route
        path="/login"
        element={
          isLoggedIn ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Login onSuccess={() => setIsLoggedIn(true)} />
          )
        }
      />

      <Route
        path="/dashboard"
        element={
          isLoggedIn ? (
            <Dashboard onLogout={() => setIsLoggedIn(false)} />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route
        path="/users"
        element={isLoggedIn ? <Users /> : <Navigate to="/login" replace />}
      />
    </Routes>
  );
}
