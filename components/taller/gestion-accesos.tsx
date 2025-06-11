"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useToast } from "@/hooks/use-toast"

interface Usuario {
  id: string
  email: string
  nombre_completo: string
  rol: string
  estado: string
  fecha_creacion: string
}

export function GestionAccesos() {
  const supabase = createClientComponentClient()
  const { toast } = useToast()
  
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [filteredUsuarios, setFilteredUsuarios] = useState<Usuario[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('todos')
  
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentUsuario, setCurrentUsuario] = useState<Usuario | null>(null)
  
  const [formData, setFormData] = useState({
    email: '',
    nombre_completo: '',
    rol: 'tecnico',
    estado: 'activo'
  })
  
  const roles = [
    { value: 'administrador', label: 'Administrador' },
    { value: 'tecnico', label: 'Técnico' },
    { value: 'aseguradora', label: 'Aseguradora' },
    { value: 'cliente', label: 'Cliente' }
  ]
  
  const estados = [
    { value: 'activo', label: 'Activo' },
    { value: 'inactivo', label: 'Inactivo' },
    { value: 'pendiente', label: 'Pendiente de Activación' }
  ]

  useEffect(() => {
    fetchUsuarios()
  }, [])

  useEffect(() => {
    if (usuarios.length > 0) {
      filterUsuarios()
    }
  }, [searchTerm, roleFilter, usuarios])

  const fetchUsuarios = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .order('nombre_completo')
      
      if (error) throw error
      
      setUsuarios(data)
      setFilteredUsuarios(data)
    } catch (error) {
      console.error('Error al cargar usuarios:', error)
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los usuarios',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filterUsuarios = () => {
    let filtered = usuarios

    // Filtrar por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(usuario => 
        usuario.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        usuario.nombre_completo.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filtrar por rol
    if (roleFilter !== 'todos') {
      filtered = filtered.filter(usuario => usuario.rol === roleFilter)
    }

    setFilteredUsuarios(filtered)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
