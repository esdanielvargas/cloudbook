import { Timestamp } from "firebase/firestore";
import { PageBox, PageHeader, FormField } from "@/components";
import { accentHexMap } from "@/utils";
import { useThemeColor } from "@/context";
import { Check } from "lucide-react";

export default function Appearance() {
  const { accent, setAccent } = useThemeColor();

  return (
    <>
      <PageHeader title={"Apariencia"} />
      <PageBox active className="p-3 space-y-2">
        <FormField
          label="Fuentes"
          text="Selecciona tu fuente favorita."
          select
          options={[
            { value: "", label: "Favorit" },
            { value: "", label: "Favorit Mono" },
            { value: "", label: "Space Grotesk" },
            { value: "", label: "Space Mono" },
            { value: "", label: "Google Sans" },
            { value: "", label: "Goolge Sans Flex" },
          ]}
        />
        <FormField
          label="Temas"
          text="Selecciona tu tema preferido."
          select
          options={[
            { value: "auto", label: "Automático" },
            { value: "light", label: "Modo claro" },
            { value: "dark", label: "Modo oscuro" },
          ]}
        />
        <div className="space-y-1.5">
          <div className="w-full flex flex-col gap-1.5">
            <label className="text-md font-medium text-neutral-700 dark:text-neutral-300">
              Color de énfasis
            </label>
            <span className="text-xs text-neutral-400">
              Selecciona tu color favorito.
            </span>
          </div>
          <div className="w-full grid grid-cols-4 md:grid-cols-8 gap-0.5">
            {Object.entries(accentHexMap).map(([key, value]) => (
              <button
                key={key}
                type="button"
                title={`Color de énfasis: ${value.displayName} (${value.hex})`}
                onClick={() => setAccent(key)}
                className={`size-full aspect-square cursor-pointer rounded-xl md:border border-neutral-200 dark:border-neutral-800 flex items-center justify-center ${value.bgClass} ${value.hoverClass} transition-all duration-300 ease-out`}
              >
                {accent === key && <Check className="size-6 text-white" />}
              </button>
            ))}
          </div>
        </div>
      </PageBox>
    </>
  );
}
