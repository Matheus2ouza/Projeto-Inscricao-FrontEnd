"use client";

import * as React from "react";

import { Calendar } from "@shared/components/ui/calendar";
import { ptBR } from "date-fns/locale";
import { Label } from "@shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@shared/components/ui/select";
import { type DateRange } from "react-day-picker";

interface CalendarRangerProps {
  dateRange?: DateRange;
  onDateRangeChange?: (dateRange: DateRange | undefined) => void;
}

export function CalendarRanger({
  dateRange,
  onDateRangeChange,
}: CalendarRangerProps) {
  const [dropdown, setDropdown] =
    React.useState<React.ComponentProps<typeof Calendar>["captionLayout"]>(
      "dropdown"
    );

  // Estado interno apenas se as props não forem fornecidas
  const [internalDateRange, setInternalDateRange] = React.useState<
    DateRange | undefined
  >({
    from: new Date(),
    to: new Date(new Date().setDate(new Date().getDate() + 3)),
  });

  // Use as props se fornecidas, caso contrário use estado interno
  const currentDateRange =
    dateRange !== undefined ? dateRange : internalDateRange;

  const handleDateRangeChange = (range: DateRange | undefined) => {
    if (onDateRangeChange) {
      // Se callback externo foi fornecido, use-o
      onDateRangeChange(range);
    } else {
      // Caso contrário, use o estado interno
      setInternalDateRange(range);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full align-center justify-center">
      <div className="flex flex-col gap-3">
        <Label htmlFor="dropdown" className="px-1">
          Filtros do Calendário
        </Label>
        <Select
          value={dropdown}
          onValueChange={(value) =>
            setDropdown(
              value as React.ComponentProps<typeof Calendar>["captionLayout"]
            )
          }
        >
          <SelectTrigger
            id="dropdown"
            size="sm"
            className="bg-background w-full"
          >
            <SelectValue placeholder="Dropdown" />
          </SelectTrigger>
          <SelectContent align="center">
            <SelectItem value="dropdown">Mês e Ano</SelectItem>
            <SelectItem value="dropdown-months">Somente Mês</SelectItem>
            <SelectItem value="dropdown-years">Somente Ano</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex justify-center align-middle w-full">
        <Calendar
          mode="range"
          defaultMonth={currentDateRange?.from}
          selected={currentDateRange}
          onSelect={handleDateRangeChange}
          disabled={{
            before: new Date(),
          }}
          captionLayout={dropdown}
          locale={ptBR}
          numberOfMonths={2}
          className="rounded-lg border shadow-sm"
        />
      </div>
    </div>
  );
}
