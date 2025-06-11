"use client"

import { useState, useEffect } from "react"

interface DetalleVehiculoProps {
  vehicleId: string
}

export function DetalleVehiculo({ vehicleId }: DetalleVehiculoProps) {
  const [vehicle, setVehicle] = useState<any>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/vehiculos/${vehicleId}`)

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        setVehicle(data)
      } catch (e: any) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }

    fetchVehicle()
  }, [vehicleId])

  if (loading) {
    return <div>Cargando detalles del vehículo...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  if (!vehicle) {
    return <div>Vehículo no encontrado.</div>
  }

  return (
    <div>
      <h2>Detalles del Vehículo</h2>
      <p>ID: {vehicle.id}</p>
      <p>Marca: {vehicle.marca}</p>
      <p>Modelo: {vehicle.modelo}</p>
      {/* Add more details here */}
    </div>
  )
}
