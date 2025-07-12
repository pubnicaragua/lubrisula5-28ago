"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Search, MessageSquare, Send, Mail, MailOpen, Trash2, User } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import MENSAJES_SERVICES, { type MensajeType } from "@/services/MENSAJES_SERVICES.service"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import USER_SERVICE, { UserType } from "@/services/USER_SERVICES.SERVICE"
import { useAuth } from "@/lib/supabase/auth"

export default function MensajesPage() {
  const [mensajesRecibidos, setMensajesRecibidos] = useState<MensajeType[]>([])
  const [mensajesEnviados, setMensajesEnviados] = useState<MensajeType[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedMensaje, setSelectedMensaje] = useState<MensajeType | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [mensajesNoLeidos, setMensajesNoLeidos] = useState(0)
  const [State_ListUsers, SetState_ListUsers] = useState<UserType[]>([])
  const { user } = useAuth()

  const [formData, setFormData] = useState<MensajeType>({
    destinatario_id: "",
    asunto: "",
    contenido: "",
    remitente_id: ""
  })

  const FN_GET_USUARIOS = async () => {
    const res = await USER_SERVICE.GET_ALL_USERS()
    SetState_ListUsers(res)

  }

  useEffect(() => {
    FN_GET_USUARIOS()
    loadMensajes()
    loadMensajesNoLeidos()
  }, [])

  const loadMensajes = async () => {
    try {
      setLoading(true)
      // Simular user_id - en producción obtener del contexto de autenticación  
      const userId = user.id

      const [recibidos, enviados] = await Promise.all([
        MENSAJES_SERVICES.GET_MENSAJES_RECIBIDOS(userId),
        MENSAJES_SERVICES.GET_MENSAJES_ENVIADOS(userId)
      ])

      setMensajesRecibidos(recibidos)
      setMensajesEnviados(enviados)
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los mensajes",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }


  const loadMensajesNoLeidos = async () => {
    try {
      const userId = user.id
      const count = await MENSAJES_SERVICES.GET_MENSAJES_NO_LEIDOS(userId)
      setMensajesNoLeidos(count)
    } catch (error) {
      console.error("Error al cargar mensajes no leídos:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await MENSAJES_SERVICES.ENVIAR_MENSAJE({
        ...formData,
        remitente_id: user?.id
      })
      toast({
        title: "Éxito",
        description: "Mensaje enviado correctamente"
      })
      setIsDialogOpen(false)
      resetForm()
      loadMensajes()
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo enviar el mensaje",
        variant: "destructive"
      })
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("¿Está seguro de eliminar este mensaje?")) {
      try {
        await MENSAJES_SERVICES.DELETE_MENSAJE(id)
        toast({
          title: "Éxito",
          description: "Mensaje eliminado correctamente"
        })
        loadMensajes()
      } catch (error) {
        toast({
          title: "Error",
          description: "No se pudo eliminar el mensaje",
          variant: "destructive"
        })
      }
    }
  }

  const handleMarcarComoLeido = async (id: string) => {
    try {
      await MENSAJES_SERVICES.MARCAR_COMO_LEIDO(id)
      loadMensajes()
      loadMensajesNoLeidos()
    } catch (error) {
      console.error("Error al marcar como leído:", error)
    }
  }

  const resetForm = () => {
    setFormData({
      destinatario_id: "",
      asunto: "",
      contenido: "",
      remitente_id: ""
    })
  }

  const openViewDialog = (mensaje: MensajeType) => {
    setSelectedMensaje(mensaje)
    setIsViewDialogOpen(true)
    if (!mensaje.leido && mensaje.destinatario_id === "current-user-id") {
      handleMarcarComoLeido(mensaje.id!)
    }
  }

  const filteredMensajesRecibidos = mensajesRecibidos.filter(mensaje =>
    mensaje.asunto?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mensaje.contenido?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredMensajesEnviados = mensajesEnviados.filter(mensaje =>
    mensaje.asunto?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mensaje.contenido?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <MessageSquare className="h-8 w-8" />
            Centro de Mensajes
            {mensajesNoLeidos > 0 && (
              <Badge variant="destructive" className="ml-2">
                {mensajesNoLeidos} nuevos
              </Badge>
            )}
          </h1>
          <p className="text-muted-foreground">
            Gestione su comunicación con otros usuarios del sistema
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Mensaje
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Nuevo Mensaje</DialogTitle>
              <DialogDescription>
                Envíe un mensaje a otro usuario del sistema
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="destinatario_id">Destinatario</Label>
                <Select onValueChange={(value) => setFormData({ ...formData, destinatario_id: value })}>

                  <SelectTrigger id="cliente" >
                    <SelectValue placeholder="Seleccionar cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {
                      State_ListUsers.map((client) => (
                        <SelectItem key={client.user_auth_id} value={client.user_auth_id}>{client.user_email} - {client.role_name}</SelectItem>

                      ))
                    }
                  </SelectContent>
                </Select>
                {/* <Input
                  id="destinatario_id"
                  placeholder="ID del destinatario"
                  value={formData.destinatario_id}
                  onChange={(e) => setFormData({ ...formData, destinatario_id: e.target.value })}
                  required
                /> */}
              </div>
              <div className="space-y-2">
                <Label htmlFor="asunto">Asunto</Label>
                <Input
                  id="asunto"
                  placeholder="Asunto del mensaje"
                  value={formData.asunto}
                  onChange={(e) => setFormData({ ...formData, asunto: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contenido">Mensaje</Label>
                <Textarea
                  id="contenido"
                  placeholder="Escriba su mensaje aquí..."
                  value={formData.contenido}
                  onChange={(e) => setFormData({ ...formData, contenido: e.target.value })}
                  rows={5}
                  required
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  <Send className="mr-2 h-4 w-4" />
                  Enviar
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center space-x-2">
        <Search className="h-4 w-4" />
        <Input
          placeholder="Buscar mensajes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <Tabs defaultValue="recibidos" className="space-y-4">
        <TabsList>
          <TabsTrigger value="recibidos" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Recibidos ({filteredMensajesRecibidos.length})
          </TabsTrigger>
          <TabsTrigger value="enviados" className="flex items-center gap-2">
            <Send className="h-4 w-4" />
            Enviados ({filteredMensajesEnviados.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="recibidos">
          <Card>
            <CardHeader>
              <CardTitle>Mensajes Recibidos</CardTitle>
              <CardDescription>
                {filteredMensajesRecibidos.length} mensaje(s) recibido(s)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Estado</TableHead>
                    <TableHead>Remitente</TableHead>
                    <TableHead>Asunto</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">
                        Cargando...
                      </TableCell>
                    </TableRow>
                  ) : filteredMensajesRecibidos.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">
                        No se encontraron mensajes
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredMensajesRecibidos.map((mensaje) => (
                      <TableRow key={mensaje.id} className={!mensaje.leido ? "bg-blue-50" : ""}>
                        <TableCell>
                          {mensaje.leido ? (
                            <MailOpen className="h-4 w-4 text-gray-500" />
                          ) : (
                            <Mail className="h-4 w-4 text-blue-500" />
                          )}
                        </TableCell>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            {mensaje.remitente?.email || mensaje.remitente_id}
                          </div>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {mensaje.asunto}
                        </TableCell>
                        <TableCell>
                          {mensaje.created_at ? new Date(mensaje.created_at).toLocaleDateString() : '-'}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openViewDialog(mensaje)}
                            >
                              <MailOpen className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(mensaje.id!)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="enviados">
          <Card>
            <CardHeader>
              <CardTitle>Mensajes Enviados</CardTitle>
              <CardDescription>
                {filteredMensajesEnviados.length} mensaje(s) enviado(s)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Destinatario</TableHead>
                    <TableHead>Asunto</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center">
                        Cargando...
                      </TableCell>
                    </TableRow>
                  ) : filteredMensajesEnviados.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center">
                        No se encontraron mensajes
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredMensajesEnviados.map((mensaje) => (
                      <TableRow key={mensaje.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            {mensaje.destinatario?.email || mensaje.destinatario_id}
                          </div>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {mensaje.asunto}
                        </TableCell>
                        <TableCell>
                          {mensaje.created_at ? new Date(mensaje.created_at).toLocaleDateString() : '-'}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openViewDialog(mensaje)}
                            >
                              <MailOpen className="h-4 w-4" />
                            </Button>

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(mensaje.id!)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog para ver mensaje completo */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedMensaje?.asunto}</DialogTitle>
            <DialogDescription>
              {selectedMensaje?.remitente?.email || selectedMensaje?.remitente_id} - {' '}
              {selectedMensaje?.created_at ? new Date(selectedMensaje.created_at).toLocaleString() : ''}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="whitespace-pre-wrap">{selectedMensaje?.contenido}</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}