"use client";

import React, { useMemo, useState } from "react";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/shared/components/ui/dialog";
import { ComboboxRole } from "@/features/accounts/components/ComboboxRole";
import { Input } from "@/shared/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/shared/components/ui/pagination";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { FormProvider } from "react-hook-form";
import { ROLES } from "@/features/accounts/hooks/useFormCreateAccount";
import { MultiSelectRegion } from "@/features/regions/components/MultiSelectRegion";
import { ComboboxRegion } from "@/features/regions/components/ComboboxRegion";
import { Switch } from "@/shared/components/ui/switch";
import useFormCreateAccount from "@/features/accounts/hooks/useFormCreateAccount";
import { useRegions } from "@/features/regions/hooks/useRegions";
import { useUsers } from "@/features/accounts/hooks/useUsers";

export default function AccountsTable() {
  const [open, setOpen] = useState(false);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [appliedRegions, setAppliedRegions] = useState<string[]>([]); // Filtro aplicado
  const [showPassword, setShowPassword] = useState(false);
  const [hasRegion, setHasRegion] = useState(false);

  const { form, onSubmit } = useFormCreateAccount();
  const { regions: fetchedRegions, loading, error } = useRegions();
  const {
    users,
    total,
    page,
    pageCount,
    loading: loadingUsers,
    setPage,
  } = useUsers({ pageSize: 20 });

  // Transformar as regiões do hook no formato de Option
  const regionOptions = useMemo(() => {
    return fetchedRegions.map((r) => ({
      label: r.name.toUpperCase(),
      value: r.id,
    }));
  }, [fetchedRegions]);

  // Criar um mapa de id para nome da região para facilitar o filtro
  const regionMap = useMemo(() => {
    const map = new Map();
    fetchedRegions.forEach((region) => {
      map.set(region.id, region.name.toUpperCase());
    });
    return map;
  }, [fetchedRegions]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Aplicar o filtro quando clicar em buscar
  const handleSearch = () => {
    setAppliedRegions([...selectedRegions]);
    setPage(1); // Reset para primeira página ao aplicar filtro
  };

  // Limpar filtros
  const clearFilters = () => {
    setSelectedRegions([]);
    setAppliedRegions([]);
    setPage(1); // Reset para primeira página ao limpar filtro
  };

  // Filtrar usuários baseado nas regiões aplicadas
  const filteredUsers = useMemo(() => {
    if (appliedRegions.length === 0) {
      return users;
    }

    // Obter os nomes das regiões aplicadas
    const appliedRegionNames = appliedRegions
      .map((regionId) => regionMap.get(regionId))
      .filter(Boolean);

    return users.filter((user) =>
      appliedRegionNames.includes(user.regionName?.toUpperCase())
    );
  }, [users, appliedRegions, regionMap]);

  const filteredTotal =
    appliedRegions.length > 0 ? filteredUsers.length : total;
  const filteredPageCount =
    appliedRegions.length > 0
      ? Math.ceil(filteredUsers.length / 20)
      : pageCount;

  // Verificar se há filtros não aplicados
  const hasUnsavedFilters =
    selectedRegions.length !== appliedRegions.length ||
    !selectedRegions.every((region, index) => region === appliedRegions[index]);

  // Função para lidar com o submit e fechar o dialog se sucesso
  const handleSubmit = async (event: React.FormEvent) => {
    const success = await onSubmit(event);
    if (success) setOpen(false);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6 gap-2 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap ">
          <MultiSelectRegion
            value={selectedRegions}
            onChange={setSelectedRegions}
            options={regionOptions}
            label="Filtrar região"
          />
          <Button
            variant="outline"
            onClick={handleSearch}
            type="button"
            disabled={!hasUnsavedFilters}
          >
            Buscar {appliedRegions.length > 0 && `(${filteredTotal})`}
          </Button>
          <Button
            variant="destructive"
            onClick={clearFilters}
            type="button"
            disabled={appliedRegions.length === 0}
          >
            Limpar
          </Button>
        </div>
        <Button
          variant="default"
          className="dark:bg-secondary dark:text-secondary-foreground dark:hover:bg-secondary/80"
          onClick={() => setOpen(true)}
        >
          Criar Usuário
        </Button>
      </div>

      {/* Indicador de filtro aplicado */}
      {appliedRegions.length > 0 && (
        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Filtro aplicado: {appliedRegions.length} região(ões) selecionada(s)
          </p>
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border">
        <table className="min-w-full text-sm">
          <thead className="bg-muted text-muted-foreground">
            <tr>
              <th className="w-1/4 px-2 py-2 text-left font-semibold">
                Username
              </th>
              <th className="w-1/6 px-4 py-2 text-center font-semibold">
                Região
              </th>
              <th className="w-1/6 px-4 py-2 text-center font-semibold">
                Role
              </th>
              <th className="w-1/4 px-4 py-2 text-center font-semibold">
                Criado em
              </th>
              <th className="w-1/4 px-4 py-2 text-center font-semibold">
                Atualizado em
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, idx) => {
              const roleObj = ROLES.find((r) => r.value === user.role);
              return (
                <tr key={user.username + idx} className="border-t">
                  <td className="w-1/4 px-2 py-2">{user.username}</td>
                  <td className="w-1/6 px-4 py-2 text-center">
                    {user.regionName?.toUpperCase() || "- -"}
                  </td>
                  <td className="w-1/6 px-4 py-2 text-center">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${roleObj?.color}`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="w-1/4 px-4 py-2 text-center">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="w-1/4 px-4 py-2 text-center">
                    {new Date(user.updatedAt).toLocaleDateString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mensagem quando não há resultados */}
      {filteredUsers.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          {appliedRegions.length > 0
            ? "Nenhum usuário encontrado para as regiões selecionadas."
            : "Nenhum usuário encontrado."}
        </div>
      )}

      {/* Paginação para dados filtrados */}
      <div className="flex justify-end mt-4">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setPage(Math.max(1, page - 1))}
                href="#"
              />
            </PaginationItem>
            {Array.from({ length: filteredPageCount }, (_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  isActive={page === i + 1}
                  href="#"
                  onClick={() => setPage(i + 1)}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() => setPage(Math.min(filteredPageCount, page + 1))}
                href="#"
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      {/* Informações de paginação */}
      <div className="text-center text-sm text-muted-foreground mt-2">
        Página {page} de {filteredPageCount} - {filteredTotal} usuário(s)
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-primary">Criar Usuário</DialogTitle>
          </DialogHeader>
          {/* Formulário */}
          <FormProvider {...form}>
            <form onSubmit={handleSubmit} className="space-y-4 mt-2">
              {/* username */}
              <div>
                <FormField
                  control={form.control}
                  name={"username"}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        htmlFor="username"
                        className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center text-transform: uppercase"
                      >
                        <i className="bi bi-geo-alt text-indigo-500 dark:text-blue-500"></i>
                        Usuário
                      </FormLabel>
                      <FormControl className="relative">
                        <Input
                          id="username"
                          type="text"
                          autoComplete="off"
                          placeholder="Digite sua localidade"
                          className="w-full rounded-xl border-gray-300 bg-white/50 dark:bg-gray-800/50 shadow-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-300 focus:ring-opacity-60 focus:shadow-md dark:border-gray-600 dark:text-white backdrop-blur-sm transition-all duration-300 pl-4 pr-4 py-3"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* password */}
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name={"password"}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        htmlFor="password"
                        className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center text-transform: uppercase"
                      >
                        <i className="bi bi-lock text-indigo-500 dark:text-blue-500"></i>
                        Senha
                      </FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Digite sua senha"
                            className="w-full rounded-xl border-gray-300 bg-white/50 dark:bg-gray-800/50 shadow-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-300 focus:ring-opacity-60 focus:shadow-md dark:border-gray-600 dark:text-white backdrop-blur-sm transition-all duration-300 pl-4 pr-12 py-3"
                            {...field}
                          />
                        </FormControl>
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200"
                          onClick={togglePasswordVisibility}
                        >
                          <i
                            className={`bi ${
                              showPassword ? "bi-eye-slash" : "bi-eye"
                            } text-lg`}
                          ></i>
                        </button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* Permissão (role) */}
              <div>
                <FormField
                  control={form.control}
                  name={"role"}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="role" className="mb-2">
                        PERMISSÃO
                      </FormLabel>
                      <FormControl>
                        <ComboboxRole
                          value={field.value as string}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* Switch para adicionar região - layout padrão */}
              <div className="flex items-center gap-2 mb-2">
                <label
                  htmlFor="hasRegion"
                  className="text-sm text-gray-700 dark:text-gray-300 select-none cursor-pointer"
                >
                  Adicionar região
                </label>
                <Switch
                  id="hasRegion"
                  checked={hasRegion}
                  onCheckedChange={setHasRegion}
                />
              </div>
              {hasRegion && (
                <FormField
                  control={form.control}
                  name={"region"}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="region" className="mb-2">
                        Região
                      </FormLabel>
                      <FormControl>
                        <ComboboxRegion
                          value={field.value as string}
                          onChange={field.onChange}
                          options={regionOptions} // Passando as opções do hook
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <DialogFooter>
                <Button
                  type="submit"
                  className="dark:bg-secondary dark:text-secondary-foreground dark:hover:bg-secondary/80"
                >
                  Criar
                </Button>
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Cancelar
                  </Button>
                </DialogClose>
              </DialogFooter>
            </form>
          </FormProvider>
        </DialogContent>
      </Dialog>
    </div>
  );
}
