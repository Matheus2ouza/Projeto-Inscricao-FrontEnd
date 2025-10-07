"use client";

import React, { useState, useEffect } from "react";
import CookieConsent from "../../../components/cookie/CookieConsent";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import {
  Alert,
  AlertTitle,
  AlertDescription,
} from "@/shared/components/ui/alert";
import Background from "@/shared/components/ui/background";
import Logo from "@/shared/components/ui/logo";
import "bootstrap-icons/font/bootstrap-icons.css";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import useFormLogin from "./hooks/useFormLogin";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/components/ui/dialog";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [cookieAccepted, setCookieAccepted] = useState(false);
  const { form, onSubmit } = useFormLogin();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Background className="min-h-screen">
      <CookieConsent onAccept={() => setCookieAccepted(true)} />
      {/* Pop-up de sessão expirada */}
      <div className="min-h-screen flex flex-col">
        {/* Main content */}
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          {/* Logo acima do card */}
          <Logo className="w-48 h-48 object-contain mx-auto mb-8" />

          {/* Card de Login */}
          <div className="w-full max-w-md p-8 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-2xl rounded-2xl border border-white/30 dark:border-gray-700/30 hover:shadow-3xl transition-all duration-300">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                Bem-vindo
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Faça login para acessar o sistema
              </p>
            </div>

            {/* Formulário */}
            <Form {...form}>
              <form onSubmit={onSubmit} className="space-y-6">
                {/* Campo Usuário */}
                <div className="space-y-2">
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
                            placeholder="Digite sua localidade"
                            className="w-full rounded-xl border-gray-300 bg-white/50 dark:bg-gray-800/50 shadow-sm focus:border-indigo-400 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:border-gray-600 dark:text-white backdrop-blur-sm transition-all duration-200 pl-4 pr-4 py-3"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Campo Senha */}
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
                              className="w-full rounded-xl border-gray-300 bg-white/50 dark:bg-gray-800/50 shadow-sm focus:border-indigo-400 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:border-gray-600 dark:text-white backdrop-blur-sm transition-all duration-200 pl-4 pr-12 py-3"
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

                {/* Botão de Login */}
                <div className="pt-4">
                  <Button
                    className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-base hover:from-indigo-700 hover:to-purple-700 dark:from-indigo-500 dark:to-purple-500 dark:hover:from-indigo-600 dark:hover:to-purple-600 py-5 px-6 text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200"
                    type="submit"
                  >
                    <i className="bi bi-box-arrow-in-right mr-2 text-base"></i>
                    Entrar no Sistema
                  </Button>
                </div>
              </form>
            </Form>

            {/* Alert de Ajuda */}
            <div className="mt-8">
              <Alert className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200/50 dark:border-blue-700/30 backdrop-blur-sm rounded-xl !grid-cols-1">
                <div className="flex items-start w-full">
                  <div className="flex-1 min-w-0">
                    <AlertTitle className="text-blue-800 dark:text-blue-200 font-semibold !col-start-1">
                      Precisar de ajuda?
                    </AlertTitle>
                    <AlertDescription className="text-blue-700 dark:text-blue-300 mt-1 !col-start-1">
                      Entre em contato com o suporte para obter assistência.
                    </AlertDescription>
                  </div>
                </div>
              </Alert>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-t border-white/20 dark:border-gray-700/20 py-4 px-6 flex-shrink-0">
          <div className="max-w-7xl mx-auto flex flex-col items-center space-y-3">
            {/* Primeira linha: Sistema de Inscrição */}
            <p className="text-[17px] text-gray-700 dark:text-gray-300 font-medium">
              Sistema de Inscrição - R2 &copy; 2025
            </p>

            {/* Segunda linha: Documentação e Contato */}
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6">
              <a
                className="text-[15px] text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors font-medium flex items-center"
                target="_blank"
                rel="noopener noreferrer"
                href="/documentation"
              >
                <i className="bi bi-book mr-1 mt-0.5"></i>
                Documentação
              </a>
              <p className="text-[15px] text-gray-700 dark:text-gray-300 flex items-center space-x-1 font-medium">
                <i className="bi bi-whatsapp text-green-500"></i>
                <span>Contato: (91) 99258 - 7483</span>
              </p>
            </div>
          </div>
        </footer>
      </div>
    </Background>
  );
}
