import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("user"));
  const role = localStorage.getItem("role");

  // 🔥 Decide where logo should go
  const logoRedirect = user
    ? role === "admin"
      ? "/admin/dashboard"
      : "/dashboard"
    : "/";

  // ✅ Public pages
  const isPublicPage =
    location.pathname === "/" ||
    location.pathname === "/login" ||
    location.pathname === "/signup";

  const navLinkStyle = (path) =>
    `transition ${
      location.pathname === path
        ? "text-blue-400"
        : "text-gray-200 hover:text-blue-300"
    }`;

  return (
    <div className="sticky top-0 z-50 backdrop-blur-xl bg-white/10 border-b border-white/20">
      <div className="w-full flex justify-between items-center px-16 lg:px-20 py-4">

        {/* 🔥 LOGO (SMART REDIRECT) */}
        <Link to={logoRedirect} className="flex items-center gap-4 hover:opacity-80 transition">
          <img
            src="/logo.png"
            className="h-14 w-auto object-contain"
            alt="LCR Logo"
          />
          <div>
            <h1 className="text-lg font-semibold text-white">LCR</h1>
            <p className="text-xs text-gray-300">LandChain Registry</p>
          </div>
        </Link>

        {/* 🔥 NAVIGATION */}
        <div className="flex items-center gap-6">

          {isPublicPage ? (
            <>
              <Link
                to="/login"
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition"
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition shadow-md"
              >
                Signup
              </Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" className={navLinkStyle("/dashboard")}>
                Dashboard
              </Link>

              <Link to="/my-lands" className={navLinkStyle("/my-lands")}>
                My Lands
              </Link>

              <Link to="/marketplace" className={navLinkStyle("/marketplace")}>
                Marketplace
              </Link>

              <Link
                to="/profile"
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition"
              >
                Profile
              </Link>
            </>
          )}

        </div>
      </div>
    </div>
  );
}

export default Navbar;