import { Main, Menu, MenuMobile } from "../components";
import MediaModalProvider from "../context/MediaModalProvider";
import { ModalProvider } from "../context/ModalProvider";
import { LinksModal } from "../components/LinksModal";

export default function AppLayout() {
  return (
    <div className="w-full h-screen">
      <MediaModalProvider>
        <ModalProvider>
          <Menu />
          <Main />
          <MenuMobile />
          <LinksModal />
        </ModalProvider>
      </MediaModalProvider>
    </div>
  );
}
