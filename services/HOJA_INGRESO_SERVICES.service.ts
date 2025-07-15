import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"  
  
const supabase = createClientComponentClient()  
  
export interface HojaIngresoData {  
  vehiculo_id: string  
  fecha: string  
  interiores: Record<string, { cantidad: string; si: boolean; no: boolean }>  
  exteriores: Record<string, { cantidad: string; si: boolean; no: boolean }>  
  coqueta: Record<string, { cantidad: string; si: boolean; no: boolean }>  
  motor: Record<string, { cantidad: string; si: boolean; no: boolean }>  
  nivel_gasolina: string  
  comentarios: string  
  imagen_carroceria: string | null  
  puntos: Array<{ x: number; y: number; id: string; descripcion: string }>  
}  
  
export interface HojaIngresoType {  
  id?: string  
  vehiculo_id: string  
  fecha: string  
  nivel_gasolina: string  
  comentarios: string  
  imagen_carroceria: string | null  
  created_at?: string  
  updated_at?: string  
}  
  
const HOJA_INGRESO_SERVICES = {  
  async INSERT_HOJA_INGRESO(data: HojaIngresoData): Promise<HojaIngresoType> {  
    try {  
      // 1. Subir imagen a Supabase Storage si existe  
      let imagenUrl = null  
      if (data.imagen_carroceria && data.imagen_carroceria.startsWith('data:')) {  
        const base64Data = data.imagen_carroceria.split(',')[1]  
        const fileName = `hoja-ingreso-${data.vehiculo_id}-${Date.now()}.png`  
        const filePath = `hojas-ingreso/${fileName}`  
          
        const { data: uploadData, error: uploadError } = await supabase.storage  
          .from('vehiculos')  
          .upload(filePath, Buffer.from(base64Data, 'base64'), {  
            contentType: 'image/png'  
          })  
          
        if (uploadError) throw uploadError  
          
        const { data: urlData } = supabase.storage  
          .from('vehiculos')  
          .getPublicUrl(filePath)  
        imagenUrl = urlData.publicUrl  
      }  
  
      // 2. Insertar hoja principal  
      const { data: hojaData, error: hojaError } = await supabase  
        .from('hojas_ingreso')  
        .insert({  
          vehiculo_id: data.vehiculo_id,  
          fecha: data.fecha,  
          nivel_gasolina: data.nivel_gasolina,  
          comentarios: data.comentarios,  
          imagen_carroceria: imagenUrl  
        })  
        .select()  
        .single()  
  
      if (hojaError) throw hojaError  
  
      // 3. Insertar inspección de interiores  
      const interioresData = Object.entries(data.interiores).map(([item, values]) => ({  
        hoja_ingreso_id: hojaData.id,  
        item,  
        cantidad: values.cantidad,  
        presente: values.si ? true : values.no ? false : null  
      }))  
  
      const { error: interioresError } = await supabase  
        .from('inspeccion_interiores')  
        .insert(interioresData)  
  
      if (interioresError) throw interioresError  
  
      // 4. Insertar inspección de exteriores  
      const exterioresData = Object.entries(data.exteriores).map(([item, values]) => ({  
        hoja_ingreso_id: hojaData.id,  
        item,  
        cantidad: values.cantidad,  
        presente: values.si ? true : values.no ? false : null  
      }))  
  
      const { error: exterioresError } = await supabase  
        .from('inspeccion_exteriores')  
        .insert(exterioresData)  
  
      if (exterioresError) throw exterioresError  
  
      // 5. Insertar inspección de coqueta  
      const coquetaData = Object.entries(data.coqueta).map(([item, values]) => ({  
        hoja_ingreso_id: hojaData.id,  
        item,  
        cantidad: values.cantidad,  
        presente: values.si ? true : values.no ? false : null  
      }))  
  
      const { error: coquetaError } = await supabase  
        .from('inspeccion_coqueta')  
        .insert(coquetaData)  
  
      if (coquetaError) throw coquetaError  
  
      // 6. Insertar inspección de motor  
      const motorData = Object.entries(data.motor).map(([item, values]) => ({  
        hoja_ingreso_id: hojaData.id,  
        item,  
        cantidad: values.cantidad,  
        presente: values.si ? true : values.no ? false : null  
      }))  
  
      const { error: motorError } = await supabase  
        .from('inspeccion_motor')  
        .insert(motorData)  
  
      if (motorError) throw motorError  
  
      // 7. Insertar puntos de daño  
      if (data.puntos.length > 0) {  
        const puntosData = data.puntos.map(punto => ({  
          hoja_ingreso_id: hojaData.id,  
          x_coordinate: punto.x,  
          y_coordinate: punto.y,  
          descripcion: punto.descripcion  
        }))  
  
        const { error: puntosError } = await supabase  
          .from('puntos_dano_carroceria')  
          .insert(puntosData)  
  
        if (puntosError) throw puntosError  
      }  
  
      return hojaData  
    } catch (error) {  
      console.error('Error al insertar hoja de ingreso:', error)  
      throw error  
    }  
  },  
  
  async GET_HOJA_INGRESO(vehiculoId: string): Promise<HojaIngresoData | null> {  
    try {  
      // 1. Obtener hoja principal  
      const { data: hojaData, error: hojaError } = await supabase  
        .from('hojas_ingreso')  
        .select('*')  
        .eq('vehiculo_id', vehiculoId)  
        .order('created_at', { ascending: false })  
        .limit(1)  
        .single()  
  
      if (hojaError || !hojaData) return null  
  
      // 2. Obtener inspecciones  
      const [interioresRes, exterioresRes, coquetaRes, motorRes, puntosRes] = await Promise.all([  
        supabase.from('inspeccion_interiores').select('*').eq('hoja_ingreso_id', hojaData.id),  
        supabase.from('inspeccion_exteriores').select('*').eq('hoja_ingreso_id', hojaData.id),  
        supabase.from('inspeccion_coqueta').select('*').eq('hoja_ingreso_id', hojaData.id),  
        supabase.from('inspeccion_motor').select('*').eq('hoja_ingreso_id', hojaData.id),  
        supabase.from('puntos_dano_carroceria').select('*').eq('hoja_ingreso_id', hojaData.id)  
      ])  
  
      // 3. Transformar datos a formato del componente  
      const transformarInspeccion = (items: any[]) => {  
        const resultado: Record<string, { cantidad: string; si: boolean; no: boolean }> = {}  
        items.forEach(item => {  
          resultado[item.item] = {  
            cantidad: item.cantidad || '',  
            si: item.presente === true,  
            no: item.presente === false  
          }  
        })  
        return resultado  
      }  
  
      const puntos = puntosRes.data?.map(punto => ({  
        x: punto.x_coordinate,  
        y: punto.y_coordinate,  
        id: punto.id,  
        descripcion: punto.descripcion  
      })) || []  
  
      return {  
        vehiculo_id: hojaData.vehiculo_id,  
        fecha: hojaData.fecha,  
        interiores: transformarInspeccion(interioresRes.data || []),  
        exteriores: transformarInspeccion(exterioresRes.data || []),  
        coqueta: transformarInspeccion(coquetaRes.data || []),  
        motor: transformarInspeccion(motorRes.data || []),  
        nivel_gasolina: hojaData.nivel_gasolina,  
        comentarios: hojaData.comentarios || '',  
        imagen_carroceria: hojaData.imagen_carroceria,  
        puntos  
      }  
    } catch (error) {  
      console.error('Error al obtener hoja de ingreso:', error)  
      return null  
    }  
  },  
  
  async UPDATE_HOJA_INGRESO(hojaId: string, data: HojaIngresoData): Promise<HojaIngresoType> {  
    try {  
      // Actualizar hoja principal  
      const { data: hojaData, error: hojaError } = await supabase  
        .from('hojas_ingreso')  
        .update({  
          nivel_gasolina: data.nivel_gasolina,  
          comentarios: data.comentarios,  
          updated_at: new Date().toISOString()  
        })  
        .eq('id', hojaId)  
        .select()  
        .single()  
  
      if (hojaError) throw hojaError  
  
      // Eliminar inspecciones existentes y recrear  
      await Promise.all([  
        supabase.from('inspeccion_interiores').delete().eq('hoja_ingreso_id', hojaId),  
        supabase.from('inspeccion_exteriores').delete().eq('hoja_ingreso_id', hojaId),  
        supabase.from('inspeccion_coqueta').delete().eq('hoja_ingreso_id', hojaId),  
        supabase.from('inspeccion_motor').delete().eq('hoja_ingreso_id', hojaId),  
        supabase.from('puntos_dano_carroceria').delete().eq('hoja_ingreso_id', hojaId)  
      ])  
  
      // Recrear inspecciones con nuevos datos  
      // (usar la misma lógica del INSERT)  
  
      return hojaData  
    } catch (error) {  
      console.error('Error al actualizar hoja de ingreso:', error)  
      throw error  
    }  
  },  
  
  async DELETE_HOJA_INGRESO(hojaId: string): Promise<void> {  
    try {  
      const { error } = await supabase  
        .from('hojas_ingreso')  
        .delete()  
        .eq('id', hojaId)  
  
      if (error) throw error  
    } catch (error) {  
      console.error('Error al eliminar hoja de ingreso:', error)  
      throw error  
    }  
  }  
}  
  
export default HOJA_INGRESO_SERVICES    