import { Link } from "react-router-dom";
import { Button } from "../buttons";

export default function FormField(props) {
  const {
    id,
    name,
    type = "text",
    label = "",
    caption = "",
    text = "",
    Icon,
    placeholder,
    value,
    textarea,
    select,
    options = [],
    range,
    path = "",
    error = "",
    info = "",
    image,
    src = "",
    banner,
    avatar,
    min = 0,
    max = 100,
    step = 1,
    readOnly,
    className = "",
    boolean,
    onClick,
    onChange,
    required,
    uploading,
    onImageChange,
    onImageRemove,
    ...rest
  } = props;

  return (
    <div
      className={`w-full flex ${
        boolean ? "flex-row items-start" : "flex-col"
      } gap-1.5`}
    >
      {/* Label and Caption */}
      {(label || caption) && (
        <div className="w-full flex flex-col gap-1.5">
          {label && (
            <div className="w-full flex items-center justify-start">
              <label
                htmlFor={id}
                className="text-md font-medium text-neutral-700 dark:text-neutral-300"
              >
                {label}
              </label>
              {required ? <span className="ml-0.5 text-rose-600 cursor-pointer" title="Este campo es obligatorio.">*</span> : null}
            </div>
          )}

          {caption && (
            <span className="text-xs text-neutral-400">{caption}</span>
          )}
        </div>
      )}

      {/* Caja de solo lectura para mostrar resultados */}
      {readOnly && (
        <>
          {path ? (
            <Link
              to={path}
              className="w-full h-10 px-3.5 py-2 flex items-center rounded-lg bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-sm text-neutral-950 dark:text-neutral-50 break-all overflow-hidden cursor-text"
            >
              {Icon && (
                <div className="min-w-5 h-full flex items-center justify-center">
                  <Icon size={20} className="size-5" strokeWidth={1.5} />
                </div>
              )}
              {value || (
                <span className="w-full text-sm text-neutral-400">
                  {placeholder}
                </span>
              )}
            </Link>
          ) : (
            <div className="w-full h-10 px-3.5 py-2 flex items-center gap-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-sm text-neutral-950 dark:text-neutral-50 break-all overflow-hidden">
              {Icon && (
                <div className="min-w-5 h-full flex items-center justify-center">
                  <Icon size={20} className="size-5" strokeWidth={1.5} />
                </div>
              )}
              {value || (
                <span className="w-full text-sm text-neutral-400">
                  {placeholder}
                </span>
              )}
            </div>
          )}
        </>
      )}

      {/* Textarea */}
      {textarea && !readOnly && (
        <textarea
          id={id}
          name={name}
          placeholder={placeholder}
          onChange={onChange}
          value={value}
          className={`w-full p-2 md:p-3 resize-none text-sm rounded-lg bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 focus:outline-none ${className}`}
          {...rest}
        />
      )}

      {/* Select */}
      {select && !readOnly && (
        <div className="w-full flex items-center justify-center relative">
          <select
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            className={`w-full h-10 px-3.5 appearance-none cursor-pointer rounded-lg bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-neutral-950 dark:text-neutral-50 focus:outline-none ${className}`}
            {...rest}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown
            strokeWidth={1.5}
            className="size-4.5 absolute right-3.5 select-none pointer-events-none"
          />
        </div>
      )}

      {/* Range slider */}
      {range && !readOnly && (
        <div className="flex items-center gap-2">
          <input
            type="range"
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            min={min}
            max={max}
            step={step}
            className="w-full accent-sky-500"
            {...rest}
          />
          <span className="text-sm w-10 text-right font-mono text-neutral-400">
            {value}
          </span>
        </div>
      )}

      {/* Toggle (boolean) */}
      {boolean && (
        <div className="min-w-10 mt-7.5 flex flex-col items-center justify-center">
          <button
            type="button"
            role="switch"
            onClick={onClick}
            aria-checked={!!value}
            className={`w-10 h-6 px-0.5 flex items-center relative rounded-xl cursor-pointer ${
              value ? "bg-neutral-50" : "bg-neutral-800"
            } transition-all duration-300 ease-out`}
          >
            <div
              className={`size-5 rounded-full absolute bg-neutral-950 transition-all duration-300 ease-out ${
                value ? "right-0.5" : "left-0.5"
              }`}
            />
            <input type="hidden" name={name} value={value} {...rest} />
          </button>
        </div>
      )}

      {/* Image, Banner, or Avatar */}
      {(image || banner || avatar) && (
        <div className="w-full flex flex-col md:flex-row items-start justify-between gap-3">
          <div className="w-full md:min-w-62.5 md:w-26.5 md:max-w-26.5 min-h-35.5 h-35.5 max-h-35.5 flex items-center justify-center rounded-xl bg-neutral-50 dark:bg-neutral-950 text-neutral-950 dark:text-neutral-50 border border-neutral-200 dark:border-neutral-800 overflow-hidden">
            {avatar ? (
              <div className="size-26 flex items-center justify-center rounded-4xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 overflow-hidden">
                <img
                  src={src && src.length > 0 ? src : "/images/avatar.png"}
                  width={104}
                  height={104}
                  loading="eager"
                  alt={`Imagen de perfil de ${props?.name ?? "nombre"} (@${props?.username ?? "usuario"})`}
                  title={`Imagen de perfil de ${props?.name ?? "nombre"} (@${props?.username ?? "usuario"})`}
                  className="size-full object-cover object-center select-none pointer-events-none border-none outline-none"
                />
              </div>
            ) : (
              <div className="size-full flex items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-900 overflow-hidden">
                <img
                  src={src && src.length > 0 ? src : "/images/photo.png"}
                  width={248}
                  height={140}
                  loading="eager"
                  alt={`Imagen de banner de ${props?.name ?? "nombre"} (@${props?.username ?? "usuario"})`}
                  title={`Imagen de banner de ${props?.name ?? "nombre"} (@${props?.username ?? "usuario"})`}
                  className="size-full object-contain object-center select-none pointer-events-none border-none outline-none scale-111 bg-neutral-950/40"
                />
              </div>
            )}
          </div>
          <div className="w-full flex flex-col items-start justify-start gap-3">
            {text && <span className="text-xs text-neutral-400">{text}</span>}
            {(onImageChange || onImageRemove) && (
              <div className="w-full flex items-center justify-between md:justify-start gap-2">
                {onImageChange && (
                  <Button
                    variant="inactive"
                    onClick={onImageChange}
                    disabled={uploading}
                    className="w-full md:w-auto"
                  >
                    {uploading ? "Subiendo..." : "Cambiar"}
                  </Button>
                )}
                {onImageRemove && (
                  <Button
                    variant="inactive"
                    onClick={onImageRemove}
                    disabled={uploading}
                    className="w-full md:w-auto"
                  >
                    Quitar
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Input normal */}
      {!textarea &&
        !select &&
        !range &&
        !readOnly &&
        !boolean &&
        !image &&
        !avatar &&
        !banner && (
          <div className="relative w-full flex items-center">
            {Icon && (
              <div className="absolute left-3.5 flex items-center justify-center pointer-events-none">
                <Icon size={20} className="size-5" />
              </div>
            )}
            <input
              id={id}
              name={name}
              type={type}
              placeholder={placeholder}
              value={value}
              onChange={onChange}
              className={`w-full h-10 ${
                Icon ? "pl-11" : "px-3.5"
              } text-sm rounded-lg bg-neutral-50 dark:bg-neutral-950 text-neutral-950 dark:text-neutral-50 border border-neutral-200 dark:border-neutral-800 focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-600 transition-colors duration-300 ease-out ${className}`}
              {...rest}
            />
          </div>
        )}

      {/* Info */}
      {info && (
        <div className="w-full flex items-center justify-start">
          <span className="text-xs text-neutral-400">{info}</span>
        </div>
      )}

      {/* Errors */}
      {error && (
        <div className="w-full flex items-center justify-start">
          <span className="text-xs text-rose-600">{error}</span>
        </div>
      )}
    </div>
  );
}
