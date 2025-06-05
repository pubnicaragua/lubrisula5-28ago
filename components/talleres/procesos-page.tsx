"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MainNav } from "@/components/main-nav"
import { ModeToggle } from "@/components/mode-toggle"
import { UserNav } from "@/components/user-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Search, Filter, FileText, AlertCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { NuevoProcesoForm } from "./nuevo-proceso-form"
import { ProcesosLista } from "./procesos-lista"
import { PaquetesServicio } from "./paquetes-servicio"
import { MaterialesProceso } from "./materiales-proceso"

export function ProcesosPage() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Verificar si las tablas necesarias existen
    const checkTables = async () => {
      try {
        const response = await fetch("/api/check-tables?tables=procesos_taller,materiales")
        const data = await response.json()

        if (!data.success) {
          setError("Las tablas necesarias no existen. Por favor, inicialice las tablas de materiales.")
        }
      } catch (error) {
        setError("Error al verificar las tablas. Por favor, intente de nuevo más tarde.")
      } finally {
        setLoading(false)
      }
    }

    checkTables()
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 sm:px-6">
        <MainNav />
        <div className="ml-auto flex items-center gap-4">
          <ModeToggle />
          <UserNav />
        </div>
      </header>
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Procesos y Materiales</h1>
          <div className="flex items-center gap-2">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Nuevo Proceso
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Nuevo Proceso</DialogTitle>
                  <DialogDescription>
                    Ingresa la información del nuevo proceso técnico. Haz clic en guardar cuando hayas terminado.
                  </DialogDescription>
                </DialogHeader>
                <NuevoProcesoForm onSubmit={() => setOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Buscar procesos..." className="pl-8" />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
            <span className="sr-only">Filtrar procesos</span>
          </Button>
          <Button variant="outline" size="icon">
            <FileText className="h-4 w-4" />
            <span className="sr-only">Exportar procesos</span>
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-red-600 flex items-center">
                <AlertCircle className="mr-2 h-5 w-5" /> Error de Configuración
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">{error}</p>
              <Button asChild>
                <a href="/diagnostico-talleres">Verificar y Solucionar</a>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="procesos" className="space-y-4">
            <TabsList>
              <TabsTrigger value="procesos">Procesos Técnicos</TabsTrigger>
              <TabsTrigger value="paquetes">Paquetes de Servicio</TabsTrigger>
              <TabsTrigger value="materiales">Materiales por Proceso</TabsTrigger>
            </TabsList>
            <TabsContent value="procesos">
              <ProcesosLista />
            </TabsContent>
            <TabsContent value="paquetes">
              <PaquetesServicio />
            </TabsContent>
            <TabsContent value="materiales">
              <MaterialesProceso />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  )
}
