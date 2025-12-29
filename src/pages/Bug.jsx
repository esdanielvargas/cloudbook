import { useState, useEffect } from "react";
import supabase from "../utils/supabase"; // Sin llaves

function Bug() {
  const [users, setUsers] = useState([]); // Le cambié el nombre a users para ser más claro

  useEffect(() => {
    async function getUsers() {
      // Pedimos datos Y error
      const { data, error } = await supabase.from("users").select("*");

      console.log("--- DEBUG ---");
      console.log("Error de Supabase:", error);
      console.log("Datos recibidos:", data);

      if (error) {
        console.error("Hubo un error cargando usuarios");
      }

      // Si hay datos (aunque sea 1), actualizamos
      if (data && data.length > 0) {
        setUsers(data);
      } else {
        console.warn("La lista de usuarios está vacía o RLS está bloqueando.");
      }
    }

    getUsers();
  }, []);

  return (
    <div>
      <h1>Lista de Usuarios</h1>
      {users.length === 0 ? <p>Cargando o no hay datos...</p> : null}

      <ul>
        {users.map((user) => (
          // Asegúrate de usar una columna real, ej: user.username o user.full_name
          // user.id asumo que es tu clave única
          <li key={user.id}>
            <p>Nombre: {user.display_name || "Sin nombre"}</p>
            <p>Nombre de usuario: @{user.username || "Sin nombre de usuario"}</p>
            <p>Correo electrónico: @{user.email || "Sin correo"}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Bug;
