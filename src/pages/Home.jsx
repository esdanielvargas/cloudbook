import { Outlet } from "react-router-dom";
import { PageBox, PageHeaderHome} from "../components";

export default function Home() {
  return (
    <>
      <PageHeaderHome title="Inicio" />
      <PageBox>
        <Outlet />
      </PageBox>
    </>
  );
}
