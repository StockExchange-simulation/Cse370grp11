import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
declare global {
  interface Window {
    google: any;
  }
}

function GoogleLogin() {

  const navigate = useNavigate();
  useEffect(() => {
    if (!window.google) {
      console.error("Google Identity Services has not loaded");
      return;
    }

    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: handleGoogleResponse,
    });

    window.google.accounts.id.renderButton(
      document.getElementById("google-login")!,
      {
        theme: "outline",
        size: "large",
        text: "signin_with",
        shape: "rectangular",
      }
    );
  }, []);

  async function handleGoogleResponse(response: any) {
    console.log("Google response:", response);

    const res = await fetch("http://127.0.0.1:8000/api/auth/google", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            credential: response.credential,
        }),
    });

    const data = await res.json();

    console.log("Backend response:", data);

    if (res.ok) {
      navigate("/dashboard");
    }
  }

  return <div id="google-login"></div>;
}

export default GoogleLogin;