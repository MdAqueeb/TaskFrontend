import { NavLink } from "react-router-dom";

export default function NavBar() {
  const baseClass =
    "flex-1 text-center py-4 font-medium relative cursor-pointer";

  const activeClass = "text-blue-700 after:block after:absolute after:bottom-0 after:left-0 after:w-full after:h-1 after:bg-blue-600 after:rounded";
  const inactiveClass = "text-gray-700 hover:text-blue-600";

  return (
    <nav className="bg-blue-100 h-16 flex shadow-md w-full">
      <NavLink
        to="/"
        className={({ isActive }) =>
          `${baseClass} ${isActive ? activeClass : inactiveClass}`
        }
      >
        Friends
      </NavLink>
      <NavLink
        to="/history"
        className={({ isActive }) =>
          `${baseClass} ${isActive ? activeClass : inactiveClass}`
        }
      >
        History
      </NavLink>
      <NavLink
        to="/leaderboard"
        className={({ isActive }) =>
          `${baseClass} ${isActive ? activeClass : inactiveClass}`
        }
      >
        Leaderboard
      </NavLink>
    </nav>
  );
}
