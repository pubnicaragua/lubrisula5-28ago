"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { HojaIngreso } from "@/components/vehiculos/hoja-ingreso"

interface ModalHojaIngresoProps {
  isOpen: boolean
  onClose: () => void
  vehiculoId: string
  onSave?: () => void
}

export function ModalHojaIngreso({ isOpen, onClose, vehiculoId, onSave }: ModalHojaIngresoProps) {
  const handleSave = () => {
    if (onSave) onSave()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Hoja de Ingreso de Vehículo</DialogTitle>
        </DialogHeader>
        <HojaIngreso vehiculoId={vehiculoId} onSave={handleSave} onCancel={onClose} />
      </DialogContent>
    </Dialog>
  )
}
