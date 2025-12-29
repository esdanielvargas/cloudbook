import { ChevronDown } from "lucide-react";

export default function FormField(props) {
  const {
    id,
    name,
    label = "",
    text = "",
    placeholder,
    value,
    onChange,
    type = "text",
    textarea,
    select,
    options = [],
    range,
    min = 0,
    max = 100,
    step = 1,
    readOnly,
    className = "",
    boolean,
    onClick,
    // isActive,
    ...rest
  } = props;

  return (
    <div
      className={`w-full flex ${
        boolean ? "flex-row items-start" : "flex-col"
      } gap-1.5`}
    >
      {(label || text) && (
        <div className="w-full flex flex-col gap-1.5">
          {label && (
            <label
              htmlFor={id}
              className="text-md font-medium text-neutral-700 dark:text-neutral-300"
            >
              {label}
            </label>
          )}

          {text && <span className="text-xs text-neutral-400">{text}</span>}
        </div>
      )}

      {/* Caja de solo lectura para mostrar resultados */}
      {readOnly && (
        <div className="w-full h-10 px-3.5 py-2 flex items-center rounded-lg bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-sm text-neutral-950 dark:text-neutral-50 break-all overflow-hidden">
          {value || (
            <span className="w-full text-sm text-neutral-400 select-none pointer-events-none">
              {placeholder}
            </span>
          )}
        </div>
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

      {/* Input normal */}
      {!textarea && !select && !range && !readOnly && !boolean && (
        <input
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`w-full h-10 px-3.5 text-sm rounded-lg bg-neutral-50 dark:bg-neutral-950 text-neutral-950 dark:text-neutral-50 border border-neutral-200 dark:border-neutral-800 focus:outline-none ${className}`}
          {...rest}
        />
      )}
    </div>
  );
}
