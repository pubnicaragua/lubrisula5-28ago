"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import {
  updateVehicleInspection,
  saveInspectionImages,
  saveInspectionSignatures,
} from "@/lib/actions/vehicle-inspections"
import type { VehicleInspection, InspectionItem } from "@/types/vehicle-inspection"
import { Camera, Save, Trash2, Upload, X } from "lucide-react"

interface InspeccionVehiculoFormProps {
  inspection: VehicleInspection
  vehicleId: string
  readOnly?: boolean
}

export function InspeccionVehiculoForm({ inspection, vehicleId, readOnly = false }: InspeccionVehiculoFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [inspectionData, setInspectionData] = useState<VehicleInspection>(inspection)
  const [activeTab, setActiveTab] = useState("interiores")
  const [uploadedImages, setUploadedImages] = useState<string[]>(inspection.images || [])
  const [isDrawing, setIsDrawing] = useState(false)
  const [isClientSigning, setIsClientSigning] = useState(false)
  const [isTechnicianSigning, setIsTechnicianSigning] = useState(false)

  const clientSignatureRef = useRef<HTMLCanvasElement>(null)
  const technicianSignatureRef = useRef<HTMLCanvasElement>(null)
  const clientSignatureCtxRef = useRef<CanvasRenderingContext2D | null>(null)
  const technicianSignatureCtxRef = useRef<CanvasRenderingContext2D | null>(null)

  // Referencias para los canvas de daños en la carrocería
  const frontViewRef = useRef<HTMLCanvasElement>(null)
  const sideLeftViewRef = useRef<HTMLCanvasElement>(null)
  const sideRightViewRef = useRef<HTMLCanvasElement>(null)
  const rearViewRef = useRef<HTMLCanvasElement>(null)
  const topViewRef = useRef<HTMLCanvasElement>(null)

  // Inicializar los canvas de firmas
  useEffect(() => {
    if (clientSignatureRef.current) {
      clientSignatureRef.current.width = clientSignatureRef.current.offsetWidth
      clientSignatureRef.current.height = clientSignatureRef.current.offsetHeight
      const ctx = clientSignatureRef.current.getContext("2d")
      if (ctx) {
        ctx.lineWidth = 2
        ctx.lineCap = "round"
        ctx.strokeStyle = "#000000"
        clientSignatureCtxRef.current = ctx
      }

      // Cargar firma del cliente si existe
      if (inspection.client_signature) {
        const img = new Image()
        img.onload = () => {
          if (clientSignatureCtxRef.current) {
            clientSignatureCtxRef.current.drawImage(img, 0, 0)
          }
        }
        img.src = inspection.client_signature
      }
    }

    if (technicianSignatureRef.current) {
      technicianSignatureRef.current.width = technicianSignatureRef.current.offsetWidth
      technicianSignatureRef.current.height = technicianSignatureRef.current.offsetHeight
      const ctx = technicianSignatureRef.current.getContext("2d")
      if (ctx) {
        ctx.lineWidth = 2
        ctx.lineCap = "round"
        ctx.strokeStyle = "#000000"
        technicianSignatureCtxRef.current = ctx
      }

      // Cargar firma del técnico si existe
      if (inspection.technician_signature) {
        const img = new Image()
        img.onload = () => {
          if (technicianSignatureCtxRef.current) {
            technicianSignatureCtxRef.current.drawImage(img, 0, 0)
          }
        }
        img.src = inspection.technician_signature
      }
    }
  }, [inspection.client_signature, inspection.technician_signature])

  // Inicializar los canvas de daños en la carrocería
  useEffect(() => {
    const canvasRefs = [frontViewRef, sideLeftViewRef, sideRightViewRef, rearViewRef, topViewRef]

    canvasRefs.forEach((ref) => {
      if (ref.current) {
        ref.current.width = ref.current.offsetWidth
        ref.current.height = ref.current.offsetHeight
        const ctx = ref.current.getContext("2d")
        if (ctx) {
          ctx.lineWidth = 2
          ctx.lineCap = "round"
          ctx.strokeStyle = "#ff0000"

          // Dibujar la imagen del carro
          const img = new Image()
          img.crossOrigin = "anonymous"
          img.onload = () => {
            if (ctx) {
              ctx.drawImage(img, 0, 0, ref.current!.width, ref.current!.height)
            }
          }

          // Asignar la imagen correspondiente según la vista
          if (ref === frontViewRef) {
            img.src = "/placeholder.svg?height=150&width=300"
          } else if (ref === sideLeftViewRef) {
            img.src = "/placeholder.svg?height=150&width=300"
          } else if (ref === sideRightViewRef) {
            img.src = "/placeholder.svg?height=150&width=300"
          } else if (ref === rearViewRef) {
            img.src = "/placeholder.svg?height=150&width=300"
          } else if (ref === topViewRef) {
            img.src = "/placeholder.svg?height=150&width=300"
          }
        }
      }
    })
  }, [])

  // Funciones para dibujar en los canvas de firmas
  const startDrawing = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>,
    isClient: boolean,
  ) => {
    setIsDrawing(true)
    const canvas = isClient ? clientSignatureRef.current : technicianSignatureRef.current
    const ctx = isClient ? clientSignatureCtxRef.current : technicianSignatureCtxRef.current

    if (canvas && ctx) {
      const rect = canvas.getBoundingClientRect()
      let x, y

      if ("touches" in e) {
        x = e.touches[0].clientX - rect.left
        y = e.touches[0].clientY - rect.top
      } else {
        x = e.clientX - rect.left
        y = e.clientY - rect.top
      }

      ctx.beginPath()
      ctx.moveTo(x, y)
    }
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>, isClient: boolean) => {
    if (!isDrawing) return

    const canvas = isClient ? clientSignatureRef.current : technicianSignatureRef.current
    const ctx = isClient ? clientSignatureCtxRef.current : technicianSignatureCtxRef.current

    if (canvas && ctx) {
      const rect = canvas.getBoundingClientRect()
      let x, y

      if ("touches" in e) {
        x = e.touches[0].clientX - rect.left
        y = e.touches[0].clientY - rect.top
      } else {
        x = e.clientX - rect.left
        y = e.clientY - rect.top
      }

      ctx.lineTo(x, y)
      ctx.stroke()
    }
  }

  const endDrawing = () => {
    setIsDrawing(false)
  }

  const clearSignature = (isClient: boolean) => {
    const canvas = isClient ? clientSignatureRef.current : technicianSignatureRef.current
    const ctx = isClient ? clientSignatureCtxRef.current : technicianSignatureCtxRef.current

    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
  }

  const saveSignatures = async () => {
    let clientSignatureData = null
    let technicianSignatureData = null

    if (clientSignatureRef.current) {
      clientSignatureData = clientSignatureRef.current.toDataURL()
    }

    if (technicianSignatureRef.current) {
      technicianSignatureData = technicianSignatureRef.current.toDataURL()
    }

    const result = await saveInspectionSignatures(inspection.id, clientSignatureData, technicianSignatureData)

    if (result.success) {
      toast({
        title: "Firmas guardadas",
        description: "Las firmas han sido guardadas correctamente",
      })

      setInspectionData({
        ...inspectionData,
        client_signature: clientSignatureData,
        technician_signature: technicianSignatureData,
      })
    } else {
      toast({
        title: "Error",
        description: "No se pudieron guardar las firmas",
        variant: "destructive",
      })
    }
  }

  // Función para manejar cambios en los items de inspección
  const handleItemChange = (
    sectionKey: "interior_items" | "exterior_items" | "engine_items" | "body_items",
    itemId: string,
    checked: boolean,
  ) => {
    const updatedItems = inspectionData[sectionKey].map((item) => (item.id === itemId ? { ...item, checked } : item))

    setInspectionData({
      ...inspectionData,
      [sectionKey]: updatedItems,
    })
  }

  // Función para manejar cambios en la cantidad de los items
  const handleQuantityChange = (
    sectionKey: "interior_items" | "exterior_items" | "engine_items" | "body_items",
    itemId: string,
    quantity: string,
  ) => {
    const updatedItems = inspectionData[sectionKey].map((item) => (item.id === itemId ? { ...item, quantity } : item))

    setInspectionData({
      ...inspectionData,
      [sectionKey]: updatedItems,
    })
  }

  // Función para manejar cambios en el nivel de combustible
  const handleFuelLevelChange = (level: number) => {
    setInspectionData({
      ...inspectionData,
      fuel_level: { level },
    })
  }

  // Función para manejar cambios en el kilometraje
  const handleMileageChange = (mileage: string) => {
    setInspectionData({
      ...inspectionData,
      mileage,
    })
  }

  // Función para manejar cambios en los comentarios
  const handleCommentsChange = (comments: string) => {
    setInspectionData({
      ...inspectionData,
      comments,
    })
  }

  // Función para subir imágenes
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newImages = [...uploadedImages]

      Array.from(e.target.files).forEach((file) => {
        const reader = new FileReader()
        reader.onload = (event) => {
          if (event.target && typeof event.target.result === "string") {
            newImages.push(event.target.result)
            setUploadedImages([...newImages])
          }
        }
        reader.readAsDataURL(file)
      })
    }
  }

  // Función para eliminar una imagen
  const handleRemoveImage = (index: number) => {
    const newImages = [...uploadedImages]
    newImages.splice(index, 1)
    setUploadedImages(newImages)
  }

  // Función para guardar las imágenes
  const handleSaveImages = async () => {
    const result = await saveInspectionImages(inspection.id, uploadedImages)

    if (result.success) {
      toast({
        title: "Imágenes guardadas",
        description: "Las imágenes han sido guardadas correctamente",
      })

      setInspectionData({
        ...inspectionData,
        images: uploadedImages,
      })
    } else {
      toast({
        title: "Error",
        description: "No se pudieron guardar las imágenes",
        variant: "destructive",
      })
    }
  }

  // Función para guardar la inspección
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const result = await updateVehicleInspection(inspection.id, {
        interior_items: inspectionData.interior_items,
        exterior_items: inspectionData.exterior_items,
        engine_items: inspectionData.engine_items,
        body_items: inspectionData.body_items,
        fuel_level: inspectionData.fuel_level,
        mileage: inspectionData.mileage,
        comments: inspectionData.comments,
        status: "completed",
      })

      if (result.success) {
        toast({
          title: "Inspección guardada",
          description: "La inspección ha sido guardada correctamente",
        })

        // Guardar imágenes si hay cambios
        if (JSON.stringify(uploadedImages) !== JSON.stringify(inspection.images)) {
          await handleSaveImages()
        }

        // Guardar firmas
        await saveSignatures()

        router.push(`/taller/vehiculos/${vehicleId}`)
      } else {
        toast({
          title: "Error",
          description: result.error || "No se pudo guardar la inspección",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error al guardar inspección:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error al guardar la inspección",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Renderizar sección de items
  const renderItemsSection = (
    title: string,
    items: InspectionItem[],
    sectionKey: "interior_items" | "exterior_items" | "engine_items" | "body_items",
  ) => {
    return (
      <Card className="mb-6">
        <CardHeader className="bg-cyan-500 text-white py-2">
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid grid-cols-4 gap-2 mb-2 text-sm font-medium">
            <div>Descripción</div>
            <div>Cantidad</div>
            <div className="text-center">Sí</div>
            <div className="text-center">No</div>
          </div>
          {items.map((item) => (
            <div key={item.id} className="grid grid-cols-4 gap-2 mb-2 items-center">
              <div>{item.description}</div>
              <div>
                <Input
                  type="text"
                  value={item.quantity || ""}
                  onChange={(e) => handleQuantityChange(sectionKey, item.id, e.target.value)}
                  disabled={readOnly}
                  className="h-8"
                />
              </div>
              <div className="flex justify-center">
                <RadioGroup
                  value={item.checked ? "yes" : "no"}
                  onValueChange={(value) => handleItemChange(sectionKey, item.id, value === "yes")}
                  disabled={readOnly}
                  className="flex"
                >
                  <div className="flex items-center">
                    <RadioGroupItem value="yes" id={`${item.id}-yes`} />
                  </div>
                </RadioGroup>
              </div>
              <div className="flex justify-center">
                <RadioGroup
                  value={item.checked ? "yes" : "no"}
                  onValueChange={(value) => handleItemChange(sectionKey, item.id, value === "yes")}
                  disabled={readOnly}
                  className="flex"
                >
                  <div className="flex items-center">
                    <RadioGroupItem value="no" id={`${item.id}-no`} />
                  </div>
                </RadioGroup>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  // Renderizar sección de nivel de combustible
  const renderFuelGauge = () => {
    const levels = [1, 2, 3, 4, 5, 6, 7, 8]
    const currentLevel = inspectionData.fuel_level.level

    return (
      <Card className="mb-6">
        <CardHeader className="bg-cyan-500 text-white py-2">
          <CardTitle className="text-lg">Medidor de gasolina</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="flex justify-between items-center">
            <div className="w-1/2">
              <div className="text-center mb-2">{currentLevel}/8</div>
              <div className="relative w-32 h-64 mx-auto border-2 border-gray-300 rounded-lg">
                <div
                  className="absolute bottom-0 left-0 right-0 bg-yellow-400 rounded-b-md transition-all"
                  style={{ height: `${(currentLevel / 8) * 100}%` }}
                ></div>
                <div className="absolute inset-0 flex flex-col justify-between p-2">
                  {levels.reverse().map((level) => (
                    <div key={level} className="flex items-center">
                      <div className="w-4 h-0.5 bg-gray-400"></div>
                      <span className="ml-2 text-xs">{level}</span>
                    </div>
                  ))}
                </div>
                <div className="absolute -right-12 top-1/2 transform -translate-y-1/2">
                  <div className="w-10 h-16">
                    <svg viewBox="0 0 24 24" className="w-full h-full">
                      <path
                        fill="currentColor"
                        d="M12,1C5.92,1 1,5.92 1,12C1,18.08 5.92,23 12,23C18.08,23 23,18.08 23,12C23,5.92 18.08,1 12,1M12,3C16.97,3 21,7.03 21,12C21,16.97 16.97,21 12,21C7.03,21 3,16.97 3,12C3,7.03 7.03,3 12,3M12,5C7.03,5 3,9.03 3,14H5C5,10.13 8.13,7 12,7C15.87,7 19,10.13 19,14H21C21,9.03 16.97,5 12,5Z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-1/2">
              <div className="flex flex-col space-y-2">
                {levels.map((level) => (
                  <Button
                    key={level}
                    type="button"
                    variant={currentLevel === level ? "default" : "outline"}
                    onClick={() => handleFuelLevelChange(level)}
                    disabled={readOnly}
                    className={`w-full ${currentLevel === level ? "bg-blue-500" : ""}`}
                  >
                    {level}/8
                  </Button>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-4">
            <Label htmlFor="mileage">Kilometraje</Label>
            <Input
              id="mileage"
              type="text"
              value={inspectionData.mileage || ""}
              onChange={(e) => handleMileageChange(e.target.value)}
              disabled={readOnly}
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>
    )
  }

  // Renderizar sección de condiciones de carrocería
  const renderBodyConditions = () => {
    return (
      <Card className="mb-6">
        <CardHeader className="bg-cyan-500 text-white py-2">
          <CardTitle className="text-lg">Condiciones de carrocería</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label className="mb-2 block">Vista frontal</Label>
              <canvas
                ref={frontViewRef}
                width={300}
                height={150}
                className="border border-gray-300 rounded-md w-full h-auto"
              />
            </div>
            <div>
              <Label className="mb-2 block">Vista lateral izquierda</Label>
              <canvas
                ref={sideLeftViewRef}
                width={300}
                height={150}
                className="border border-gray-300 rounded-md w-full h-auto"
              />
            </div>
            <div>
              <Label className="mb-2 block">Vista lateral derecha</Label>
              <canvas
                ref={sideRightViewRef}
                width={300}
                height={150}
                className="border border-gray-300 rounded-md w-full h-auto"
              />
            </div>
            <div>
              <Label className="mb-2 block">Vista trasera</Label>
              <canvas
                ref={rearViewRef}
                width={300}
                height={150}
                className="border border-gray-300 rounded-md w-full h-auto"
              />
            </div>
            <div>
              <Label className="mb-2 block">Vista superior</Label>
              <canvas
                ref={topViewRef}
                width={300}
                height={150}
                className="border border-gray-300 rounded-md w-full h-auto"
              />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-muted-foreground">
              Haga clic en las imágenes para marcar los daños en la carrocería.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Renderizar sección de imágenes
  const renderImages = () => {
    return (
      <Card className="mb-6">
        <CardHeader className="bg-cyan-500 text-white py-2">
          <CardTitle className="text-lg">Imágenes Cliente</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center">
              <Camera className="h-12 w-12 text-gray-400 mb-2" />
              <p className="text-sm text-center text-gray-500 mb-4">Selecciona imágenes o arrástralas aquí.</p>
              <input
                type="file"
                id="image-upload"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                disabled={readOnly}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById("image-upload")?.click()}
                disabled={readOnly}
              >
                <Upload className="mr-2 h-4 w-4" />
                Subir imágenes
              </Button>
            </div>
            <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center">
              <Camera className="h-12 w-12 text-gray-400 mb-2" />
              <p className="text-sm text-center text-gray-500 mb-4">Tomar foto con la cámara.</p>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  // Aquí iría la lógica para tomar una foto con la cámara
                  alert("Funcionalidad de cámara no implementada")
                }}
                disabled={readOnly}
              >
                <Camera className="mr-2 h-4 w-4" />
                Tomar foto
              </Button>
            </div>
          </div>

          {uploadedImages.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-2">Imágenes cargadas</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                {uploadedImages.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`Imagen ${index + 1}`}
                      className="w-full h-24 object-cover rounded-md"
                    />
                    {!readOnly && (
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {!readOnly && (
                <div className="mt-4 flex justify-end">
                  <Button type="button" onClick={handleSaveImages} disabled={isSubmitting}>
                    <Save className="mr-2 h-4 w-4" />
                    Guardar imágenes
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  // Renderizar sección de firmas
  const renderSignatures = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader className="bg-cyan-500 text-white py-2">
            <CardTitle className="text-lg">Firma del Cliente</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="border border-gray-300 rounded-md p-2 mb-4">
              <canvas
                ref={clientSignatureRef}
                width={400}
                height={200}
                className="w-full h-40 border border-gray-200 touch-none"
                onMouseDown={(e) => !readOnly && startDrawing(e, true)}
                onMouseMove={(e) => !readOnly && draw(e, true)}
                onMouseUp={() => !readOnly && endDrawing()}
                onMouseLeave={() => !readOnly && endDrawing()}
                onTouchStart={(e) => !readOnly && startDrawing(e, true)}
                onTouchMove={(e) => !readOnly && draw(e, true)}
                onTouchEnd={() => !readOnly && endDrawing()}
              />
            </div>
            {!readOnly && (
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => clearSignature(true)}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Borrar
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="bg-cyan-500 text-white py-2">
            <CardTitle className="text-lg">Firma del Encargado</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="border border-gray-300 rounded-md p-2 mb-4">
              <canvas
                ref={technicianSignatureRef}
                width={400}
                height={200}
                className="w-full h-40 border border-gray-200 touch-none"
                onMouseDown={(e) => !readOnly && startDrawing(e, false)}
                onMouseMove={(e) => !readOnly && draw(e, false)}
                onMouseUp={() => !readOnly && endDrawing()}
                onMouseLeave={() => !readOnly && endDrawing()}
                onTouchStart={(e) => !readOnly && startDrawing(e, false)}
                onTouchMove={(e) => !readOnly && draw(e, false)}
                onTouchEnd={() => !readOnly && endDrawing()}
              />
            </div>
            {!readOnly && (
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => clearSignature(false)}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Borrar
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  // Renderizar sección de comentarios
  const renderComments = () => {
    return (
      <Card className="mb-6">
        <CardHeader className="bg-cyan-500 text-white py-2">
          <CardTitle className="text-lg">Comentarios</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <Textarea
            value={inspectionData.comments || ""}
            onChange={(e) => handleCommentsChange(e.target.value)}
            disabled={readOnly}
            placeholder="Ingrese comentarios adicionales sobre el estado del vehículo..."
            className="min-h-[100px]"
          />
        </CardContent>
      </Card>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold">
          {readOnly ? "Ver Inspección de Vehículo" : "Formulario de Inspección de Vehículo"}
        </h1>
        {!readOnly && (
          <div className="flex space-x-2">
            <Button type="button" variant="outline" onClick={() => router.push(`/taller/vehiculos/${vehicleId}`)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : "Guardar Inspección"}
            </Button>
          </div>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
          <TabsTrigger value="interiores">Interiores</TabsTrigger>
          <TabsTrigger value="exteriores">Exteriores</TabsTrigger>
          <TabsTrigger value="motor">Motor</TabsTrigger>
          <TabsTrigger value="combustible">Combustible</TabsTrigger>
          <TabsTrigger value="carroceria">Carrocería</TabsTrigger>
          <TabsTrigger value="imagenes">Imágenes</TabsTrigger>
        </TabsList>

        <TabsContent value="interiores" className="mt-4">
          {renderItemsSection("Interiores", inspectionData.interior_items, "interior_items")}
        </TabsContent>

        <TabsContent value="exteriores" className="mt-4">
          {renderItemsSection("Exteriores", inspectionData.exterior_items, "exterior_items")}
        </TabsContent>

        <TabsContent value="motor" className="mt-4">
          {renderItemsSection("Motor", inspectionData.engine_items, "engine_items")}
        </TabsContent>

        <TabsContent value="combustible" className="mt-4">
          {renderFuelGauge()}
        </TabsContent>

        <TabsContent value="carroceria" className="mt-4">
          {renderBodyConditions()}
        </TabsContent>

        <TabsContent value="imagenes" className="mt-4">
          {renderImages()}
        </TabsContent>
      </Tabs>

      {renderComments()}
      {renderSignatures()}

      {!readOnly && (
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={() => router.push(`/taller/vehiculos/${vehicleId}`)}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Guardando..." : "Guardar Inspección"}
          </Button>
        </div>
      )}
    </form>
  )
}
