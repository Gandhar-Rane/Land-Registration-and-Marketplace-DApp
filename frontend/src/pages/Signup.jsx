import { useState } from "react";
import { Link } from "react-router-dom";

function Signup() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    country: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    let newErrors = {};

    // Required fields
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    if (!form.phone.trim()) newErrors.phone = "Phone is required";
    if (!form.country.trim()) newErrors.country = "Country is required";
    if (!form.password.trim()) newErrors.password = "Password is required";

    // Phone validation
    if (form.phone && !/^[0-9]+$/.test(form.phone)) {
      newErrors.phone = "Only numbers allowed";
    }

    // Password validation
    if (
      form.password &&
      !/^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(form.password)
    ) {
      newErrors.password =
        "Min 8 chars, 1 uppercase, 1 number & 1 special char required";
    }

    // Confirm password
    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    return newErrors;
  };

  const handleSubmit = async () => {
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        setLoading(true);

        const res = await fetch("http://127.0.0.1:5000/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            password: form.password,
            phone: form.phone,
            country: form.country,
          }),
        });

        const data = await res.json();

        if (res.ok) {
          console.log("Form submitted successfully ✅");

          // redirect to login
          window.location.href = "/login";
        } else {
          alert(data.error || "Signup failed");
        }
      } catch (err) {
        alert("Server error");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl p-8 rounded-2xl shadow-lg">

        <h2 className="text-2xl text-center mb-6">Signup</h2>

        {/* NAME */}
        <input
          className="w-full mb-1 p-3 rounded bg-white/20"
          placeholder="Full Name"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        {errors.name && (
          <p className="text-red-400 text-sm mb-2">{errors.name}</p>
        )}

        {/* PHONE */}
        <input
          className="w-full mb-1 p-3 rounded bg-white/20"
          placeholder="Phone Number"
          value={form.phone}
          onChange={(e) => {
            const value = e.target.value;
            if (/^\d*$/.test(value)) {
              setForm({ ...form, phone: value });
            }
          }}
        />
        {errors.phone && (
          <p className="text-red-400 text-sm mb-2">{errors.phone}</p>
        )}

        {/* EMAIL */}
        <input
          className="w-full mb-1 p-3 rounded bg-white/20"
          placeholder="Email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        {errors.email && (
          <p className="text-red-400 text-sm mb-2">{errors.email}</p>
        )}

        {/* PASSWORD */}
        <div className="relative mb-1">
          <input
            type={showPassword ? "text" : "password"}
            className="w-full p-3 rounded bg-white/20"
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
        {errors.password && (
          <p className="text-red-400 text-sm mb-2">{errors.password}</p>
        )}

        {/* CONFIRM PASSWORD */}
        <input
          type="password"
          className="w-full mb-1 p-3 rounded bg-white/20"
          placeholder="Confirm Password"
          onChange={(e) =>
            setForm({ ...form, confirmPassword: e.target.value })
          }
        />
        {errors.confirmPassword && (
          <p className="text-red-400 text-sm mb-2">
            {errors.confirmPassword}
          </p>
        )}

        {/* COUNTRY */}
        <input
          className="w-full mb-2 p-3 rounded bg-white/20"
          placeholder="Country"
          onChange={(e) => setForm({ ...form, country: e.target.value })}
        />
        {errors.country && (
          <p className="text-red-400 text-sm mb-2">{errors.country}</p>
        )}

        {/* BUTTON */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl hover:scale-[1.02] transition disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Account"}
        </button>

        <p className="text-sm text-center mt-4 text-gray-300">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-400 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;