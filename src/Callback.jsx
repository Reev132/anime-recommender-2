import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Callback() {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    console.log("Callback received token:", token);

    if (token) {
      localStorage.setItem("mal_token", token);
    }

    // Redirect to home after storing token
    navigate("/");
  }, [navigate]);

  return <div>Processing authentication... Redirecting you now.</div>;
}

export default Callback;
