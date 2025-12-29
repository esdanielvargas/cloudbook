import React, { useState, useContext } from 'react';
import { ModalContext } from './ModalContext';

// Importa aquí tu componente visual del Modal (el que tiene el diseño)
// import LinksModalComponent from './components/LinksModalComponent'; 

export const ModalProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalData, setModalData] = useState(null); // Aquí guardamos los enlaces (url, icono, etc.)

  // Función para abrir el modal recibiendo los enlaces opcionalmente
  const openModal = (data = null) => {
    setModalData(data);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    // Opcional: limpiar la data al cerrar para evitar "flickers" la próxima vez
    setTimeout(() => setModalData(null), 300); 
  };

  return (
    <ModalContext.Provider value={{ isOpen, openModal, closeModal, modalData }}>
      {children}
      
      {/* Aquí renderizamos el Modal condicionalmente o lo dejamos siempre montado 
         y controlamos su visibilidad con CSS/Clases para animaciones.
         
         Ejemplo conceptual de cómo se vería tu componente visual aquí:
      */}
      
      {/* <LinksModalComponent 
         isOpen={isOpen} 
         onClose={closeModal} 
         links={modalData} 
      /> 
      */}

    </ModalContext.Provider>
  );
};

// --- Custom Hook ---
// Esto es para no tener que importar useContext y ModalContext en cada archivo.
// Solo importas: useLinksModal()
export const useLinksModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useLinksModal debe ser usado dentro de un ModalProvider');
  }
  return context;
};