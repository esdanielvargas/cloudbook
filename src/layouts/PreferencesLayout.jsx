import { Outlet } from "react-router-dom";

export default function PreferencesLayout() {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="size-full max-w-150 min-h-screen px-4 md:px-0 flex flex-col mb-20 md:mb-auto relative">
        <Outlet />
      </div>
    </div>
  );
}
