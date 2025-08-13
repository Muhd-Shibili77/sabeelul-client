import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const useInactivityLogout = () => {
  const navigate = useNavigate();
  const timeoutRef = useRef(null);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.setItem("logoutEvent", Date.now()); // For multi-tab logout
    fetch("/auth/admin/logout", {
      method: "POST",
      credentials: "include",
    }).finally(() => {
      navigate("/");
    });
  };

  const resetTimer = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(logout, 15 * 60 * 1000); // 15 minutes
  };

  useEffect(() => {
    const events = ["mousemove", "keydown", "click", "scroll"];
    events.forEach((e) => window.addEventListener(e, resetTimer));

    // Multi-tab logout listener
    window.addEventListener("storage", (event) => {
      if (event.key === "logoutEvent") {
        navigate("/");
      }
    });

    resetTimer(); // start on mount

    return () => {
      events.forEach((e) => window.removeEventListener(e, resetTimer));
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);
};

export default useInactivityLogout;
