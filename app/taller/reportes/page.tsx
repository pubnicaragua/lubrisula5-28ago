import { ReportesTaller } from "@/components/taller/reportes-taller"  
import type { Metadata } from "next"  
  
export const metadata: Metadata = {  
  title: "Reportes del Taller | AUTOFLOWX",  
  description: "Análisis de rendimiento y estadísticas del taller",  
}  
  
export default function ReportesPage() {  
  return (  
    <div className="container mx-auto py-6">  
      <ReportesTaller />  
    </div>  
  )  
}