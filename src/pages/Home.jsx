import { Outlet } from "react-router-dom";
import { PageHeaderHome} from "@/components";

export default function Home() {
  return (
    <>
      <PageHeaderHome title="Inicio" />
      <div className="w-full mb-22 md:mb-4 flex flex-col gap-2">
        <Outlet />
      </div>
    </>
  );
}
