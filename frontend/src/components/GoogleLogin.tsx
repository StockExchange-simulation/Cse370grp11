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
      console.error(
        "Google Identity Services has not loaded"
      );
      return;
    }

    const buttonContainer =
      document.getElementById("google-login");

    if (!buttonContainer) {
      return;
    }

    window.google.accounts.id.initialize({
      client_id:
        import.meta.env.VITE_GOOGLE_CLIENT_ID,

      callback: handleGoogleResponse,
    });

    window.google.accounts.id.renderButton(
      buttonContainer,
      {
        theme: "outline",
        size: "large",
        text: "signin_with",
        shape: "rectangular",
        width: 400,
      }
    );
  }, []);

  async function handleGoogleResponse(
    response: any
  ) {
    console.log(
      "Google response:",
      response
    );

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/google`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            credential:
              response.credential,
          }),
        }
      );

      const data = await res.json();

      console.log(
        "Backend response:",
        data
      );

      if (!res.ok) {
        console.error(data);
        return;
      }

      navigate("/dashboard");
    } catch (error) {
      console.error(
        "Google login failed:",
        error
      );
    }
  }

  return (
    <div
      id="google-login"
      className="flex justify-center"
    />
  );
}

export default GoogleLogin;