"use client"

import { SelectItem } from "@/components/ui/select"

import { SelectContent } from "@/components/ui/select"

import { SelectValue } from "@/components/ui/select"

import { SelectTrigger } from "@/components/ui/select"

import { Select } from "@/components/ui/select"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Camera, Save, FileDown, Trash2 } from "lucide-react"
import SignatureCanvas from "react-signature-canvas"
import { jsPDF } from "jspdf"
import "jspdf-autotable"
import html2canvas from "html2canvas"

interface HojaInspeccionProps {
  vehiculoId?: string
  ordenId?: string
  readOnly?: boolean
  onSave?: (data: any) => void
}

export default function HojaInspeccion({ vehiculoId, ordenId, readOnly = false, onSave }: HojaInspeccionProps) {
  const supabase = createClientComponentClient()
  const { toast } = useToast()
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(false)
  const [vehiculo, setVehiculo] = useState<any>(null)
  const [cliente, setCliente] = useState<any>(null)
  const [imagenes, setImagenes] = useState<string[]>([])
  const [firmaCliente, setFirmaCliente] = useState<any>(null)
  const [firmaEncargado, setFirmaEncargado] = useState<any>(null)
  const [sigClienteRef, setSigClienteRef] = useState<any>(null)
  const [sigEncargadoRef, setSigEncargadoRef] = useState<any>(null)

  const [formData, setFormData] = useState({
    fecha: new Date().toISOString().split("T")[0],
    kilometraje: "",
    nivel_gasolina: "1/4",
    comentarios: "",
    interiores: {
      documentos: { cantidad: "", si: false, no: false },
      radio: { cantidad: "", si: false, no: false },
      portafusil: { cantidad: "", si: false, no: false },
      encendedor: { cantidad: "", si: false, no: false },
      tapetes_tela: { cantidad: "", si: false, no: false },
      tapetes_plastico: { cantidad: "", si: false, no: false },
      medidor_gasolina: { cantidad: "", si: false, no: false },
      kilometraje: { cantidad: "", si: false, no: false },
    },
    exteriores: {
      antena: { cantidad: "", si: false, no: false },
      falanges: { cantidad: "", si: false, no: false },
      centro_rin: { cantidad: "", si: false, no: false },
      placas: { cantidad: "", si: false, no: false },
    },
    coqueta: {
      herramienta: { cantidad: "", si: false, no: false },
      reflejantes: { cantidad: "", si: false, no: false },
      cables_corriente: { cantidad: "", si: false, no: false },
      llanta_refaccion: { cantidad: "", si: false, no: false },
      llave_cruceta: { cantidad: "", si: false, no: false },
      gato: { cantidad: "", si: false, no: false },
    },
    motor: {
      bateria: { cantidad: "", si: false, no: false },
      computadora: { cantidad: "", si: false, no: false },
      tapones_deposito: { cantidad: "", si: false, no: false },
    },
    carroceria: {
      danios: [],
    },
  })

  useEffect(() => {
    if (vehiculoId) {
      fetchVehiculo()
    }
    if (ordenId) {
      fetchInspeccion()
    }
  }, [vehiculoId, ordenId])

  const fetchVehiculo = async () => {
    try {
      const { data: vehiculoData, error: vehiculoError } = await supabase
        .from("vehicles")
        .select("*, cliente:client_id(*)") // cliente_id apunta a tabla clients
        .eq("id", vehiculoId)
        .single()

      if (vehiculoError) throw vehiculoError

      setVehiculo(vehiculoData)
      setCliente(vehiculoData.cliente)
    } catch (error) {
      console.error("Error al cargar datos del vehículo:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos del vehículo",
        // variant: "destructive",
      })
    }
  }

  const fetchInspeccion = async () => {
    try {
      const { data, error } = await supabase.from("inspecciones_vehiculo").select("*").eq("orden_id", ordenId).single()

      if (error) {
        if (error.code !== "PGRST116") {
          // No es un error de "no se encontró registro"
          throw error
        }
        return // No hay inspección existente
      }

      if (data) {
        setFormData(data.datos_inspeccion)
        if (data.imagenes) setImagenes(data.imagenes)
        if (data.firma_cliente) setFirmaCliente(data.firma_cliente)
        if (data.firma_encargado) setFirmaEncargado(data.firma_encargado)
      }
    } catch (error) {
      console.error("Error al cargar inspección:", error)
      toast({
        title: "Error",
        description: "No se pudo cargar la inspección existente",
        // variant: "destructive",
      })
    }
  }

  const handleInputChange = (section: string, field: string, subfield: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: {
          ...prev[section][field],
          [subfield]: value,
        },
      },
    }))
  }

  const handleRadioChange = (section: string, field: string, value: "si" | "no") => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: {
          ...prev[section][field],
          si: value === "si",
          no: value === "no",
        },
      },
    }))
  }

  const handleSimpleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    try {
      const newImages = [...imagenes]

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const fileExt = file.name.split(".").pop()
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`
        const filePath = `inspecciones/${fileName}`

        const { error: uploadError, data } = await supabase.storage.from("vehiculos").upload(filePath, file)

        if (uploadError) throw uploadError

        const { data: urlData } = supabase.storage.from("vehiculos").getPublicUrl(filePath)
        newImages.push(urlData.publicUrl)
      }

      setImagenes(newImages)
      toast({
        title: "Imágenes subidas",
        description: "Las imágenes se han subido correctamente",
      })
    } catch (error) {
      console.error("Error al subir imágenes:", error)
      toast({
        title: "Error",
        description: "No se pudieron subir las imágenes",
        // variant: "destructive",
      })
    }
  }

  const handleDeleteImage = (index: number) => {
    const newImages = [...imagenes]
    newImages.splice(index, 1)
    setImagenes(newImages)
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      const firmaClienteData = sigClienteRef?.getTrimmedCanvas().toDataURL("image/png")
      const firmaEncargadoData = sigEncargadoRef?.getTrimmedCanvas().toDataURL("image/png")

      const inspeccionData = {
        vehiculo_id: vehiculoId,
        orden_id: ordenId,
        fecha: new Date().toISOString(),
        datos_inspeccion: formData,
        imagenes: imagenes,
        firma_cliente: firmaClienteData,
        firma_encargado: firmaEncargadoData,
      }

      // Verificar si ya existe una inspección para esta orden
      if (ordenId) {
        const { data: existingData, error: checkError } = await supabase
          .from("inspecciones_vehiculo")
          .select("id")
          .eq("orden_id", ordenId)
          .maybeSingle()

        if (checkError) throw checkError

        if (existingData) {
          // Actualizar inspección existente
          const { error: updateError } = await supabase
            .from("inspecciones_vehiculo")
            .update(inspeccionData)
            .eq("id", existingData.id)

          if (updateError) throw updateError
        } else {
          // Crear nueva inspección
          const { error: insertError } = await supabase.from("inspecciones_vehiculo").insert(inspeccionData)

          if (insertError) throw insertError
        }
      } else {
        // Crear nueva inspección sin orden asociada
        const { error: insertError } = await supabase.from("inspecciones_vehiculo").insert(inspeccionData)

        if (insertError) throw insertError
      }

      toast({
        title: "Inspección guardada",
        description: "La hoja de inspección se ha guardado correctamente",
      })

      if (onSave) {
        onSave(inspeccionData)
      }

      router.refresh()
    } catch (error) {
      console.error("Error al guardar inspección:", error)
      toast({
        title: "Error",
        description: "No se pudo guardar la hoja de inspección",
        // variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const exportToPDF = async () => {
    try {
      const doc = new jsPDF()
      const element = document.getElementById("hoja-inspeccion")
      if (!element) return

      // Título
      doc.setFontSize(18)
      doc.text("Hoja de Inspección de Vehículo", 14, 22)

      // Información del vehículo
      doc.setFontSize(12)
      doc.text(`Vehículo: ${vehiculo?.marca} ${vehiculo?.modelo} (${vehiculo?.placa})`, 14, 32)
      doc.text(`Cliente: ${cliente?.nombre} ${cliente?.apellido}`, 14, 40)
      doc.text(`Fecha: ${formData.fecha}`, 14, 48)
      doc.text(`Kilometraje: ${formData.kilometraje}`, 14, 56)

      // Capturar cada sección como imagen
      const sections = document.querySelectorAll(".pdf-section")
      let yPos = 65

      for (let i = 0; i < sections.length; i++) {
        const section = sections[i] as HTMLElement
        const canvas = await html2canvas(section)
        const imgData = canvas.toDataURL("image/png")

        // Ajustar tamaño para que quepa en la página
        const imgWidth = 180
        const imgHeight = (canvas.height * imgWidth) / canvas.width

        // Si la imagen no cabe en la página actual, crear una nueva
        if (yPos + imgHeight > 280) {
          doc.addPage()
          yPos = 20
        }

        doc.addImage(imgData, "PNG", 15, yPos, imgWidth, imgHeight)
        yPos += imgHeight + 10
      }

      // Agregar imágenes del vehículo
      if (imagenes.length > 0) {
        doc.addPage()
        doc.text("Imágenes del Vehículo", 14, 20)

        let imgX = 15
        let imgY = 30

        for (let i = 0; i < imagenes.length; i++) {
          // Agregar imagen (esto es simplificado, en la práctica necesitarías cargar la imagen primero)
          // doc.addImage(imagenes[i], "JPEG", imgX, imgY, 60, 45)

          imgX += 70
          if (imgX > 140) {
            imgX = 15
            imgY += 55
          }

          if (imgY > 230) {
            doc.addPage()
            imgY = 30
            imgX = 15
          }
        }
      }

      // Agregar firmas
      if (firmaCliente || firmaEncargado) {
        doc.addPage()
        doc.text("Firmas", 14, 20)

        if (firmaCliente) {
          doc.text("Firma del Cliente:", 14, 30)
          doc.addImage(firmaCliente, "PNG", 14, 35, 80, 40)
        }

        if (firmaEncargado) {
          doc.text("Firma del Encargado:", 105, 30)
          doc.addImage(firmaEncargado, "PNG", 105, 35, 80, 40)
        }
      }

      doc.save(`Inspeccion_${vehiculo?.placa || "Vehiculo"}.pdf`)

      toast({
        title: "PDF generado",
        description: "La hoja de inspección se ha exportado a PDF correctamente",
      })
    } catch (error) {
      console.error("Error al exportar a PDF:", error)
      toast({
        title: "Error",
        description: "No se pudo generar el PDF",
        // variant: "destructive",
      })
    }
  }

  const clearSignature = (type: "cliente" | "encargado") => {
    if (type === "cliente" && sigClienteRef) {
      sigClienteRef.clear()
      setFirmaCliente(null)
    } else if (type === "encargado" && sigEncargadoRef) {
      sigEncargadoRef.clear()
      setFirmaEncargado(null)
    }
  }

  return (
    <div className="container mx-auto py-6 space-y-6 overflow-auto" id="hoja-inspeccion">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Hoja de Inspección de Vehículo</h1>
        <div className="flex gap-2">
          {!readOnly && (
            <Button onClick={handleSave} disabled={isLoading}>
              <Save className="h-4 w-4 mr-2" />
              Guardar
            </Button>
          )}
          <Button onClick={exportToPDF} variant="outline">
            <FileDown className="h-4 w-4 mr-2" />
            Exportar PDF
          </Button>
        </div>
      </div>

      {vehiculo && (
        <Card>
          <CardHeader>
            <CardTitle>Información del Vehículo</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Vehículo</Label>
              <p className="font-medium">
                {vehiculo.marca} {vehiculo.modelo} ({vehiculo.anio})
              </p>
            </div>
            <div>
              <Label>Placa</Label>
              <p className="font-medium">{vehiculo.placa}</p>
            </div>
            <div>
              <Label>Color</Label>
              <p className="font-medium">{vehiculo.color}</p>
            </div>
            <div>
              <Label>Cliente</Label>
              <p className="font-medium">
                {cliente?.nombre} {cliente?.apellido}
              </p>
            </div>
            <div>
              <Label>Fecha</Label>
              <Input
                type="date"
                value={formData.fecha}
                onChange={(e) => handleSimpleInputChange("fecha", e.target.value)}
                disabled={readOnly}
              />
            </div>
            <div>
              <Label>Kilometraje</Label>
              <Input
                type="text"
                value={formData.kilometraje}
                onChange={(e) => handleSimpleInputChange("kilometraje", e.target.value)}
                disabled={readOnly}
                placeholder="Ej: 45,678"
              />
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="interiores" className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full">
          <TabsTrigger value="interiores">Interiores</TabsTrigger>
          <TabsTrigger value="exteriores">Exteriores</TabsTrigger>
          <TabsTrigger value="coqueta">Coqueta</TabsTrigger>
          <TabsTrigger value="motor">Motor</TabsTrigger>
          <TabsTrigger value="carroceria">Carrocería</TabsTrigger>
        </TabsList>

        <TabsContent value="interiores" className="pdf-section">
          <Card>
            <CardHeader className="bg-cyan-500 text-white">
              <CardTitle className="text-center">Interiores</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-4 gap-4 font-medium mb-4 text-center">
                <div>Descripción</div>
                <div>Cantidad</div>
                <div>Sí</div>
                <div>No</div>
              </div>
              <div className="space-y-4">
                {Object.entries(formData.interiores).map(([key, value]) => (
                  <div key={key} className="grid grid-cols-4 gap-4 items-center">
                    <div className="capitalize">{key.replace(/_/g, " ")}</div>
                    <div>
                      <Input
                        value={value.cantidad}
                        onChange={(e) => handleInputChange("interiores", key, "cantidad", e.target.value)}
                        disabled={readOnly}
                      />
                    </div>
                    <div className="flex justify-center">
                      <RadioGroup
                        value={value.si ? "si" : value.no ? "no" : ""}
                        onValueChange={(val) => handleRadioChange("interiores", key, val as "si" | "no")}
                        disabled={readOnly}
                        className="flex"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="si" id={`${key}-si`} />
                        </div>
                      </RadioGroup>
                    </div>
                    <div className="flex justify-center">
                      <RadioGroup
                        value={value.si ? "si" : value.no ? "no" : ""}
                        onValueChange={(val) => handleRadioChange("interiores", key, val as "si" | "no")}
                        disabled={readOnly}
                        className="flex"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no" id={`${key}-no`} />
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="exteriores" className="pdf-section">
          <Card>
            <CardHeader className="bg-cyan-500 text-white">
              <CardTitle className="text-center">Exteriores</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-4 gap-4 font-medium mb-4 text-center">
                <div>Descripción</div>
                <div>Cantidad</div>
                <div>Sí</div>
                <div>No</div>
              </div>
              <div className="space-y-4">
                {Object.entries(formData.exteriores).map(([key, value]) => (
                  <div key={key} className="grid grid-cols-4 gap-4 items-center">
                    <div className="capitalize">{key.replace(/_/g, " ")}</div>
                    <div>
                      <Input
                        value={value.cantidad}
                        onChange={(e) => handleInputChange("exteriores", key, "cantidad", e.target.value)}
                        disabled={readOnly}
                      />
                    </div>
                    <div className="flex justify-center">
                      <RadioGroup
                        value={value.si ? "si" : value.no ? "no" : ""}
                        onValueChange={(val) => handleRadioChange("exteriores", key, val as "si" | "no")}
                        disabled={readOnly}
                        className="flex"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="si" id={`${key}-si`} />
                        </div>
                      </RadioGroup>
                    </div>
                    <div className="flex justify-center">
                      <RadioGroup
                        value={value.si ? "si" : value.no ? "no" : ""}
                        onValueChange={(val) => handleRadioChange("exteriores", key, val as "si" | "no")}
                        disabled={readOnly}
                        className="flex"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no" id={`${key}-no`} />
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="coqueta" className="pdf-section">
          <Card>
            <CardHeader className="bg-cyan-500 text-white">
              <CardTitle className="text-center">Coqueta</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-4 gap-4 font-medium mb-4 text-center">
                <div>Descripción</div>
                <div>Cantidad</div>
                <div>Sí</div>
                <div>No</div>
              </div>
              <div className="space-y-4">
                {Object.entries(formData.coqueta).map(([key, value]) => (
                  <div key={key} className="grid grid-cols-4 gap-4 items-center">
                    <div className="capitalize">{key.replace(/_/g, " ")}</div>
                    <div>
                      <Input
                        value={value.cantidad}
                        onChange={(e) => handleInputChange("coqueta", key, "cantidad", e.target.value)}
                        disabled={readOnly}
                      />
                    </div>
                    <div className="flex justify-center">
                      <RadioGroup
                        value={value.si ? "si" : value.no ? "no" : ""}
                        onValueChange={(val) => handleRadioChange("coqueta", key, val as "si" | "no")}
                        disabled={readOnly}
                        className="flex"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="si" id={`${key}-si`} />
                        </div>
                      </RadioGroup>
                    </div>
                    <div className="flex justify-center">
                      <RadioGroup
                        value={value.si ? "si" : value.no ? "no" : ""}
                        onValueChange={(val) => handleRadioChange("coqueta", key, val as "si" | "no")}
                        disabled={readOnly}
                        className="flex"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no" id={`${key}-no`} />
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="motor" className="pdf-section">
          <Card>
            <CardHeader className="bg-cyan-500 text-white">
              <CardTitle className="text-center">Motor</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-4 gap-4 font-medium mb-4 text-center">
                <div>Descripción</div>
                <div>Cantidad</div>
                <div>Sí</div>
                <div>No</div>
              </div>
              <div className="space-y-4">
                {Object.entries(formData.motor).map(([key, value]) => (
                  <div key={key} className="grid grid-cols-4 gap-4 items-center">
                    <div className="capitalize">{key.replace(/_/g, " ")}</div>
                    <div>
                      <Input
                        value={value.cantidad}
                        onChange={(e) => handleInputChange("motor", key, "cantidad", e.target.value)}
                        disabled={readOnly}
                      />
                    </div>
                    <div className="flex justify-center">
                      <RadioGroup
                        value={value.si ? "si" : value.no ? "no" : ""}
                        onValueChange={(val) => handleRadioChange("motor", key, val as "si" | "no")}
                        disabled={readOnly}
                        className="flex"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="si" id={`${key}-si`} />
                        </div>
                      </RadioGroup>
                    </div>
                    <div className="flex justify-center">
                      <RadioGroup
                        value={value.si ? "si" : value.no ? "no" : ""}
                        onValueChange={(val) => handleRadioChange("motor", key, val as "si" | "no")}
                        disabled={readOnly}
                        className="flex"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no" id={`${key}-no`} />
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="carroceria" className="pdf-section">
          <Card>
            <CardHeader className="bg-cyan-500 text-white">
              <CardTitle className="text-center">Condiciones de Carrocería</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex flex-col items-center">
                    <div className="relative">
                      <img src="/car-front-side-diagram.png" alt="Vista frontal y lateral" className="w-full h-auto" />
                      {/* Aquí se implementaría un canvas interactivo para marcar daños */}
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex flex-col items-center">
                    <div className="relative">
                      <img src="/placeholder-lemyi.png" alt="Vista trasera y superior" className="w-full h-auto" />
                      {/* Aquí se implementaría un canvas interactivo para marcar daños */}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <Label htmlFor="nivel_gasolina">Medidor de Gasolina</Label>
                <div className="flex items-center mt-2 space-x-4">
                  <div className="relative w-64 h-32 border border-gray-300 rounded-md flex flex-col justify-end">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <img src="/fuel-gauge-icon.png" alt="Medidor de gasolina" className="h-16 w-16" />
                    </div>
                    <div className="flex justify-between w-full px-4 pb-2">
                      <div className="text-xs">E</div>
                      <div className="text-xs">1/4</div>
                      <div className="text-xs">1/2</div>
                      <div className="text-xs">3/4</div>
                      <div className="text-xs">F</div>
                    </div>
                  </div>
                  <Select
                    value={formData.nivel_gasolina}
                    onValueChange={(value) => handleSimpleInputChange("nivel_gasolina", value)}
                    disabled={readOnly}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Nivel" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vacio">Vacío</SelectItem>
                      <SelectItem value="1/4">1/4</SelectItem>
                      <SelectItem value="1/2">1/2</SelectItem>
                      <SelectItem value="3/4">3/4</SelectItem>
                      <SelectItem value="lleno">Lleno</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="mt-6">
                <Label htmlFor="comentarios">Comentarios</Label>
                <Textarea
                  id="comentarios"
                  value={formData.comentarios}
                  onChange={(e) => handleSimpleInputChange("comentarios", e.target.value)}
                  disabled={readOnly}
                  placeholder="Observaciones adicionales sobre el estado del vehículo..."
                  className="mt-2"
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="pdf-section">
        <CardHeader className="bg-cyan-500 text-white">
          <CardTitle className="text-center">Imágenes del Vehículo</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {!readOnly && (
            <div className="mb-6">
              <Label htmlFor="upload-images" className="cursor-pointer">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors">
                  <Camera className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    Haga clic para seleccionar imágenes o arrástrelas aquí
                  </p>
                </div>
                <Input
                  id="upload-images"
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={readOnly}
                />
              </Label>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {imagenes.map((imagen, index) => (
              <div key={index} className="relative group">
                <img
                  src={imagen || "/placeholder.svg"}
                  alt={`Imagen ${index + 1}`}
                  className="w-full h-40 object-cover rounded-md"
                />
                {!readOnly && (
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleDeleteImage(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pdf-section">
        <Card>
          <CardHeader className="bg-cyan-500 text-white">
            <CardTitle className="text-center">Firma del Cliente</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="border rounded-md p-2 h-40 bg-white">
              {!readOnly ? (
                <SignatureCanvas
                  ref={(ref) => setSigClienteRef(ref)}
                  canvasProps={{ className: "w-full h-full" }}
                  onEnd={() => setFirmaCliente(sigClienteRef?.toDataURL())}
                />
              ) : firmaCliente ? (
                <img
                  src={firmaCliente || "/placeholder.svg"}
                  alt="Firma del cliente"
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  No hay firma registrada
                </div>
              )}
            </div>
            {!readOnly && (
              <Button variant="outline" size="sm" className="mt-2" onClick={() => clearSignature("cliente")}>
                Limpiar
              </Button>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="bg-cyan-500 text-white">
            <CardTitle className="text-center">Firma del Encargado</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="border rounded-md p-2 h-40 bg-white">
              {!readOnly ? (
                <SignatureCanvas
                  ref={(ref) => setSigEncargadoRef(ref)}
                  canvasProps={{ className: "w-full h-full" }}
                  onEnd={() => setFirmaEncargado(sigEncargadoRef?.toDataURL())}
                />
              ) : firmaEncargado ? (
                <img
                  src={firmaEncargado || "/placeholder.svg"}
                  alt="Firma del encargado"
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  No hay firma registrada
                </div>
              )}
            </div>
            {!readOnly && (
              <Button variant="outline" size="sm" className="mt-2" onClick={() => clearSignature("encargado")}>
                Limpiar
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
