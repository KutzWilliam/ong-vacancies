// src/app/menu/edit-vacancy/[id]/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getVacancyById, updateVacancy, VacancyUpdateData } from '@/lib/api';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Imports de Componentes e Ícones
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, FileText, Heart } from "lucide-react";

const vacancySchema = z.object({
    position: z.string().min(1, 'Cargo é obrigatório'),
    description: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres'),
    category: z.string().min(1, 'Categoria é obrigatória'),
    start_date: z.string().min(1, 'Data de início é obrigatória'),
    end_date: z.string().min(1, 'Data de término é obrigatória'),
    localization: z.string().min(1, 'Localização é obrigatória'),
});

type VacancyFormData = z.infer<typeof vacancySchema>;

export default function EditVacancyPage() {
    const router = useRouter();
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors, isValid },
    } = useForm<VacancyFormData>({
        resolver: zodResolver(vacancySchema),
        mode: 'onChange',
    });

    useEffect(() => {
        if (!id) {
             router.push('/menu');
             return;
        }
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }

        const fetchVacancy = async () => {
            try {
                setLoading(true);
                const response = await getVacancyById(id as string);
                if (response.ok) {
                    const data = await response.json();
                    // Formata as datas para o formato yyyy-MM-dd
                    data.start_date = new Date(data.start_date).toISOString().split('T')[0];
                    data.end_date = new Date(data.end_date).toISOString().split('T')[0];
                    reset(data);
                } else {
                    throw new Error('Falha ao carregar os dados da vaga.');
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Ocorreu um erro desconhecido.');
            } finally {
                setLoading(false);
            }
        };

        fetchVacancy();
    }, [id, router, reset]);

    const onSubmit = async (data: VacancyFormData) => {
        if (!id) return;
        try {
            setUpdating(true);
            setError(null);
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/login');
                return;
            }

            const response = await updateVacancy(token, id as string, data);
            if (response.ok) {
                router.push('/menu');
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Erro ao atualizar a vaga');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ocorreu um erro desconhecido.');
        } finally {
            setUpdating(false);
        }
    };
    
    if (loading) {
        return <div className="flex h-screen items-center justify-center">Carregando vaga...</div>;
    }
    
    return (
        <div className="min-h-screen bg-gray-50">
             <header className="bg-white border-b sticky top-0 z-10">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex items-center justify-between">
                         <Button variant="ghost" onClick={() => router.push('/menu')}>
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Voltar ao Dashboard
                        </Button>
                        <div className="flex items-center gap-2">
                            <Heart className="h-6 w-6 text-blue-600" />
                            <span className="font-bold text-blue-600">VolunteerConnect</span>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-6">
                 <div className="max-w-3xl mx-auto">
                    <Card>
                         <CardHeader>
                             <CardTitle className="flex items-center gap-2">
                                 <FileText className="h-5 w-5" />
                                 Editar Vaga
                             </CardTitle>
                             <CardDescription>
                                 Atualize as informações da vaga abaixo.
                             </CardDescription>
                         </CardHeader>
                         <CardContent>
                             <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="position">Título da Vaga *</Label>
                                    <Input id="position" {...register('position')} className={errors.position ? "border-red-500" : ""}/>
                                    {errors.position && <p className="text-sm text-red-500">{errors.position.message}</p>}
                                </div>
                                
                                <div className="space-y-2">
                                     <Label htmlFor="category">Categoria *</Label>
                                     <select
                                        {...register('category')}
                                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.category ? 'border-red-300' : 'border-gray-300'
                                            }`}
                                    >
                                        <option value="">Selecione uma categoria</option>
                                        <option value="educacao">Educação</option>
                                        <option value="saude">Saúde</option>
                                        <option value="meio-ambiente">Meio Ambiente</option>
                                        <option value="social">Social</option>
                                        <option value="outros">Outros</option>
                                    </select>
                                     {errors.category && <p className="text-sm text-red-500">{errors.category.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Descrição da Vaga *</Label>
                                    <Textarea id="description" {...register('description')} rows={5} className={errors.description ? "border-red-500" : ""}/>
                                     {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
                                </div>
                                
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                     <div className="space-y-2">
                                        <Label htmlFor="start_date">Data de Início *</Label>
                                         <Input id="start_date" type="date" {...register('start_date')} className={errors.start_date ? "border-red-500" : ""}/>
                                         {errors.start_date && <p className="text-sm text-red-500">{errors.start_date.message}</p>}
                                     </div>
                                      <div className="space-y-2">
                                        <Label htmlFor="end_date">Data de Fim *</Label>
                                         <Input id="end_date" type="date" {...register('end_date')} className={errors.end_date ? "border-red-500" : ""}/>
                                         {errors.end_date && <p className="text-sm text-red-500">{errors.end_date.message}</p>}
                                     </div>
                                 </div>

                                <div className="space-y-2">
                                    <Label htmlFor="localization">Localização *</Label>
                                    <Input id="localization" {...register('localization')} className={errors.localization ? "border-red-500" : ""}/>
                                    {errors.localization && <p className="text-sm text-red-500">{errors.localization.message}</p>}
                                </div>

                                {error && (
                                    <Alert variant="destructive">
                                        <AlertDescription>{error}</AlertDescription>
                                    </Alert>
                                )}

                                <div className="flex justify-end gap-4 pt-4 border-t">
                                     <Button type="button" variant="outline" onClick={() => router.back()}>
                                        Cancelar
                                    </Button>
                                    <Button type="submit" disabled={!isValid || updating} className="bg-blue-600 hover:bg-blue-700">
                                        {updating ? 'Salvando...' : 'Salvar Alterações'}
                                    </Button>
                                </div>
                            </form>
                         </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}