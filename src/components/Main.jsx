import { Outlet } from "react-router-dom";

export default function Main() {
  return (
    <main className="w-full h-screen flex flex-col dark:bg-neutral-950">
      <div className="w-full md:w-[calc(100%_-_80px_-_32px)] flex justify-center gap-4 md:ml-[calc(80px_+_32px)]">
        <div className="size-full max-w-150 min-h-screen px-2 md:px-4 flex flex-col relative">
          <Outlet />
        </div>
      </div>
    </main>
  );
}
