"use client";

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
import { useEvents } from "../hooks/useEvents";

export type EventOption = { label: string; value: string };

export type ComboboxEventProps = {
  value: string;
  onChange: (value: string) => void;
  options?: EventOption[];
};

export function ComboboxEvent({
  value,
  onChange,
  options,
}: ComboboxEventProps) {
  const [open, setOpen] = React.useState(false);
  const { events: fetched, loading, error } = useEvents();

  // Preferência: props.options > API; fallback: []
  const regions = React.useMemo<EventOption[]>(() => {
    if (options && options.length > 0) return options;
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
              ? regions.find((r) => r.value === value)?.label ??
                "Selecione o evento..."
              : loading
              ? "Carregando eventos..."
              : regions.length === 0
              ? "Nenhuma evento encontrada"
              : "Selecione o evento..."}
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
            placeholder={
              loading ? "Carregando eventos..." : "Buscar eventos..."
            }
          />
          <CommandList>
            <CommandEmpty>
              {loading
                ? "Carregando..."
                : error
                ? "Falha ao carregar os eventos."
                : "Nenhuma evento encontrado."}
            </CommandEmpty>
            {regions.length > 0 && (
              <CommandGroup>
                {regions.map((event) => (
                  <CommandItem
                    key={event.value}
                    value={event.value}
                    onSelect={(currentValue) => {
                      onChange(currentValue);
                      setOpen(false);
                    }}
                  >
                    <span
                      className={cn(
                        "px-2 py-1 rounded text-xs font-semibold",
                        value === event.value ? "ring-2 ring-blue-400" : ""
                      )}
                    >
                      {event.label}
                    </span>
                    <Check
                      className={cn(
                        "ml-auto",
                        value === event.value ? "opacity-100" : "opacity-0"
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
