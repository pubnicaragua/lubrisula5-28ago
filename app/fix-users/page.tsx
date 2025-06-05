"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Loader2, CheckCircle, XCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function FixUsersPage() {
  const [emails, setEmails] = useState("dxgabalt@gmail.com\ndxgabalt2@gmail.com")
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any[]>([])
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setResults([])

    try {
      const emailList = emails
        .split("\n")
        .map((e) => e.trim())
        .filter((e) => e)

      const response = await fetch("/api/fix-user-roles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emails: emailList }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Error al procesar la solicitud")
      }

      setResults(data.results)

      toast({
        title: "Proceso completado",
        description: "Se ha completado el proceso de corrección de usuarios",
      })
    } catch (error) {
      console.error("Error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error desconocido",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Corregir Usuarios</CardTitle>
          <CardDescription>
            Esta herramienta asigna roles a usuarios, crea perfiles faltantes y corrige metadatos.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="emails">Emails (uno por línea)</Label>
              <textarea
                id="emails"
                className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={emails}
                onChange={(e) => setEmails(e.target.value)}
                placeholder="Ingresa los emails, uno por línea"
              />
            </div>

            {results.length > 0 && (
              <div className="space-y-2 border rounded-md p-4">
                <h3 className="font-medium">Resultados:</h3>
                <div className="space-y-2">
                  {results.map((result, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      {result.status === "success" ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                      <span>{result.email}:</span>
                      <span className={result.status === "success" ? "text-green-600" : "text-red-600"}>
                        {result.message}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Procesando...
                </>
              ) : (
                "Corregir Usuarios"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
