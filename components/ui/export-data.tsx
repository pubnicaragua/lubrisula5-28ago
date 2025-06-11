"use client"

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface ExportDataProps {
  data: any[]
  fileName: string
  title: string
}

export function ExportData({ data, fileName, title }: ExportDataProps) {
  const exportToCsv = () => {
    if (!data || data.length === 0) {
      toast({
        title: "No hay datos para exportar",
        description: "No se encontraron datos para exportar.",
        variant: "destructive",
      })
      return
    }

    const headers = Object.keys(data[0])
    const csv = [
      headers.join(","),
      ...data.map((row) => headers.map((fieldName) => JSON.stringify(row[fieldName])).join(",")),
    ].join("\n")

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute("href", url)
      link.setAttribute("download", `${fileName}.csv`)
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      toast({
        title: "Exportación exitosa",
        description: `${title} exportados a CSV.`,
      })
    } else {
      toast({
        title: "Error de exportación",
        description: "Tu navegador no soporta la exportación directa a CSV.",
        variant: "destructive",
      })
    }
  }

  return (
    <Button onClick={exportToCsv} variant="outline">
      <Download className="mr-2 h-4 w-4" /> Exportar CSV
    </Button>
  )
}
