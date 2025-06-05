"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function DebugSupabaseUrlPage() {
  const [supabaseUrl, setSupabaseUrl] = useState<string | null>(null)
  const [isValidUrl, setIsValidUrl] = useState<boolean | null>(null)

  useEffect(() => {
    // Obtener la URL de Supabase de las variables de entorno
    const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
    setSupabaseUrl(envUrl)

    // Verificar si la URL es válida
    setIsValidUrl(envUrl && envUrl.includes("supabase.co"))
  }, [])

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Diagnóstico de URL de Supabase</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>URL de Supabase</CardTitle>
          <CardDescription>Verifica si la URL de Supabase está correctamente configurada</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-1">URL actual:</h3>
              <code className="bg-gray-100 p-2 rounded block">{supabaseUrl || "No configurada"}</code>
            </div>

            {isValidUrl === false && (
              <Alert variant="destructive">
                <AlertTitle>URL inválida o truncada</AlertTitle>
                <AlertDescription>
                  La URL de Supabase parece estar truncada o es inválida. Debería terminar con "supabase.co".
                  <br />
                  <strong>URL correcta:</strong> https://wcyvgqbtaimkguaslhom.supabase.co
                </AlertDescription>
              </Alert>
            )}

            {isValidUrl === true && (
              <Alert className="bg-green-50 border-green-200">
                <AlertTitle className="text-green-700">URL válida</AlertTitle>
                <AlertDescription className="text-green-600">
                  La URL de Supabase está correctamente configurada.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <div className="text-sm text-gray-500">
            <p>Para corregir la URL de Supabase:</p>
            <ol className="list-decimal pl-5 mt-2">
              <li>Ve al panel de control de Vercel</li>
              <li>Navega a tu proyecto</li>
              <li>Ve a "Settings" &gt; "Environment Variables"</li>
              <li>Actualiza la variable NEXT_PUBLIC_SUPABASE_URL a: https://wcyvgqbtaimkguaslhom.supabase.co</li>
              <li>Guarda los cambios y redespliega la aplicación</li>
            </ol>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
