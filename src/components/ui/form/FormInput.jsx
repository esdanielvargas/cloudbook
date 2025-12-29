export const FormInput = ({
  label,
  icon,
  type,
  placeholder,
  required,
  ...rest
}) => {
  return (
    <div className="w-full flex flex-col gap-1.5">
      <div className="w-full text-left font-semibold text-sm font-sans select-none">
        {label || "Etiqueta del campo"}
        {required ? <span className="ml-0.5 text-rose-600">*</span> : null}
      </div>
      <div className="w-full pl-3 flex items-center relative gap-2.5 rounded-md bg-neutral-50 dark:bg-neutral-950 md:border border-neutral-200 dark:border-neutral-800 overflow-hidden">
        {icon ? (
          <div className="min-w-5 h-full flex items-center justify-center">
            {icon}
          </div>
        ) : null}
        <input
          type={type || "text"}
          className="w-full h-10 font-normal text-xs md:text-sm font-sans pr-3.5 focus:outline-none appearance-none"
          placeholder={placeholder || "Escribe aquí..."}
          required={required ? true : false}
          autoComplete="current-password"
          {...rest}
        />
      </div>
    </div>
  );
};
