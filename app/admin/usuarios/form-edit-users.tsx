import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserType } from "@/services/USER_SERVICES";
import React, { useEffect, useState } from "react";

export default function EditUsersForm({ CurrentDataUSer }: { CurrentDataUSer?: UserType }) {
    const [form, setForm] = useState<UserType | null>();
    const [loading, setLoading] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        console.log("Formulario enviado:", form);
        // Aquí iría la lógica para guardar los cambios, por ejemplo una petición a la API
        // await saveUser(form);
        setLoading(false);
    };
    useEffect(() => {
        if (CurrentDataUSer) {
            setForm(CurrentDataUSer)
        }
    }, [CurrentDataUSer]);
    return (
        <main>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Nombre
                    </label>
                    <Input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Ingresa el nombre del usuario"
                        value={form?.perfil_nombre}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                    </label>
                    <Input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Ingresa el email del usuario"
                        value={form?.user_email}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                        Rol
                    </label>
                    <Select
                        onValueChange={(value) => setForm((prev) => ({ ...prev, role_name: value }))}
                        value={form?.role_name}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Selecciona un rol" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="admin">Administrador</SelectItem>
                            <SelectItem value="cliente">Cliente</SelectItem>
                            <SelectItem value="taller">Taller</SelectItem>
                            <SelectItem value="aseguradora">Aseguradora</SelectItem>
                            <SelectItem value="tecnico">Tecnico</SelectItem>
                        </SelectContent>
                    </Select>

                </div>
                <div className="flex justify-end">
                    <Button
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Guardando..." : "Guardar Cambios"}
                    </Button>
                </div>
            </form>
        </main>
    );
}