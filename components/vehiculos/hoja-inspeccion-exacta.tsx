"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Save, Printer, FileDown } from "lucide-react"
import html2canvas from "html2canvas"
import { jsPDF } from "jspdf"

interface HojaInspeccionExactaProps {
  vehiculoId?: string
  ordenId?: string
  readOnly?: boolean
  onSave?: (data: any) => void
}

export function HojaInspeccionExacta({ vehiculoId, ordenId, readOnly = false, onSave }: HojaInspeccionExactaProps) {
  const supabase = createClientComponentClient()
  const { toast } = useToast()
  const router = useRouter()
  const formRef = useRef<HTMLDivElement>(null)

  const [isLoading, setIsLoading] = useState(false)
  const [vehiculo, setVehiculo] = useState<any>(null)
  const [cliente, setCliente] = useState<any>(null)
  const [formData, setFormData] = useState({
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
      latero: { cantidad: "", si: false, no: false },
      otro: { cantidad: "", si: false, no: false },
    },
    motor: {
      bateria: { cantidad: "", si: false, no: false },
      computadora: { cantidad: "", si: false, no: false },
      tapones_deposito: { cantidad: "", si: false, no: false },
    },
    nivel_gasolina: "1/4",
    comentarios: "",
    carroceria_danios: [],
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
        .from("vehiculos")
        .select("*, cliente:cliente_id(*)")
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
        variant: "destructive",
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
      }
    } catch (error) {
      console.error("Error al cargar inspección:", error)
      toast({
        title: "Error",
        description: "No se pudo cargar la inspección existente",
        variant: "destructive",
      })
    }
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

  const handleInputChange = (section: string, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: {
          ...prev[section][field],
          cantidad: value,
        },
      },
    }))
  }

  const handleNivelGasolinaChange = (nivel: string) => {
    setFormData((prev) => ({
      ...prev,
      nivel_gasolina: nivel,
    }))
  }

  const handleComentariosChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      comentarios: value,
    }))
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      const inspeccionData = {
        vehiculo_id: vehiculoId,
        orden_id: ordenId,
        fecha: new Date().toISOString(),
        datos_inspeccion: formData,
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
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const exportToPDF = async () => {
    if (!formRef.current) return

    try {
      const canvas = await html2canvas(formRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
      })

      const imgData = canvas.toDataURL("image/png")
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      })

      const imgWidth = 210
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight)
      pdf.save(`Inspeccion_${vehiculo?.placa || "Vehiculo"}.pdf`)

      toast({
        title: "PDF generado",
        description: "La hoja de inspección se ha exportado a PDF correctamente",
      })
    } catch (error) {
      console.error("Error al exportar a PDF:", error)
      toast({
        title: "Error",
        description: "No se pudo generar el PDF",
        variant: "destructive",
      })
    }
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Hoja de Inspección de Vehículo</h1>
        <div className="flex gap-2">
          {!readOnly && (
            <Button onClick={handleSave} disabled={isLoading}>
              <Save className="h-4 w-4 mr-2" />
              Guardar
            </Button>
          )}
          <Button onClick={handlePrint} variant="outline">
            <Printer className="h-4 w-4 mr-2" />
            Imprimir
          </Button>
          <Button onClick={exportToPDF} variant="outline">
            <FileDown className="h-4 w-4 mr-2" />
            PDF
          </Button>
        </div>
      </div>

      {vehiculo && (
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Información del Vehículo</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-md">
            <div>
              <span className="font-medium">Vehículo:</span> {vehiculo.marca} {vehiculo.modelo} ({vehiculo.anio})
            </div>
            <div>
              <span className="font-medium">Placa:</span> {vehiculo.placa}
            </div>
            <div>
              <span className="font-medium">Color:</span> {vehiculo.color}
            </div>
            <div>
              <span className="font-medium">Cliente:</span> {cliente?.nombre} {cliente?.apellido}
            </div>
            <div>
              <span className="font-medium">Fecha:</span> {new Date().toLocaleDateString()}
            </div>
          </div>
        </div>
      )}

      <div ref={formRef} className="space-y-4 print:text-sm">
        {/* Secciones principales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Interiores */}
          <div className="border rounded-md overflow-hidden">
            <div className="bg-cyan-500 text-white font-bold py-1 px-2 text-center">Interiores</div>
            <div className="p-2">
              <div className="grid grid-cols-4 gap-2 text-sm font-medium mb-2">
                <div>Descripción</div>
                <div>Cantidad</div>
                <div className="text-center">Sí</div>
                <div className="text-center">No</div>
              </div>
              <div className="space-y-2">
                {Object.entries(formData.interiores).map(([key, value]) => (
                  <div key={key} className="grid grid-cols-4 gap-2 items-center">
                    <div className="text-sm">{key.replace(/_/g, " ")}</div>
                    <div>
                      <Input
                        className="h-8 text-sm"
                        value={value.cantidad}
                        onChange={(e) => handleInputChange("interiores", key, e.target.value)}
                        disabled={readOnly}
                      />
                    </div>
                    <div className="flex justify-center">
                      <input
                        type="radio"
                        checked={value.si}
                        onChange={() => handleRadioChange("interiores", key, "si")}
                        disabled={readOnly}
                        className="h-4 w-4"
                      />
                    </div>
                    <div className="flex justify-center">
                      <input
                        type="radio"
                        checked={value.no}
                        onChange={() => handleRadioChange("interiores", key, "no")}
                        disabled={readOnly}
                        className="h-4 w-4"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Exteriores */}
          <div className="border rounded-md overflow-hidden">
            <div className="bg-cyan-500 text-white font-bold py-1 px-2 text-center">Exteriores</div>
            <div className="p-2">
              <div className="grid grid-cols-4 gap-2 text-sm font-medium mb-2">
                <div>Descripción</div>
                <div>Cantidad</div>
                <div className="text-center">Sí</div>
                <div className="text-center">No</div>
              </div>
              <div className="space-y-2">
                {Object.entries(formData.exteriores).map(([key, value]) => (
                  <div key={key} className="grid grid-cols-4 gap-2 items-center">
                    <div className="text-sm">{key.replace(/_/g, " ")}</div>
                    <div>
                      <Input
                        className="h-8 text-sm"
                        value={value.cantidad}
                        onChange={(e) => handleInputChange("exteriores", key, e.target.value)}
                        disabled={readOnly}
                      />
                    </div>
                    <div className="flex justify-center">
                      <input
                        type="radio"
                        checked={value.si}
                        onChange={() => handleRadioChange("exteriores", key, "si")}
                        disabled={readOnly}
                        className="h-4 w-4"
                      />
                    </div>
                    <div className="flex justify-center">
                      <input
                        type="radio"
                        checked={value.no}
                        onChange={() => handleRadioChange("exteriores", key, "no")}
                        disabled={readOnly}
                        className="h-4 w-4"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Medidor de gasolina */}
          <div className="border rounded-md overflow-hidden">
            <div className="bg-cyan-500 text-white font-bold py-1 px-2 text-center">Medidor de gasolina</div>
            <div className="p-2 flex flex-col items-center justify-center h-full">
              <div className="relative w-full h-40 flex flex-col items-center justify-center">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-32 w-4 bg-gray-200 rounded-full relative overflow-hidden">
                    <div
                      className={`absolute bottom-0 w-full rounded-b-full transition-all duration-300 ${
                        formData.nivel_gasolina === "vacio"
                          ? "h-0 bg-red-500"
                          : formData.nivel_gasolina === "1/4"
                            ? "h-1/4 bg-red-500"
                            : formData.nivel_gasolina === "1/2"
                              ? "h-1/2 bg-yellow-500"
                              : formData.nivel_gasolina === "3/4"
                                ? "h-3/4 bg-blue-500"
                                : "h-full bg-green-500"
                      }`}
                    ></div>
                  </div>
                  <div className="ml-4">
                    <div className="flex flex-col space-y-2">
                      <div
                        className={`w-16 h-6 flex items-center justify-center text-xs text-white rounded ${
                          formData.nivel_gasolina === "lleno" ? "bg-blue-600" : "bg-gray-300"
                        }`}
                        onClick={() => handleNivelGasolinaChange("lleno")}
                      >
                        1/1
                      </div>
                      <div
                        className={`w-16 h-6 flex items-center justify-center text-xs text-white rounded ${
                          formData.nivel_gasolina === "3/4" ? "bg-blue-500" : "bg-gray-300"
                        }`}
                        onClick={() => handleNivelGasolinaChange("3/4")}
                      >
                        3/4
                      </div>
                      <div
                        className={`w-16 h-6 flex items-center justify-center text-xs text-white rounded ${
                          formData.nivel_gasolina === "1/2" ? "bg-yellow-500" : "bg-gray-300"
                        }`}
                        onClick={() => handleNivelGasolinaChange("1/2")}
                      >
                        1/2
                      </div>
                      <div
                        className={`w-16 h-6 flex items-center justify-center text-xs text-white rounded ${
                          formData.nivel_gasolina === "1/4" ? "bg-red-500" : "bg-gray-300"
                        }`}
                        onClick={() => handleNivelGasolinaChange("1/4")}
                      >
                        1/4
                      </div>
                      <div
                        className={`w-16 h-6 flex items-center justify-center text-xs text-white rounded ${
                          formData.nivel_gasolina === "vacio" ? "bg-red-600" : "bg-gray-300"
                        }`}
                        onClick={() => handleNivelGasolinaChange("vacio")}
                      >
                        E
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Coqueta */}
        <div className="border rounded-md overflow-hidden">
          <div className="bg-cyan-500 text-white font-bold py-1 px-2 text-center">Coqueta</div>
          <div className="p-2">
            <div className="grid grid-cols-8 gap-2 text-sm font-medium mb-2">
              <div className="col-span-2">Descripción</div>
              <div className="col-span-2">Cantidad</div>
              <div className="text-center">Sí</div>
              <div className="text-center">No</div>
              <div className="col-span-2"></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                {Object.entries(formData.coqueta)
                  .slice(0, 4)
                  .map(([key, value]) => (
                    <div key={key} className="grid grid-cols-4 gap-2 items-center">
                      <div className="text-sm">{key.replace(/_/g, " ")}</div>
                      <div>
                        <Input
                          className="h-8 text-sm"
                          value={value.cantidad}
                          onChange={(e) => handleInputChange("coqueta", key, e.target.value)}
                          disabled={readOnly}
                        />
                      </div>
                      <div className="flex justify-center">
                        <input
                          type="radio"
                          checked={value.si}
                          onChange={() => handleRadioChange("coqueta", key, "si")}
                          disabled={readOnly}
                          className="h-4 w-4"
                        />
                      </div>
                      <div className="flex justify-center">
                        <input
                          type="radio"
                          checked={value.no}
                          onChange={() => handleRadioChange("coqueta", key, "no")}
                          disabled={readOnly}
                          className="h-4 w-4"
                        />
                      </div>
                    </div>
                  ))}
              </div>
              <div className="space-y-2">
                {Object.entries(formData.coqueta)
                  .slice(4)
                  .map(([key, value]) => (
                    <div key={key} className="grid grid-cols-4 gap-2 items-center">
                      <div className="text-sm">{key.replace(/_/g, " ")}</div>
                      <div>
                        <Input
                          className="h-8 text-sm"
                          value={value.cantidad}
                          onChange={(e) => handleInputChange("coqueta", key, e.target.value)}
                          disabled={readOnly}
                        />
                      </div>
                      <div className="flex justify-center">
                        <input
                          type="radio"
                          checked={value.si}
                          onChange={() => handleRadioChange("coqueta", key, "si")}
                          disabled={readOnly}
                          className="h-4 w-4"
                        />
                      </div>
                      <div className="flex justify-center">
                        <input
                          type="radio"
                          checked={value.no}
                          onChange={() => handleRadioChange("coqueta", key, "no")}
                          disabled={readOnly}
                          className="h-4 w-4"
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* Motor */}
        <div className="border rounded-md overflow-hidden">
          <div className="bg-cyan-500 text-white font-bold py-1 px-2 text-center">Motor</div>
          <div className="p-2">
            <div className="grid grid-cols-4 gap-2 text-sm font-medium mb-2">
              <div>Descripción</div>
              <div>Cantidad</div>
              <div className="text-center">Sí</div>
              <div className="text-center">No</div>
            </div>
            <div className="space-y-2">
              {Object.entries(formData.motor).map(([key, value]) => (
                <div key={key} className="grid grid-cols-4 gap-2 items-center">
                  <div className="text-sm">{key.replace(/_/g, " ")}</div>
                  <div>
                    <Input
                      className="h-8 text-sm"
                      value={value.cantidad}
                      onChange={(e) => handleInputChange("motor", key, e.target.value)}
                      disabled={readOnly}
                    />
                  </div>
                  <div className="flex justify-center">
                    <input
                      type="radio"
                      checked={value.si}
                      onChange={() => handleRadioChange("motor", key, "si")}
                      disabled={readOnly}
                      className="h-4 w-4"
                    />
                  </div>
                  <div className="flex justify-center">
                    <input
                      type="radio"
                      checked={value.no}
                      onChange={() => handleRadioChange("motor", key, "no")}
                      disabled={readOnly}
                      className="h-4 w-4"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Comentarios */}
        <div className="border rounded-md overflow-hidden">
          <div className="bg-cyan-500 text-white font-bold py-1 px-2 text-center">Comentarios</div>
          <div className="p-2">
            <Textarea
              className="min-h-[100px]"
              value={formData.comentarios}
              onChange={(e) => handleComentariosChange(e.target.value)}
              disabled={readOnly}
              placeholder="Observaciones adicionales sobre el estado del vehículo..."
            />
          </div>
        </div>

        {/* Condiciones de carrocería */}
        <div className="border rounded-md overflow-hidden">
          <div className="bg-cyan-500 text-white font-bold py-1 px-2 text-center">Condiciones de carrocería</div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <img
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/car-front-side-diagram-JfS7l6ZlsiKwB12U1wYfE7FrnBxzYv.png"
                      alt="Vista frontal y lateral"
                      className="w-full h-auto"
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <img
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/fuel-gauge-icon-eEICo4DrO0UWOTaucXS6F7WvcQODi5.png"
                      alt="Vista trasera y superior"
                      className="w-full h-auto"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Firmas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          <div className="border-t-2 border-gray-300 pt-2">
            <div className="text-center font-medium">Firma del Cliente</div>
          </div>
          <div className="border-t-2 border-gray-300 pt-2">
            <div className="text-center font-medium">Firma del Encargado</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HojaInspeccionExacta
