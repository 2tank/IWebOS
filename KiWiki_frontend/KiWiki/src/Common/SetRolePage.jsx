import axios from 'axios';
import { useEffect, useState } from 'react';
import Navbar from './NavBar';
import { useNavigate } from 'react-router-dom';
import { useSession } from './SessionProvider'; // Usamos el contexto

function SetRolePage() {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('REDACTOR');
  const [statusMessage, setStatusMessage] = useState('');

  const navigate = useNavigate();
  const { isLoggedIn, setRol } = useSession();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn]);

  const handleSubmit = async () => {
    const result = await setRol(email, role);
    console.log(result);
    if (result) {
      setStatusMessage('El rol ha sido actualizado correctamente.');
    } else {
      setStatusMessage('Error: No se pudo actualizar el rol.');
    }
  };

  return (
    <>
      <section className="w-screen min-h-screen bg-gray-100 relative">
        <Navbar />

        <div className="flex justify-center items-center h-full py-10">
          <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-lg">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4 text-center">Asignar Rol</h2>

            <div className="flex gap-4 mb-4">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
              />
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-1/3 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
              >
                <option value="REDACTOR">Redactor</option>
                <option value="EDITOR">Editor</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>

            <button
              onClick={handleSubmit}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
            >
              Asignar Rol
            </button>

            {statusMessage && (
              <p className={`mt-4 text-center ${statusMessage.includes('Error') ? 'text-red-500' : 'text-green-500'}`}>
                {statusMessage}
              </p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

export default SetRolePage;
