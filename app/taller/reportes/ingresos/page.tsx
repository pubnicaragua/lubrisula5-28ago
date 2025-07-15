import ReportesProductividad from "@/components/taller/reportes-productividad"
import type { Metadata } from "next"  
  
export const metadata: Metadata = {  
  title: "Reportes de Ingresos | AUTOFLOWX",  
  description: "Análisis detallado de ingresos y productividad del taller",  
}  
  
export default function ReportesIngresosPage() {  
  return (  
    <div className="container mx-auto py-6">  
      <ReportesProductividad />  
    </div>  
  )  
}