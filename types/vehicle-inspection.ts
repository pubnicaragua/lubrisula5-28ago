export interface InspectionItem {
  id: string
  description: string
  quantity?: string
  checked: boolean
}

export interface InspectionSection {
  id: string
  title: string
  items: InspectionItem[]
}

export interface FuelLevel {
  level: number // 0-8 representing empty to full
}

export interface BodyCondition {
  damages: {
    frontView: { x: number; y: number }[]
    sideLeftView: { x: number; y: number }[]
    sideRightView: { x: number; y: number }[]
    rearView: { x: number; y: number }[]
    topView: { x: number; y: number }[]
  }
}

export interface VehicleInspection {
  id: string
  vehicle_id: string
  created_at: string
  updated_at: string
  interior_items: InspectionItem[]
  exterior_items: InspectionItem[]
  engine_items: InspectionItem[]
  body_items: InspectionItem[]
  fuel_level: FuelLevel
  mileage: string
  comments: string
  images: string[]
  client_signature: string | null
  technician_signature: string | null
  status: "draft" | "completed"
}

export const defaultInteriorItems: InspectionItem[] = [
  { id: "documents", description: "Documentos", checked: false },
  { id: "radio", description: "Radio", checked: false },
  { id: "portfolio", description: "Portafolio", checked: false },
  { id: "lighter", description: "Encendedor", checked: false },
  { id: "floor_mats", description: "Tapetes tela", checked: false },
  { id: "plastic_mats", description: "Tapetes plástico", checked: false },
  { id: "fuel_gauge", description: "Medidor de gasolina", checked: false },
  { id: "mileage", description: "Kilometraje", checked: false },
]

export const defaultExteriorItems: InspectionItem[] = [
  { id: "antenna", description: "Antena", checked: false },
  { id: "headlights", description: "Faharros", checked: false },
  { id: "hubcaps", description: "Centro de rin", checked: false },
  { id: "plates", description: "Placas", checked: false },
  { id: "tool", description: "Herramienta", checked: false },
  { id: "wipers", description: "Limpiaparabrisas", checked: false },
  { id: "battery_cables", description: "Cables para corriente", checked: false },
  { id: "reflective_tape", description: "Cinta de reflejante", checked: false },
  { id: "jack", description: "Llave L o cruceta", checked: false },
  { id: "jack_tool", description: "Gato", checked: false },
]

export const defaultEngineItems: InspectionItem[] = [
  { id: "battery", description: "Batería", checked: false },
  { id: "computer", description: "Computadora", checked: false },
  { id: "caps", description: "Tapones despejados", checked: false },
]

export const defaultBodyItems: InspectionItem[] = []
