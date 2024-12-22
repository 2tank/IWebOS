  import React from "react";
  import { useAuth0 } from "@auth0/auth0-react";

  const LoginButton = () => {
    const { loginWithRedirect } = useAuth0();

    return (
      <button
        onClick={() => loginWithRedirect()}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Iniciar Sesión
      </button>
    );
  };

  export default LoginButton;