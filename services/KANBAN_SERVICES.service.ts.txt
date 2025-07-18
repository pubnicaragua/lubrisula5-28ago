import { AxiosDelete, AxiosGet, AxiosPatch, AxiosPost } from "./AxiosServices.module";  
  
export type KanbanColumnType = {  
  id?: string;  
  title: string;  
  description?: string;  
  color?: string;  
  position: number;  
  created_at?: string;  
  updated_at?: string;  
}  
  
export type KanbanCardType = {  
  id?: string;  
  column_id?: string;  
  title: string;  
  description?: string;  
  client_name?: string;  
  vehicle_id?: string;  
  priority?: string;  
  position?: number;  
  created_by?: string;  
  created_at?: string;  
  updated_at?: string;  
  due_date?: string;  
  vehicle?: any;  
}  
  
const KANBAN_SERVICES = {  
  // Obtener todas las columnas  
  async GET_COLUMNS(): Promise<KanbanColumnType[]> {  
    const columns: KanbanColumnType[] = await AxiosGet({  
      path: `/kanban_columns?order=position.asc`  
    });  
    return columns;  
  },  
  
  // Obtener plantillas disponibles  
  async GET_TEMPLATES(): Promise<any[]> {  
    const templates = await AxiosGet({  
      path: `/kanban_templates?order=created_at.asc`  
    });  
    return templates;  
  },  
  
  // Obtener todas las tarjetas con relaciones  
  async GET_CARDS(): Promise<KanbanCardType[]> {  
    const cards: KanbanCardType[] = await AxiosGet({  
      path: `/kanban_cards?select=*,vehicle:vehicle_id(*)&order=position.asc`  
    });  
    return cards;  
  },  
  
  // Obtener vehículos disponibles  
  async GET_VEHICLES(): Promise<any[]> {  
    const vehicles = await AxiosGet({  
      path: `/vehicles?order=created_at.desc`  
    });  
    return vehicles;  
  },  
  
  // Crear columnas por defecto  
  async CREATE_DEFAULT_COLUMNS(): Promise<KanbanColumnType[]> {  
    const defaultColumns = [  
      { title: "Por Hacer", description: "Tareas pendientes", color: "#3b82f6", position: 0 },  
      { title: "En Proceso", description: "Tareas en curso", color: "#f59e0b", position: 1 },  
      { title: "En Revisión", description: "Tareas en revisión", color: "#8b5cf6", position: 2 },  
      { title: "Completado", description: "Tareas finalizadas", color: "#10b981", position: 3 },  
    ];  
  
    const columns: KanbanColumnType[] = await AxiosPost({  
      path: `/kanban_columns`,  
      payload: defaultColumns  
    });  
    return columns;  
  },  
  
  // Crear nueva columna  
  async CREATE_COLUMN(columnData: Partial<KanbanColumnType>): Promise<KanbanColumnType> {  
    const columns = await this.GET_COLUMNS();  
    const maxPosition = columns.length > 0   
      ? Math.max(...columns.map(col => col.position)) + 1   
      : 0;  
  
    const columnToCreate = {  
      ...columnData,  
      position: maxPosition  
    };  
  
    const column: KanbanColumnType = await AxiosPost({  
      path: `/kanban_columns`,  
      payload: columnToCreate  
    });  
    return column[0];  
  },  
  
  // Actualizar columna  
  async UPDATE_COLUMN(columnId: string, columnData: Partial<KanbanColumnType>): Promise<KanbanColumnType> {  
    const column: KanbanColumnType = await AxiosPatch({  
      path: `/kanban_columns?id=eq.${columnId}`,  
      payload: {  
        ...columnData,  
        updated_at: new Date().toISOString()  
      }  
    });  
    return column[0];  
  },  
  
  // Eliminar columna  
  async DELETE_COLUMN(columnId: string): Promise<any> {  
    const result = await AxiosDelete({  
      path: `/kanban_columns?id=eq.${columnId}`,  
      payload: {}  
    });  
    return result;  
  },  
  
  // Aplicar plantilla de columnas  
  async APPLY_TEMPLATE(templateType: string): Promise<KanbanColumnType[]> {  
    // Eliminar columnas existentes del usuario actual  
    await AxiosDelete({  
      path: `/kanban_columns?user_id=eq.${await this.getCurrentUserId()}`,  
      payload: {}  
    });  
  
    // Definir plantillas  
    const templates: { [key: string]: Partial<KanbanColumnType>[] } = {  
      mecanica: [  
        { title: "Por iniciar", color: "#f97316", position: 0 },  
        { title: "Diagnóstico", color: "#eab308", position: 1 },  
        { title: "En reparación", color: "#3b82f6", position: 2 },  
        { title: "Pruebas", color: "#a855f7", position: 3 },  
        { title: "Completado", color: "#22c55e", position: 4 },  
      ],  
      carroceria: [  
        { title: "Por iniciar", color: "#f97316", position: 0 },  
        { title: "Desmontaje", color: "#eab308", position: 1 },  
        { title: "Enderezado", color: "#3b82f6", position: 2 },  
        { title: "Preparación", color: "#a855f7", position: 3 },  
        { title: "Pintura", color: "#ec4899", position: 4 },  
        { title: "Montaje", color: "#06b6d4", position: 5 },  
        { title: "Completado", color: "#22c55e", position: 6 },  
      ],  
      neumaticos: [  
        { title: "Por iniciar", color: "#f97316", position: 0 },  
        { title: "Diagnóstico", color: "#eab308", position: 1 },  
        { title: "En proceso", color: "#3b82f6", position: 2 },  
        { title: "Completado", color: "#22c55e", position: 3 },  
      ],  
    };  
  
    const templateColumns = templates[templateType] || templates.mecanica;  
      
    const columns: KanbanColumnType[] = await AxiosPost({  
      path: `/kanban_columns`,  
      payload: templateColumns  
    });  
    return columns;  
  },  
  
  // Crear nueva tarjeta  
  async CREATE_CARD(cardData: Partial<KanbanCardType>): Promise<KanbanCardType> {  
    const cardsInColumn = await AxiosGet({  
      path: `/kanban_cards?column_id=eq.${cardData.column_id}&select=position`  
    });  
      
    const maxPosition = cardsInColumn.length > 0   
      ? Math.max(...cardsInColumn.map((card: any) => card.position)) + 1   
      : 0;  
  
    const cardToCreate = {  
      ...cardData,  
      position: maxPosition  
    };  
  
    const card: KanbanCardType = await AxiosPost({  
      path: `/kanban_cards`,  
      payload: cardToCreate  
    });  
    return card[0];  
  },  
  
  // Actualizar posición de tarjeta  
  async UPDATE_CARD_POSITION(cardId: string, updateData: { column_id: string; position: number }): Promise<KanbanCardType> {  
    const card: KanbanCardType = await AxiosPatch({  
      path: `/kanban_cards?id=eq.${cardId}`,  
      payload: {  
        column_id: updateData.column_id,  
        position: updateData.position,  
        updated_at: new Date().toISOString()  
      }  
    });  
    return card[0];  
  },  
  
  // Función auxiliar para obtener el ID del usuario actual  
  async getCurrentUserId(): Promise<string> {  
    // Implementar según tu sistema de autenticación  
    return "current-user-id"; // Reemplazar con lógica real  
  }  
};  
  
export default KANBAN_SERVICES;
