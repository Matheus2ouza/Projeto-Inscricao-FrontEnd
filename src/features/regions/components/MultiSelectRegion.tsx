import React from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/shared/components/ui/popover";
import { Button } from "@/shared/components/ui/button";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/shared/components/ui/command";
import { useRegions } from "../hooks/useRegions";
import { RegionOption } from "./ComboboxRegion";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/shared/lib/utils";

export type ComboboxRegionProps = {
  value: string[];
  onChange: (value: string[]) => void;
  options?: RegionOption[];
  label?: string;
  buttonVariant?:
    | "default"
    | "secondary"
    | "destructive"
    | "outline"
    | "ghost"
    | "link";
};

export function MultiSelectRegion({
  value = [],
  onChange,
  options,
  label = "Região",
  buttonVariant = "outline",
}: ComboboxRegionProps) {
  const [open, setOpen] = React.useState(false);
  const { regions: fetched, loading, error } = useRegions();

  // Preferência: props.options > API; fallback: []
  const regions = React.useMemo<RegionOption[]>(() => {
    if (options && options.length > 0) return options;
    if (fetched && fetched.length > 0) {
      return fetched.map((r) => ({
        label: r.name.toUpperCase(),
        value: r.id,
      }));
    }
    return [];
  }, [options, fetched]);

  const handleSelect = (regionValue: string) => {
    const isSelected = value.includes(regionValue);
    if (isSelected) {
      // Remove da seleção
      onChange(value.filter((v) => v !== regionValue));
    } else {
      // Adiciona à seleção
      onChange([...value, regionValue]);
    }
  };

  const selectedRegions = regions.filter((region) =>
    value.includes(region.value)
  );
  const displayText =
    selectedRegions.length > 0
      ? selectedRegions.map((region) => region.label).join(", ")
      : label;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={buttonVariant}
          className="min-w-[250px] justify-between"
          type="button"
        >
          <span
            className={cn(
              "truncate",
              value.length > 0
                ? "text-blue-700 dark:text-blue-300 font-semibold"
                : "text-muted-foreground"
            )}
          >
            {displayText}
            {value.length > 0 && ` (${value.length})`}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[250px]" align="start">
        <Command>
          <CommandInput placeholder={`Buscar ${label.toLowerCase()}...`} />
          <CommandList>
            <CommandEmpty>
              {loading
                ? "Carregando..."
                : error
                ? "Falha ao carregar regiões."
                : "Nenhuma região encontrada."}
            </CommandEmpty>
            <CommandGroup>
              {regions.map((region) => {
                const isSelected = value.includes(region.value);
                return (
                  <CommandItem
                    key={region.value}
                    value={region.value}
                    onSelect={() => handleSelect(region.value)}
                  >
                    <span
                      className={cn(
                        "px-2 py-1 rounded text-xs font-semibold",
                        isSelected ? "ring-2 ring-blue-400" : ""
                      )}
                    >
                      {region.label}
                    </span>
                    <Check
                      className={cn(
                        "ml-auto",
                        isSelected ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
