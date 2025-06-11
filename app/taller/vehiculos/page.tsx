"use client"

import { useState } from "react"
import { VehiculosTallerPage } from "@/components/taller/vehiculos-taller-page"
import { ModalHojaIngreso } from "@/components/vehiculos/modal-hoja-ingreso"

export default function VehiculosPage() {
  const [hojaIngresoOpen, setHojaIngresoOpen] = useState(false)
  const [selectedVehiculoId, setSelectedVehiculoId] = useState<string | null>(null)

  const handleOpenHojaIngreso = (vehiculoId: string) => {
    setSelectedVehiculoId(vehiculoId)
    setHojaIngresoOpen(true)
  }

  return (
    <>
      <VehiculosTallerPage onOpenHojaIngreso={handleOpenHojaIngreso} />
      {selectedVehiculoId && (
        <ModalHojaIngreso
          isOpen={hojaIngresoOpen}
          onClose={() => setHojaIngresoOpen(false)}
          vehiculoId={selectedVehiculoId}
          onSave={() => {
            // Recargar datos si es necesario
          }}
        />
      )}
    </>
  )
}
