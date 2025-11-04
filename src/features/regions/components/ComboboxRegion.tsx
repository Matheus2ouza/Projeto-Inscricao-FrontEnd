"use client";

import { useRegions } from "@/features/regions/hooks/useRegions";
import { Button } from "@/shared/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/shared/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { cn } from "@/shared/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";

export type RegionOption = { label: string; value: string };

export type ComboboxRegionProps = {
  value: string;
  onChange: (value: string) => void;
  options?: RegionOption[];
  loading?: boolean;
};

export function ComboboxRegion({
  value,
  onChange,
  options,
  loading: loadingProp,
}: ComboboxRegionProps) {
  const [open, setOpen] = React.useState(false);
  const shouldFetch = options === undefined;
  const { regions: fetched, loading: internalLoading, error } =
    useRegions(shouldFetch);
  const loading = loadingProp ?? internalLoading;

  // Preferência: props.options > API; fallback: []
  const regions = React.useMemo<RegionOption[]>(() => {
    if (options) return options;
    if (fetched && fetched.length > 0) {
      return fetched.map((r) => ({
        label: r.name.toUpperCase(),
        value: r.id,
      }));
    }
    return [];
  }, [options, fetched]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between relative overflow-hidden"
        >
          <span
            className={
              value
                ? "relative z-10 text-blue-700 dark:text-blue-300 font-semibold px-2 py-1"
                : "text-gray-700 dark:text-gray-200"
            }
          >
            {value
              ? (regions.find((r) => r.value === value)?.label ??
                "Selecione a região...")
              : loading
                ? "Carregando regiões..."
                : regions.length === 0
                  ? "Nenhuma região encontrada"
                  : "Selecione a região..."}
          </span>
          <ChevronsUpDown
            className={
              value ? "relative z-10 text-blue-700 opacity-80" : "opacity-50"
            }
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] min-w-[180px] p-0">
        <Command>
          <CommandInput
            placeholder={loading ? "Carregando regiões..." : "Buscar região..."}
          />
          <CommandList>
            <CommandEmpty>
              {loading
                ? "Carregando..."
                : error
                  ? "Falha ao carregar regiões."
                  : "Nenhuma região encontrada."}
            </CommandEmpty>
            {regions.length > 0 && (
              <CommandGroup>
                {regions.map((region) => (
                  <CommandItem
                    key={region.value}
                    value={region.value}
                    onSelect={(currentValue) => {
                      onChange(currentValue);
                      setOpen(false);
                    }}
                  >
                    <span
                      className={cn(
                        "px-2 py-1 rounded text-xs font-semibold",
                        value === region.value ? "ring-2 ring-blue-400" : ""
                      )}
                    >
                      {region.label}
                    </span>
                    <Check
                      className={cn(
                        "ml-auto",
                        value === region.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
