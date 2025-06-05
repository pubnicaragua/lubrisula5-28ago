"use client"

import { createContext } from "react"

// Define el tipo para el usuario
export interface User {
  id: string
  email: string
  role?: string
}

// Define el tipo para el contexto de autenticación
export interface AuthContextType {
  user: User | null
  loading: boolean
  error: string | null
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  signUp: (email: string, password: string, role: string) => Promise<void>
  hasRole: (role: string) => boolean
  hasPermission: (permission: string) => boolean
}

// Crea el contexto con un valor inicial
export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  signIn: async () => {},
  signOut: async () => {},
  signUp: async () => {},
  hasRole: () => false,
  hasPermission: () => false,
})

// Hook personalizado para usar el contexto de autenticación
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider")
  }
  return context
}

// Importación necesaria para useContext
import { useContext } from "react"
