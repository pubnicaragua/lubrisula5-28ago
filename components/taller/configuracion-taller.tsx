"use client"

import type React from "react"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import { Separator } from "@/components/ui/separator"
import { Upload, Save } from "lucide-react"

const tallerFormSchema = z.object({
  nombreTaller: z.string().min(2, {
    message: "El nombre del taller debe tener al menos 2 caracteres.",
  }),
  direccion: z.string().min(5, {
    message: "La dirección debe tener al menos 5 caracteres.",
  }),
  telefono: z.string().min(8, {
    message: "El teléfono debe tener al menos 8 caracteres.",
  }),
  email: z.string().email({
    message: "Por favor ingresa un email válido.",
  }),
  rucNit: z.string().min(8, {
    message: "El RUC/NIT debe tener al menos 8 caracteres.",
  }),
  razonSocial: z.string().min(2, {
    message: "La razón social debe tener al menos 2 caracteres.",
  }),
  moneda: z.string({
    required_error: "Por favor selecciona una moneda.",
  }),
  pais: z.string({
    required_error: "Por favor selecciona un país.",
  }),
  colorPrimario: z.string().default("#3b82f6"),
  colorSecundario: z.string().default("#10b981"),
  mostrarLogo: z.boolean().default(true),
  mostrarDireccion: z.boolean().default(true),
  mostrarTelefono: z.boolean().default(true),
  mostrarEmail: z.boolean().default(true),
  terminosCondiciones: z.string().optional(),
  politicaPrivacidad: z.string().optional(),
})

type TallerFormValues = z.infer<typeof tallerFormSchema>

const defaultValues: Partial<TallerFormValues> = {
  nombreTaller: "AUTOFLOWX Taller",
  direccion: "Av. Principal #123",
  telefono: "123-456-7890",
  email: "contacto@autoflowx.com",
  rucNit: "12345678901",
  razonSocial: "AUTOFLOWX S.A.",
  moneda: "USD",
  pais: "Guatemala",
  colorPrimario: "#3b82f6",
  colorSecundario: "#10b981",
  mostrarLogo: true,
  mostrarDireccion: true,
  mostrarTelefono: true,
  mostrarEmail: true,
  terminosCondiciones: "Términos y condiciones del taller...",
  politicaPrivacidad: "Política de privacidad del taller...",
}

export function ConfiguracionTaller() {
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [moneda, setMoneda] = useState("USD")
  const [region, setRegion] = useState("Centroamérica")

  const form = useForm<TallerFormValues>({
    resolver: zodResolver(tallerFormSchema),
    defaultValues,
  })

  function onSubmit(data: TallerFormValues) {
    toast({
      title: "Configuración guardada",
      description: "La configuración del taller ha sido actualizada correctamente.",
    })
  }

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Configuración del Taller</h1>
        <p className="text-muted-foreground">Personaliza la información y apariencia de tu taller</p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="facturacion">Facturación</TabsTrigger>
          <TabsTrigger value="apariencia">Apariencia</TabsTrigger>
          <TabsTrigger value="legal">Legal</TabsTrigger>
        </TabsList>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <TabsContent value="general" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Información del Taller</CardTitle>
                  <CardDescription>Configura la información básica de tu taller</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="nombreTaller"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre del Taller</FormLabel>
                        <FormControl>
                          <Input placeholder="Nombre del taller" {...field} />
                        </FormControl>
                        <FormDescription>
                          Este nombre aparecerá en todos los documentos y comunicaciones.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="direccion"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Dirección</FormLabel>
                          <FormControl>
                            <Input placeholder="Dirección del taller" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="telefono"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Teléfono</FormLabel>
                          <FormControl>
                            <Input placeholder="Teléfono de contacto" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Email de contacto" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="pais"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>País</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona un país" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Guatemala">Guatemala</SelectItem>
                            <SelectItem value="El Salvador">El Salvador</SelectItem>
                            <SelectItem value="Honduras">Honduras</SelectItem>
                            <SelectItem value="Nicaragua">Nicaragua</SelectItem>
                            <SelectItem value="Costa Rica">Costa Rica</SelectItem>
                            <SelectItem value="Panamá">Panamá</SelectItem>
                            <SelectItem value="Belice">Belice</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Este país se usará para configurar formatos fiscales y regionales.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="mt-4">
                    <FormLabel>Logo del Taller</FormLabel>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="w-24 h-24 border rounded-md flex items-center justify-center overflow-hidden bg-muted">
                        {logoPreview ? (
                          <img
                            src={logoPreview || "/placeholder.svg"}
                            alt="Logo preview"
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <span className="text-muted-foreground text-sm">Sin logo</span>
                        )}
                      </div>
                      <div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="mb-2"
                          onClick={() => document.getElementById("logo-upload")?.click()}
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          Subir Logo
                        </Button>
                        <input
                          id="logo-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleLogoChange}
                        />
                        <p className="text-xs text-muted-foreground">Formatos: JPG, PNG. Tamaño máximo: 2MB</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="facturacion" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Información Fiscal</CardTitle>
                  <CardDescription>Configura los datos fiscales para tus facturas y cotizaciones</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="rucNit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>RUC / NIT</FormLabel>
                          <FormControl>
                            <Input placeholder="Número de RUC o NIT" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="razonSocial"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Razón Social</FormLabel>
                          <FormControl>
                            <Input placeholder="Razón social" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="moneda"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Moneda Predeterminada</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona una moneda" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="USD">Dólar Estadounidense (USD)</SelectItem>
                            <SelectItem value="GTQ">Quetzal Guatemalteco (GTQ)</SelectItem>
                            <SelectItem value="SVC">Colón Salvadoreño (SVC)</SelectItem>
                            <SelectItem value="HNL">Lempira Hondureño (HNL)</SelectItem>
                            <SelectItem value="NIO">Córdoba Nicaragüense (NIO)</SelectItem>
                            <SelectItem value="CRC">Colón Costarricense (CRC)</SelectItem>
                            <SelectItem value="PAB">Balboa Panameño (PAB)</SelectItem>
                            <SelectItem value="BZD">Dólar Beliceño (BZD)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Esta moneda se usará por defecto en todas las cotizaciones y facturas.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Separator className="my-4" />

                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Información a mostrar en documentos</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="mostrarLogo"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                            <div className="space-y-0.5">
                              <FormLabel>Mostrar Logo</FormLabel>
                              <FormDescription>Incluir el logo en facturas y cotizaciones</FormDescription>
                            </div>
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="mostrarDireccion"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                            <div className="space-y-0.5">
                              <FormLabel>Mostrar Dirección</FormLabel>
                              <FormDescription>Incluir la dirección en documentos</FormDescription>
                            </div>
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="mostrarTelefono"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                            <div className="space-y-0.5">
                              <FormLabel>Mostrar Teléfono</FormLabel>
                              <FormDescription>Incluir el teléfono en documentos</FormDescription>
                            </div>
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="mostrarEmail"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                            <div className="space-y-0.5">
                              <FormLabel>Mostrar Email</FormLabel>
                              <FormDescription>Incluir el email en documentos</FormDescription>
                            </div>
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="apariencia" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Personalización Visual</CardTitle>
                  <CardDescription>Configura los colores y la apariencia de tu taller</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="colorPrimario"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Color Primario</FormLabel>
                          <FormControl>
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-md border" style={{ backgroundColor: field.value }} />
                              <Input type="text" value={field.value} onChange={field.onChange} className="w-28" />
                            </div>
                          </FormControl>
                          <FormDescription>Color principal para encabezados y botones</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="colorSecundario"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Color Secundario</FormLabel>
                          <FormControl>
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-md border" style={{ backgroundColor: field.value }} />
                              <Input type="text" value={field.value} onChange={field.onChange} className="w-28" />
                            </div>
                          </FormControl>
                          <FormDescription>Color para acentos y elementos secundarios</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="mt-6">
                    <h3 className="text-sm font-medium mb-4">Vista previa</h3>
                    <div className="border rounded-md p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          {logoPreview && (
                            <img
                              src={logoPreview || "/placeholder.svg"}
                              alt="Logo"
                              className="w-10 h-10 object-contain"
                            />
                          )}
                          <span className="font-bold" style={{ color: form.watch("colorPrimario") }}>
                            {form.watch("nombreTaller")}
                          </span>
                        </div>
                        <div
                          className="px-3 py-1 rounded-md text-white text-sm"
                          style={{ backgroundColor: form.watch("colorPrimario") }}
                        >
                          Cotización
                        </div>
                      </div>

                      <div className="space-y-2 text-sm">
                        {form.watch("mostrarDireccion") && <p>{form.watch("direccion")}</p>}
                        <div className="flex gap-4">
                          {form.watch("mostrarTelefono") && <p>Tel: {form.watch("telefono")}</p>}
                          {form.watch("mostrarEmail") && <p>Email: {form.watch("email")}</p>}
                        </div>
                        <p>RUC/NIT: {form.watch("rucNit")}</p>
                      </div>

                      <div className="mt-4 border-t pt-4">
                        <div className="flex justify-between text-sm font-medium">
                          <span>Servicio</span>
                          <span>Precio</span>
                        </div>
                        <div className="flex justify-between text-sm mt-2">
                          <span>Cambio de aceite</span>
                          <span>{form.watch("moneda") === "USD" ? "$" : ""}50.00</span>
                        </div>
                        <div className="flex justify-between text-sm mt-2">
                          <span>Revisión de frenos</span>
                          <span>{form.watch("moneda") === "USD" ? "$" : ""}75.00</span>
                        </div>
                        <div className="flex justify-between font-medium mt-4 pt-2 border-t">
                          <span>Total</span>
                          <span style={{ color: form.watch("colorSecundario") }}>
                            {form.watch("moneda") === "USD" ? "$" : ""}125.00
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="legal" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Información Legal</CardTitle>
                  <CardDescription>Configura los textos legales para tus documentos</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="terminosCondiciones"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Términos y Condiciones</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Ingresa los términos y condiciones que aparecerán en tus documentos"
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Este texto aparecerá en la parte inferior de tus cotizaciones y facturas.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="politicaPrivacidad"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Política de Privacidad</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Ingresa la política de privacidad"
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>Esta política se mostrará en tu sitio web y aplicaciones.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <div className="flex justify-end">
              <Button type="submit" className="w-full md:w-auto">
                <Save className="mr-2 h-4 w-4" />
                Guardar Configuración
              </Button>
            </div>
          </form>
        </Form>
      </Tabs>
    </div>
  )
}
