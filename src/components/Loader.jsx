export default function Loader() {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="flex flex-col items-center">
        <img
          src="/logo.svg"
          alt="Isotipo de CloudBook"
          title="Isotipo de CloudBook"
          className="z-5 object-cover object-center select-none pointer-events-none"
          loading="eager"
          width={140}
          height={140}
        />
        <div className="font-bold text-2xl font-sans select-none pointer-events-none">
          CloudBook
        </div>
      </div>
    </div>
  );
}
