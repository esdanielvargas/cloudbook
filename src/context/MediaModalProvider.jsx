import { useState } from "react";
import { MediaModalContext } from "./MediaModalContext";
import MediaModal from "../components/MediaModal";

export default function MediaModalProvider({ children }) {
  const [modalData, setModalData] = useState(null);

  const openModal = (post) => setModalData(post);
  const closeModal = () => setModalData(null);

  return (
    <MediaModalContext.Provider value={{ modalData, openModal, closeModal }}>
      {children}
      <MediaModal />
    </MediaModalContext.Provider>
  );
}
