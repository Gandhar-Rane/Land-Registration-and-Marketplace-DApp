import { useState } from "react";
import { Link } from "react-router-dom";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        // 🔐 Store token ONLY if exists (user login)
        if (data.token) {
          localStorage.setItem("token", data.token);
        }

        // 🔥 Store user safely
        localStorage.setItem(
          "user",
          JSON.stringify({
            user_id: data.user_id || null, // ✅ safe for admin
            email: form.email,
            role: data.role,
          })
        );

        // 🔥 Store role separately (used in routes)
        localStorage.setItem("role", data.role);

        // 🚀 Redirect based on role
        if (data.role === "admin") {
          window.location.href = "/admin/dashboard";
        } else {
          window.location.href = "/dashboard";
        }

      } else {
        alert(data.error || "Login failed");
      }

    } catch (err) {
      alert("Server error");
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl p-8 rounded-2xl shadow-lg">

        <h2 className="text-2xl text-center mb-6">Login</h2>

        {/* EMAIL */}
        <input
          className="w-full mb-4 p-3 rounded bg-white/20 outline-none"
          placeholder="Email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        {/* PASSWORD */}
        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            className="w-full p-3 rounded bg-white/20 outline-none"
            placeholder="Password"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-sm text-gray-300"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        {/* LOGIN BUTTON */}
        <button
          onClick={handleLogin}
          className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl hover:scale-[1.02] transition"
        >
          Login
        </button>

        {/* SIGNUP LINK */}
        <p className="text-sm text-center mt-4 text-gray-300">
          New here?{" "}
          <Link to="/signup" className="text-blue-400 hover:underline">
            Create account
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Login;