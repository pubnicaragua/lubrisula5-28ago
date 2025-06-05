"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useToast } from "@/hooks/use-toast"
import { Save, Printer, FileDown } from "lucide-react"
import html2canvas from "html2canvas"
import { jsPDF } from "jspdf"

interface HojaIngresoProps {
  vehiculoId?: string
  onSave?: () => void
  onCancel?: () => void
}

export function HojaIngreso({ vehiculoId, onSave, onCancel }: HojaIngresoProps) {
  const supabase = createClientComponentClient()
  const { toast } = useToast()
  const formRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [vehiculoData, setVehiculoData] = useState<any>(null)

  // Estado para cada sección de la hoja de ingreso
  const [interiores, setInteriores] = useState({
    documentos: { cantidad: "", si: false, no: false },
    radio: { cantidad: "", si: false, no: false },
    portafusil: { cantidad: "", si: false, no: false },
    encendedor: { cantidad: "", si: false, no: false },
    tapetes_tela: { cantidad: "", si: false, no: false },
    tapetes_plastico: { cantidad: "", si: false, no: false },
    medidor_gasolina: { cantidad: "", si: false, no: false },
    kilometraje: { cantidad: "", si: false, no: false },
  })

  const [exteriores, setExteriores] = useState({
    antena: { cantidad: "", si: false, no: false },
    falanges: { cantidad: "", si: false, no: false },
    centro_rin: { cantidad: "", si: false, no: false },
    placas: { cantidad: "", si: false, no: false },
  })

  const [coqueta, setCoqueta] = useState({
    herramienta: { cantidad: "", si: false, no: false },
    reflejantes: { cantidad: "", si: false, no: false },
    cables_corriente: { cantidad: "", si: false, no: false },
    llanta_refaccion: { cantidad: "", si: false, no: false },
    llave_cruceta: { cantidad: "", si: false, no: false },
    gato: { cantidad: "", si: false, no: false },
    latero: { cantidad: "", si: false, no: false },
    otro: { cantidad: "", si: false, no: false },
  })

  const [motor, setMotor] = useState({
    bateria: { cantidad: "", si: false, no: false },
    computadora: { cantidad: "", si: false, no: false },
    tapones_deposito: { cantidad: "", si: false, no: false },
  })

  const [nivelGasolina, setNivelGasolina] = useState("1/4")
  const [comentarios, setComentarios] = useState("")

  // Cargar datos del vehículo si se proporciona un ID
  useEffect(() => {
    if (vehiculoId) {
      fetchVehiculoData()
    }
  }, [vehiculoId])

  const fetchVehiculoData = async () => {
    try {
      const { data, error } = await supabase
        .from("vehiculos")
        .select("*, cliente:cliente_id(*)")
        .eq("id", vehiculoId)
        .single()

      if (error) throw error
      setVehiculoData(data)

      // Verificar si ya existe una inspección para este vehículo
      const { data: inspeccionData, error: inspeccionError } = await supabase
        .from("inspecciones_vehiculo")
        .select("*")
        .eq("vehiculo_id", vehiculoId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle()

      if (inspeccionError && inspeccionError.code !== "PGRST116") throw inspeccionError

      if (inspeccionData) {
        // Cargar datos de inspección existente
        const { datos_inspeccion } = inspeccionData
        if (datos_inspeccion) {
          setInteriores(datos_inspeccion.interiores || interiores)
          setExteriores(datos_inspeccion.exteriores || exteriores)
          setCoqueta(datos_inspeccion.coqueta || coqueta)
          setMotor(datos_inspeccion.motor || motor)
          setNivelGasolina(datos_inspeccion.nivel_gasolina || "1/4")
          setComentarios(datos_inspeccion.comentarios || "")
        }
      }
    } catch (error) {
      console.error("Error al cargar datos del vehículo:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos del vehículo",
        variant: "destructive",
      })
    }
  }

  const handleInteriorChange = (field: string, type: "cantidad" | "si" | "no", value: any) => {
    setInteriores((prev) => ({
      ...prev,
      [field]: {
        ...prev[field as keyof typeof prev],
        [type]: type === "cantidad" ? value : true,
        ...(type !== "cantidad" && type === "si" ? { no: false } : type === "no" ? { si: false } : {}),
      },
    }))
  }

  const handleExteriorChange = (field: string, type: "cantidad" | "si" | "no", value: any) => {
    setExteriores((prev) => ({
      ...prev,
      [field]: {
        ...prev[field as keyof typeof prev],
        [type]: type === "cantidad" ? value : true,
        ...(type !== "cantidad" && type === "si" ? { no: false } : type === "no" ? { si: false } : {}),
      },
    }))
  }

  const handleCoquetaChange = (field: string, type: "cantidad" | "si" | "no", value: any) => {
    setCoqueta((prev) => ({
      ...prev,
      [field]: {
        ...prev[field as keyof typeof prev],
        [type]: type === "cantidad" ? value : true,
        ...(type !== "cantidad" && type === "si" ? { no: false } : type === "no" ? { si: false } : {}),
      },
    }))
  }

  const handleMotorChange = (field: string, type: "cantidad" | "si" | "no", value: any) => {
    setMotor((prev) => ({
      ...prev,
      [field]: {
        ...prev[field as keyof typeof prev],
        [type]: type === "cantidad" ? value : true,
        ...(type !== "cantidad" && type === "si" ? { no: false } : type === "no" ? { si: false } : {}),
      },
    }))
  }

  const handleSave = async () => {
    if (!vehiculoId) {
      toast({
        title: "Error",
        description: "No se ha seleccionado un vehículo",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const inspeccionData = {
        vehiculo_id: vehiculoId,
        fecha: new Date().toISOString(),
        datos_inspeccion: {
          interiores,
          exteriores,
          coqueta,
          motor,
          nivel_gasolina: nivelGasolina,
          comentarios,
        },
      }

      const { data, error } = await supabase.from("inspecciones_vehiculo").insert([inspeccionData]).select()

      if (error) throw error

      toast({
        title: "Éxito",
        description: "Hoja de ingreso guardada correctamente",
      })

      if (onSave) onSave()
    } catch (error) {
      console.error("Error al guardar la hoja de ingreso:", error)
      toast({
        title: "Error",
        description: "No se pudo guardar la hoja de ingreso",
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
      pdf.save(`Inspeccion_${vehiculoData?.placa || "Vehiculo"}.pdf`)

      toast({
        title: "PDF generado",
        description: "La hoja de ingreso se ha exportado a PDF correctamente",
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
    <div className="container mx-auto py-4 space-y-4 print:py-0">
      <div className="flex justify-between items-center print:hidden">
        <h1 className="text-2xl font-bold">Hoja de Ingreso de Vehículo</h1>
        <div className="flex gap-2">
          <Button onClick={handleSave} disabled={isLoading}>
            <Save className="h-4 w-4 mr-2" />
            Guardar
          </Button>
          <Button onClick={handlePrint} variant="outline">
            <Printer className="h-4 w-4 mr-2" />
            Imprimir
          </Button>
          <Button onClick={exportToPDF} variant="outline">
            <FileDown className="h-4 w-4 mr-2" />
            PDF
          </Button>
          {onCancel && (
            <Button onClick={onCancel} variant="outline">
              Cancelar
            </Button>
          )}
        </div>
      </div>

      {vehiculoData && (
        <div className="mb-4 print:mb-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-md print:text-sm print:p-2">
            <div>
              <span className="font-medium">Vehículo:</span> {vehiculoData.marca} {vehiculoData.modelo} (
              {vehiculoData.anio})
            </div>
            <div>
              <span className="font-medium">Placa:</span> {vehiculoData.placa}
            </div>
            <div>
              <span className="font-medium">Color:</span> {vehiculoData.color}
            </div>
            <div>
              <span className="font-medium">Cliente:</span> {vehiculoData.cliente?.nombre}{" "}
              {vehiculoData.cliente?.apellido}
            </div>
            <div>
              <span className="font-medium">Fecha:</span> {new Date().toLocaleDateString()}
            </div>
          </div>
        </div>
      )}

      <div ref={formRef} className="space-y-4 print:space-y-2 print:text-sm">
        {/* Secciones principales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 print:gap-2">
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
                {Object.entries(interiores).map(([key, value]) => (
                  <div key={key} className="grid grid-cols-4 gap-2 items-center">
                    <div className="text-sm">{key.replace(/_/g, " ")}</div>
                    <div>
                      <Input
                        className="h-8 text-sm"
                        value={value.cantidad}
                        onChange={(e) => handleInteriorChange(key, "cantidad", e.target.value)}
                      />
                    </div>
                    <div className="flex justify-center">
                      <input
                        type="radio"
                        checked={value.si}
                        onChange={() => handleInteriorChange(key, "si", true)}
                        className="h-4 w-4"
                      />
                    </div>
                    <div className="flex justify-center">
                      <input
                        type="radio"
                        checked={value.no}
                        onChange={() => handleInteriorChange(key, "no", true)}
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
                {Object.entries(exteriores).map(([key, value]) => (
                  <div key={key} className="grid grid-cols-4 gap-2 items-center">
                    <div className="text-sm">{key.replace(/_/g, " ")}</div>
                    <div>
                      <Input
                        className="h-8 text-sm"
                        value={value.cantidad}
                        onChange={(e) => handleExteriorChange(key, "cantidad", e.target.value)}
                      />
                    </div>
                    <div className="flex justify-center">
                      <input
                        type="radio"
                        checked={value.si}
                        onChange={() => handleExteriorChange(key, "si", true)}
                        className="h-4 w-4"
                      />
                    </div>
                    <div className="flex justify-center">
                      <input
                        type="radio"
                        checked={value.no}
                        onChange={() => handleExteriorChange(key, "no", true)}
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
                        nivelGasolina === "vacio"
                          ? "h-0 bg-red-500"
                          : nivelGasolina === "1/4"
                            ? "h-1/4 bg-red-500"
                            : nivelGasolina === "1/2"
                              ? "h-1/2 bg-yellow-500"
                              : nivelGasolina === "3/4"
                                ? "h-3/4 bg-blue-500"
                                : "h-full bg-green-500"
                      }`}
                    ></div>
                  </div>
                  <div className="ml-4">
                    <div className="flex flex-col space-y-2">
                      <div
                        className={`w-16 h-6 flex items-center justify-center text-xs text-white rounded cursor-pointer ${
                          nivelGasolina === "lleno" ? "bg-blue-600" : "bg-gray-300"
                        }`}
                        onClick={() => setNivelGasolina("lleno")}
                      >
                        1/1
                      </div>
                      <div
                        className={`w-16 h-6 flex items-center justify-center text-xs text-white rounded cursor-pointer ${
                          nivelGasolina === "3/4" ? "bg-blue-500" : "bg-gray-300"
                        }`}
                        onClick={() => setNivelGasolina("3/4")}
                      >
                        3/4
                      </div>
                      <div
                        className={`w-16 h-6 flex items-center justify-center text-xs text-white rounded cursor-pointer ${
                          nivelGasolina === "1/2" ? "bg-yellow-500" : "bg-gray-300"
                        }`}
                        onClick={() => setNivelGasolina("1/2")}
                      >
                        1/2
                      </div>
                      <div
                        className={`w-16 h-6 flex items-center justify-center text-xs text-white rounded cursor-pointer ${
                          nivelGasolina === "1/4" ? "bg-red-500" : "bg-gray-300"
                        }`}
                        onClick={() => setNivelGasolina("1/4")}
                      >
                        1/4
                      </div>
                      <div
                        className={`w-16 h-6 flex items-center justify-center text-xs text-white rounded cursor-pointer ${
                          nivelGasolina === "vacio" ? "bg-red-600" : "bg-gray-300"
                        }`}
                        onClick={() => setNivelGasolina("vacio")}
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
                {Object.entries(coqueta)
                  .slice(0, 4)
                  .map(([key, value]) => (
                    <div key={key} className="grid grid-cols-4 gap-2 items-center">
                      <div className="text-sm">{key.replace(/_/g, " ")}</div>
                      <div>
                        <Input
                          className="h-8 text-sm"
                          value={value.cantidad}
                          onChange={(e) => handleCoquetaChange(key, "cantidad", e.target.value)}
                        />
                      </div>
                      <div className="flex justify-center">
                        <input
                          type="radio"
                          checked={value.si}
                          onChange={() => handleCoquetaChange(key, "si", true)}
                          className="h-4 w-4"
                        />
                      </div>
                      <div className="flex justify-center">
                        <input
                          type="radio"
                          checked={value.no}
                          onChange={() => handleCoquetaChange(key, "no", true)}
                          className="h-4 w-4"
                        />
                      </div>
                    </div>
                  ))}
              </div>
              <div className="space-y-2">
                {Object.entries(coqueta)
                  .slice(4)
                  .map(([key, value]) => (
                    <div key={key} className="grid grid-cols-4 gap-2 items-center">
                      <div className="text-sm">{key.replace(/_/g, " ")}</div>
                      <div>
                        <Input
                          className="h-8 text-sm"
                          value={value.cantidad}
                          onChange={(e) => handleCoquetaChange(key, "cantidad", e.target.value)}
                        />
                      </div>
                      <div className="flex justify-center">
                        <input
                          type="radio"
                          checked={value.si}
                          onChange={() => handleCoquetaChange(key, "si", true)}
                          className="h-4 w-4"
                        />
                      </div>
                      <div className="flex justify-center">
                        <input
                          type="radio"
                          checked={value.no}
                          onChange={() => handleCoquetaChange(key, "no", true)}
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
              {Object.entries(motor).map(([key, value]) => (
                <div key={key} className="grid grid-cols-4 gap-2 items-center">
                  <div className="text-sm">{key.replace(/_/g, " ")}</div>
                  <div>
                    <Input
                      className="h-8 text-sm"
                      value={value.cantidad}
                      onChange={(e) => handleMotorChange(key, "cantidad", e.target.value)}
                    />
                  </div>
                  <div className="flex justify-center">
                    <input
                      type="radio"
                      checked={value.si}
                      onChange={() => handleMotorChange(key, "si", true)}
                      className="h-4 w-4"
                    />
                  </div>
                  <div className="flex justify-center">
                    <input
                      type="radio"
                      checked={value.no}
                      onChange={() => handleMotorChange(key, "no", true)}
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
              value={comentarios}
              onChange={(e) => setComentarios(e.target.value)}
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
                    <img src="/car-front-side-diagram.png" alt="Vista frontal y lateral" className="w-full h-auto" />
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <img src="/car-rear-top-diagram.png" alt="Vista trasera y superior" className="w-full h-auto" />
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
