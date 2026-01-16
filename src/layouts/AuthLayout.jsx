import { Link, Outlet } from "react-router-dom";
import { useThemeColor } from "../context";

export default function AuthLayout() {
  const { txtClass } = useThemeColor();
  const name = "CloudBook";
  const year = new Date().getFullYear();

  const policies = [
    {
      title: "Política de Privacidad",
      path: "/polices/privacy",
    },
    {
      title: "Términos y Condiciones",
      path: "/polices/terms",
    },
  ];

  return (
    <div className="w-full h-screen flex relative bg-neutral-50 dark:bg-neutral-950">
      {/* Imagen de fondo */}
      <div className="w-full absolute md:static z-0 flex flex-col md:m-6 !mr-0">
        <div className="size-full relative overflow-hidden md:rounded-2xl border border-neutral-800 flex items-center justify-end">
          <img
            src="/images/dce2e602-8736-4a03-9ae4-7f9256c60f93.webp"
            width={916.5}
            height={869}
            alt=""
            title=""
            loading="eager"
            className="size-full min-h-[99.8vh] object-cover object-centermd:object-[-400px] lg:object-[-500px] xl:object-[-200px] select-none pointer-events-none transform scale-x-[-1] transition-all duration-300 ease-out blur-3xl md:blur-none opacity-50 md:opacity-100"
          />
        </div>
      </div>

      {/* Contenido */}
      <div className="w-full relative z-10 flex flex-col justify-between m-4 md:m-6">
        {/* Header */}
        <header className="w-full flex items-start justify-between">
          <h1 className="sr-only">Bienvenidos a {name}</h1>
          <h2 className="font-black text-2xl font-sans">{name}</h2>
          <div className="flex items-center gap-2">
          </div>
        </header>

        {/* Main (forms) */}
        <main className="w-full flex-1 flex flex-col items-center justify-center py-6">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="w-full flex flex-col md:flex-row items-center md:items-end justify-between mt-6 mb-12 md:mb-0 text-xs font-sans">
          <div className="flex items-center justify-start">
            &copy; {year} {name}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {policies.map((link, index) => (
              <span key={index} className={`font-normal text-xs font-sans ${txtClass}`}>
                <Link
                  to={link.path}
                  className="hover:underline active:underline"
                >
                  {link.title}
                </Link>
                {index < policies.length - 1 && <span>,</span>}
              </span>
            ))}
          </div>
        </footer>
      </div>
    </div>
  );
}