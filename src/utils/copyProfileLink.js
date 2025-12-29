export const copyProfileLink = (username) => {
  const link = `${window.location.origin}/${username}`;
  navigator.clipboard
    .writeText(link)
    .then(() => {
      alert("Enlace copiado al portapapeles");
    })
    .catch((error) => {
      console.error("Error al copiar el enlace: ", error);
      alert("Hubo un error al copiar el enlace. Inténtalo de nuevo.");
    });
};
