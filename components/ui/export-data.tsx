"use client"

import { Button } from "@/components/ui/button"
import { FileSpreadsheet, FileIcon as FilePdf } from "lucide-react"
import * as XLSX from "xlsx"
import { jsPDF } from "jspdf"
import "jspdf-autotable"

interface ExportDataProps {
  data: any[]
  fileName: string
  title: string
}

export function ExportData({ data, fileName, title }: ExportDataProps) {
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, fileName)
    XLSX.writeFile(workbook, `${fileName}.xlsx`)
  }

  const exportToPDF = () => {
    const doc = new jsPDF()

    // Título
    doc.setFontSize(18)
    doc.text(title, 14, 22)

    // Fecha de generación
    doc.setFontSize(11)
    doc.text(`Generado: ${new Date().toLocaleDateString()}`, 14, 30)

    // Obtener las columnas
    const columns = Object.keys(data[0])
    const rows = data.map((item) => Object.values(item))

    // @ts-ignore - jspdf-autotable types
    doc.autoTable({
      head: [columns],
      body: rows,
      startY: 40,
      theme: "grid",
      styles: { fontSize: 9 },
      headStyles: { fillColor: [66, 66, 66] },
    })

    doc.save(`${fileName}.pdf`)
  }

  return (
    <div className="flex gap-2">
      <Button onClick={exportToExcel} variant="outline" size="sm">
        <FileSpreadsheet className="h-4 w-4 mr-2" />
        Excel
      </Button>
      <Button onClick={exportToPDF} variant="outline" size="sm">
        <FilePdf className="h-4 w-4 mr-2" />
        PDF
      </Button>
    </div>
  )
}
