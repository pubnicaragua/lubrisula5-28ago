"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckCircle, XCircle, RefreshCw, Key } from "lucide-react"

export default function FixApiKeyPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [supabaseUrl, setSupabaseUrl] = useState("")
  const [supabaseKey, setSupabaseKey] = useState("")

  const testConnection = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/reset-api-key", {
        method: "POST",
      })

      const data = await response.json()
      setResult(data)
    } catch (error: any) {
      setResult({
        success: false,
        error: "Error al realizar la solicitud",
        details: error.message,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Verificar y Corregir API Key de Supabase</CardTitle>
          <CardDescription>
            Esta herramienta verifica la conexión a Supabase usando las variables de entorno actuales
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {result && (
            <Alert variant={result.success ? "default" : "destructive"}>
              {result.success ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
              <AlertTitle>{result.success ? "Conexión Exitosa" : "Error de Conexión"}</AlertTitle>
              <AlertDescription>
                {result.success
                  ? `La conexión a Supabase está funcionando correctamente. URL: ${result.details?.url?.substring(0, 15)}...`
                  : `Error: ${result.error}. Detalles: ${result.details}`}
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="supabaseUrl">URL de Supabase</Label>
              <Input
                id="supabaseUrl"
                placeholder="https://tu-proyecto.supabase.co"
                value={supabaseUrl}
                onChange={(e) => setSupabaseUrl(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Encuentra esto en Supabase Dashboard → Settings → API → Project URL
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="supabaseKey">Clave Anónima de Supabase</Label>
              <Input
                id="supabaseKey"
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                value={supabaseKey}
                onChange={(e) => setSupabaseKey(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Encuentra esto en Supabase Dashboard → Settings → API → Project API keys → anon public
              </p>
            </div>

            <Alert>
              <Key className="h-4 w-4" />
              <AlertTitle>Instrucciones</AlertTitle>
              <AlertDescription>
                <ol className="list-decimal pl-4 space-y-1">
                  <li>Copia las claves desde el Dashboard de Supabase</li>
                  <li>Actualiza las variables de entorno en Vercel</li>
                  <li>Redespliega tu aplicación</li>
                  <li>Haz clic en "Verificar Conexión" para probar</li>
                </ol>
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            Variables de entorno actuales:
            <span className="ml-1 font-mono">
              {process.env.NEXT_PUBLIC_SUPABASE_URL ? "URL ✓" : "URL ✗"} |
              {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? " KEY ✓" : " KEY ✗"}
            </span>
          </div>
          <Button onClick={testConnection} disabled={loading}>
            {loading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Verificando...
              </>
            ) : (
              "Verificar Conexión"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
