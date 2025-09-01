"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Save, Printer, FileDown, Upload, X } from "lucide-react"
import html2canvas from "html2canvas"
import { jsPDF } from "jspdf"
import SignatureCanvas from "react-signature-canvas";
import HOJA_INGRESO_SERVICE, { HojaIngresoType } from "@/services/HOJA_INGRESO.service"
import { getSupabaseClient } from "@/lib/supabase/client"

interface HojaIngresoProps {
  vehiculoId?: string
  onSave?: () => void
  onCancel?: () => void
}

interface Punto {
  x: number
  y: number
  id: string
  descripcion: string
}

export async function subirImagenesCarroceria(files: File[], vehiculoId: string): Promise<string[]> {
  const urls: string[] = [];
  for (const file of files) {
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = `vehiculos/${vehiculoId}-${fileName}`;
    const { error } = await getSupabaseClient().storage
      .from('carrocerias') // tu bucket
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false, // no sobreescribir si ya existe
      });

    if (!error) {
      const { data } = getSupabaseClient().storage.from('carrocerias').getPublicUrl(filePath);
      urls.push(data.publicUrl);
    }
  }
  return urls;
}

export default function HojaIngreso({ vehiculoId, onSave, onCancel }: HojaIngresoProps) {
  const { toast } = useToast()
  const formRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [vehiculoData, setVehiculoData] = useState<any>(null)
  const [imagenCarroceria, setImagenCarroceria] = useState<string | null>(null)
  // const [imagenesCarroceria, setImagenesCarroceria] = useState<string[]>([]);
  const [imagenesCarroceria, setImagenesCarroceria] = useState<File[]>([]);
  const [UrlsimagenesCarroceria, setUrlsimagenesCarroceria] = useState<string[]>([]);
  const [puntos, setPuntos] = useState<Punto[]>([])
  const [modoEdicion, setModoEdicion] = useState(false);
  const [sigClienteRef, setSigClienteRef] = useState<any>(null)
  const [sigEncargadoRef, setsigEncargadoRef] = useState<any>(null)
  const [firmaCliente, setFirmaCliente] = useState<any>(null)
  const [InitialfirmaCliente, setInitialfirmaCliente] = useState<any>(null)
  const [firmaEncargado, setfirmaEncargado] = useState<any>(null)
  const [InitialfirmaEncargado, setInitialfirmaEncargado] = useState<any>(null)

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

  useEffect(() => {
    if (vehiculoId) {
      loadVehiculoData()
    }
  }, [vehiculoId])

  const loadVehiculoData = async () => {
    const savedVehiculos = localStorage.getItem("mockVehiculos")
    if (savedVehiculos) {
      const vehiculos = JSON.parse(savedVehiculos)
      const vehiculo = vehiculos.find((v: any) => v.id === vehiculoId)
      setVehiculoData(vehiculo)
    }

    // Cargar datos guardados de la inspección
    // const savedInspection = localStorage.getItem(`inspeccion_${vehiculoId}`)
    const data = await HOJA_INGRESO_SERVICE.ObtenerInspeccion(vehiculoId);
    if (data) {
      // const data = JSON.parse(savedInspection)
      setInteriores(data.interiores || interiores)
      setExteriores(data.exteriores || exteriores)
      setCoqueta(data.coqueta || coqueta)
      setMotor(data.motor || motor)
      setNivelGasolina(data.nivel_gasolina || "1/4")
      setComentarios(data.comentarios || "")
      // setImagenCarroceria(data.imagen_carroceria || null)
      setUrlsimagenesCarroceria(data.imagenes_carroceria || null)
      setPuntos(data.puntos || [])
      setInitialfirmaCliente(data?.firma_cliente || null)
      setFirmaCliente(data?.firma_cliente || null)
      setInitialfirmaEncargado(data?.firma_encargado || null)
      setfirmaEncargado(data?.firma_encargado || null)
    }
  }

  // const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files?.[0]
  //   if (file) {
  //     const reader = new FileReader()
  //     reader.onload = (e) => {
  //       setImagenCarroceria(e.target?.result as string)
  //     }
  //     reader.readAsDataURL(file)
  //   }
  // }
  // Modifica la función de subida
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const readers = Array.from(files).map(file => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.readAsDataURL(file);
        });
      });
      Promise.all(readers).then((images) => {
        setUrlsimagenesCarroceria(prev => [...prev, ...images]);
      });
    }
    handleImageUploadUrl(event);
  };
  const handleImageUploadUrl = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setImagenesCarroceria(prev => [...prev, ...Array.from(files)]);
    }
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!modoEdicion || !canvasRef.current) return

    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    const descripcion = prompt("Descripción del punto:")
    if (descripcion) {
      const nuevoPunto: Punto = {
        x,
        y,
        id: Date.now().toString(),
        descripcion,
      }
      setPuntos([...puntos, nuevoPunto])
    }
  }

  const eliminarPunto = (id: string) => {
    setPuntos(puntos.filter((p) => p.id !== id))
  }

  const dibujarCanvas = () => {
    if (!canvasRef.current || !imagenCarroceria) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const img = new Image()
    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)

      // Dibujar puntos
      puntos.forEach((punto, index) => {
        ctx.fillStyle = "red"
        ctx.beginPath()
        ctx.arc(punto.x, punto.y, 8, 0, 2 * Math.PI)
        ctx.fill()

        ctx.fillStyle = "white"
        ctx.font = "12px Arial"
        ctx.textAlign = "center"
        ctx.fillText((index + 1).toString(), punto.x, punto.y + 4)
      })
    }
    img.src = imagenCarroceria
  }

  useEffect(() => {
    dibujarCanvas()
  }, [imagenCarroceria, puntos])

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
        // variant: "destructive",
      })
      return
    }
    // setIsLoading(true);

    // 1. Sube las imágenes y obtén las URLs
    let urls: string[] = [];
    if (imagenesCarroceria.length > 0) {
      urls = await subirImagenesCarroceria(imagenesCarroceria, vehiculoId);
      urls = [...UrlsimagenesCarroceria, ...urls];
    } else {
      urls = UrlsimagenesCarroceria;
    }
    // const inspeccionData: HojaIngresoType = {
    //   vehiculo_id: vehiculoId,
    //   fecha: new Date().toISOString(),
    //   interiores,
    //   exteriores,
    //   coqueta,
    //   motor,
    //   nivel_gasolina: nivelGasolina,
    //   comentarios,
    //   imagen_carroceria: imagenCarroceria,
    //   puntos,
    //   firmas: { firmaCliente, firmaEncargado }
    // }
    const inspeccionData: HojaIngresoType = {
      vehiculo_id: vehiculoId,
      fecha: new Date().toISOString(),
      interiores,
      exteriores,
      coqueta,
      motor,
      nivel_gasolina: nivelGasolina,
      comentarios,
      imagenes_carroceria: urls, // ahora es un array
      puntos,
      firmas: { firmaCliente, firmaEncargado }
    }
    console.log("Datos de inspección guardados:", inspeccionData)
    await HOJA_INGRESO_SERVICE.guardarInspeccion(vehiculoId, inspeccionData)
    // localStorage.setItem(`inspeccion_${vehiculoId}`, JSON.stringify(inspeccionData))

    toast({
      title: "Éxito",
      description: "Hoja de ingreso guardada correctamente",
    })

    if (onSave) onSave()
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
        // variant: "destructive",
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
                      className={`absolute bottom-0 w-full rounded-b-full transition-all duration-300 ${nivelGasolina === "vacio"
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
                        className={`w-16 h-6 flex items-center justify-center text-xs text-white rounded cursor-pointer ${nivelGasolina === "lleno" ? "bg-blue-600" : "bg-gray-300"
                          }`}
                        onClick={() => setNivelGasolina("lleno")}
                      >
                        1/1
                      </div>
                      <div
                        className={`w-16 h-6 flex items-center justify-center text-xs text-white rounded cursor-pointer ${nivelGasolina === "3/4" ? "bg-blue-500" : "bg-gray-300"
                          }`}
                        onClick={() => setNivelGasolina("3/4")}
                      >
                        3/4
                      </div>
                      <div
                        className={`w-16 h-6 flex items-center justify-center text-xs text-white rounded cursor-pointer ${nivelGasolina === "1/2" ? "bg-yellow-500" : "bg-gray-300"
                          }`}
                        onClick={() => setNivelGasolina("1/2")}
                      >
                        1/2
                      </div>
                      <div
                        className={`w-16 h-6 flex items-center justify-center text-xs text-white rounded cursor-pointer ${nivelGasolina === "1/4" ? "bg-red-500" : "bg-gray-300"
                          }`}
                        onClick={() => setNivelGasolina("1/4")}
                      >
                        1/4
                      </div>
                      <div
                        className={`w-16 h-6 flex items-center justify-center text-xs text-white rounded cursor-pointer ${nivelGasolina === "vacio" ? "bg-red-600" : "bg-gray-300"
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

        {/* Condiciones de carrocería con subida de imagen y marcado de puntos */}
        <div className="border rounded-md overflow-hidden">
          <div className="bg-cyan-500 text-white font-bold py-1 px-2 text-center">Condiciones de carrocería</div>
          <div className="p-4">
            <div className="space-y-4">
              <div className="flex gap-2 print:hidden">
                <Button onClick={() => fileInputRef.current?.click()} variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Subir Imagen
                </Button>
                <Button
                  onClick={() => setModoEdicion(!modoEdicion)}
                  variant={modoEdicion ? "default" : "outline"}
                  size="sm"
                >
                  {modoEdicion ? "Finalizar Edición" : "Marcar Puntos"}
                </Button>
                {puntos.length > 0 && (
                  <Button onClick={() => setPuntos([])} variant="outline" size="sm">
                    Limpiar Puntos
                  </Button>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
              {/* <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" /> */}


              {UrlsimagenesCarroceria.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {UrlsimagenesCarroceria?.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`Carrocería ${idx + 1}`}
                      className="max-h-40 border rounded"
                    />
                  ))}
                </div>
              ) : null}

              {imagenCarroceria ? (
                <div className="space-y-4">
                  <div className="relative border rounded-lg overflow-hidden">
                    <canvas
                      ref={canvasRef}
                      onClick={handleCanvasClick}
                      className={`max-w-full h-full ${modoEdicion ? "cursor-crosshair" : "cursor-default"}`}
                      style={{ maxHeight: "400px" }}
                    />
                    {modoEdicion && (
                      <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded text-sm">
                        Haz clic para marcar puntos
                      </div>
                    )}
                  </div>

                  {puntos.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium">Puntos marcados:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {puntos.map((punto, index) => (
                          <div key={punto.id} className="flex items-center justify-between p-2 border rounded">
                            <span className="text-sm">
                              <strong>{index + 1}.</strong> {punto.descripcion}
                            </span>
                            <Button
                              onClick={() => eliminarPunto(punto.id)}
                              variant="ghost"
                              size="sm"
                              className="print:hidden"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">Haz clic en "Subir Imagen" para cargar una foto del vehículo</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Firmas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          <div className="border-b-2 border-gray-300 pt-2 bg-white h-[200px]">

            {
              // InitialfirmaCliente ?
              <img
                src={InitialfirmaCliente || "/placeholder.svg"}
                alt="Firma del cliente"
                className="w-full h-full object-contain"
              />
              // :
              // <SignatureCanvas
              //   ref={(ref) => setSigClienteRef(ref)}
              //   canvasProps={{ className: "w-full h-full h-[200px]" }}
              //   onEnd={() => setFirmaCliente(sigClienteRef?.toDataURL())}

              // />
            }


            <div className="text-center font-medium">Firma del Cliente</div>

          </div>
          <div className="border-b-2 border-gray-300 pt-2 bg-white h-[200px]">
            {
              InitialfirmaEncargado ?
                <img
                  src={InitialfirmaEncargado || "/placeholder.svg"}
                  alt="Firma del cliente"
                  className="w-full h-full object-contain"
                />
                :
                <SignatureCanvas
                  ref={(ref) => setsigEncargadoRef(ref)}
                  canvasProps={{ className: "w-full h-full h-[200px]" }}
                  onEnd={() => setfirmaEncargado(sigEncargadoRef?.toDataURL())}
                />
            }

            <div className="text-center font-medium">Firma del Encargado</div>
          </div>
        </div>
      </div>
    </div>
  )
}