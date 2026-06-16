import { Link, useLocation } from "react-router-dom";

function AdminNavbar() {
  const location = useLocation();

  const navLink = (path) =>
    `transition ${
      location.pathname === path
        ? "text-blue-400"
        : "text-gray-200 hover:text-blue-300"
    }`;

  return (
    <div className="sticky top-0 z-50 backdrop-blur-xl bg-white/10 border-b border-white/20">
      <div className="w-full flex justify-between items-center px-16 py-4">

        {/* LOGO */}
        <Link to="/admin/dashboard" className="flex items-center gap-4">
          <img src="/logo.png" className="h-12" />
          <div>
            <h1 className="text-lg font-semibold">Admin Panel</h1>
            <p className="text-xs text-gray-300">LandChain Registry</p>
          </div>
        </Link>

        {/* NAV */}
        <div className="flex gap-6">
          <Link to="/admin/dashboard" className={navLink("/admin/dashboard")}>
            Dashboard
          </Link>

          <Link to="/admin/approvals" className={navLink("/admin/approvals")}>
            Approvals
          </Link>

          <Link to="/admin/lands" className={navLink("/admin/lands")}>
            All Lands
          </Link>

          <Link to="/admin/profile" className={navLink("/admin/profile")}>
            Profile
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminNavbar;