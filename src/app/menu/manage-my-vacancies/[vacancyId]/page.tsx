// src/app/menu/manage-my-vacancies/[vacancyId]/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getMyProfile, getVacancyById, getRegistrationsForVacancy, createReportForVolunteer } from '@/lib/api';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Imports de Componentes e Ícones
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { ArrowLeft, Edit, Mail, User, XCircle, Info, Users, Loader2 } from 'lucide-react';

type UserProfile = {
    id: string; name: string; email: string; description: string; localization: string; type: string;
};

type Vacancy = {
    id: string; position: string; description: string; category: string; start_date: string; end_date: string; localization: string;
};

type Registration = {
    id: string;
    user: { id: string; name: string; email: string; description: string; localization: string; };
    vacancy: Vacancy;
    status: 'pending' | 'accepted' | 'rejected';
};

const reportSchema = z.object({
    description: z.string().min(10, 'A descrição deve ter pelo menos 10 caracteres.'),
    volunteers_quantity: z.number().min(1, 'A quantidade deve ser no mínimo 1.').int(),
    worked_hours: z.number().min(1, 'As horas devem ser no mínimo 1.').int(),
});

type ReportFormData = z.infer<typeof reportSchema>;

export default function VacancyParticipantsPage() {
    const router = useRouter();
    const { vacancyId } = useParams();
    const [vacancy, setVacancy] = useState<Vacancy | null>(null);
    const [registrations, setRegistrations] = useState<Registration[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [creatingReport, setCreatingReport] = useState(false);
    const [createReportError, setCreateReportError] = useState<string | null>(null);

    const { register, handleSubmit, reset, formState: { errors, isValid } } = useForm<ReportFormData>({
        resolver: zodResolver(reportSchema),
        mode: 'onChange',
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token || !vacancyId) {
            router.push('/login');
            return;
        }

        const fetchData = async () => {
            try {
                setLoading(true);
                // O restante da sua lógica de fetch... (getMyProfile, getVacancyById, etc)
                const [profileRes, vacancyRes, registrationsRes] = await Promise.all([
                    getMyProfile(token),
                    getVacancyById(vacancyId as string),
                    getRegistrationsForVacancy(token)
                ]);

                if (!profileRes.ok || !vacancyRes.ok || !registrationsRes.ok) {
                    throw new Error('Falha ao carregar dados essenciais.');
                }

                const profileData = await profileRes.json();
                if (profileData.user.type !== 'ong') {
                    router.push('/menu');
                    return;
                }

                const vacancyData = await vacancyRes.json();
                setVacancy(vacancyData);

                const registrationsData = await registrationsRes.json();
                let filtered: Registration[] = [];
                registrationsData.vacancies?.forEach((v: { id: string, registrations: Registration[] }) => {
                    if (v.id === vacancyId) filtered = v.registrations;
                });
                setRegistrations(filtered.filter(r => r.status === 'accepted')); // Mostrar apenas participantes aceitos

            } catch (err) {
                console.error('Erro ao buscar dados:', err);
                setError('Não foi possível carregar os dados.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [router, vacancyId]);

    const onSubmitReport = async (data: ReportFormData, volunteerId: string) => {
        try {
            setCreatingReport(true);
            setCreateReportError(null);
            const token = localStorage.getItem('token');
            if (!token) throw new Error("Token não encontrado");

            const response = await createReportForVolunteer(token, { ...data, volunteerId });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro ao criar relatório.');
            }
            
            // Sucesso! Fechar dialog
            document.getElementById('close-dialog-btn')?.click();
            reset();

        } catch (error) {
            setCreateReportError(error instanceof Error ? error.message : "Erro desconhecido.");
        } finally {
            setCreatingReport(false);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen bg-gray-50">Carregando participantes...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white border-b sticky top-0 z-10">
                 <div className="container mx-auto px-4 py-3">
                     <Button variant="ghost" onClick={() => router.push('/menu/manage-my-vacancies')}>
                         <ArrowLeft className="h-4 w-4 mr-2" />
                         Voltar para Minhas Vagas
                     </Button>
                 </div>
            </header>
            <main className="container mx-auto p-4 md:p-6">
                <div className="max-w-4xl mx-auto">
                    {error && (
                        <Alert variant="destructive" className="mb-4">
                            <XCircle className="h-4 w-4" />
                            <AlertTitle>Erro</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                    <Card>
                        <CardHeader>
                            <CardTitle>Participantes da Vaga: {vacancy?.position}</CardTitle>
                            <CardDescription>Gerencie os voluntários aceitos e crie relatórios de participação.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {registrations.length > 0 ? (
                                <ul className="space-y-4">
                                    {registrations.map((reg) => (
                                        <li key={reg.id} className="p-4 border rounded-lg flex flex-col md:flex-row items-start gap-4">
                                            <Avatar className="h-12 w-12">
                                                <AvatarFallback>{reg.user.name.substring(0, 2)}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1">
                                                <h3 className="text-lg font-semibold">{reg.user.name}</h3>
                                                <p className="text-sm text-gray-500 flex items-center gap-2"><Mail className="h-4 w-4" /> {reg.user.email}</p>
                                                <p className="text-sm text-gray-600 mt-2 bg-gray-50 p-2 rounded">{reg.user.description}</p>
                                            </div>
                                            <Dialog onOpenChange={() => { reset(); setCreateReportError(null); }}>
                                                <DialogTrigger asChild>
                                                    <Button size="sm" className="mt-2 md:mt-0">
                                                        <Edit className="h-4 w-4 mr-2" />
                                                        Criar Relatório
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="sm:max-w-[425px]">
                                                    <DialogHeader>
                                                        <DialogTitle>Criar Relatório para {reg.user.name}</DialogTitle>
                                                    </DialogHeader>
                                                    <form onSubmit={handleSubmit((data) => onSubmitReport(data, reg.user.id))} className="space-y-4 py-4">
                                                        <div className="space-y-2">
                                                            <Label htmlFor="description">Descrição das Atividades</Label>
                                                            <Textarea id="description" {...register('description')} rows={4} placeholder="Descreva o que foi realizado..." />
                                                            {errors.description && <p className="text-sm text-red-600">{errors.description.message}</p>}
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div className="space-y-2">
                                                                <Label htmlFor="volunteers_quantity">Qtd. Voluntários</Label>
                                                                <Input id="volunteers_quantity" type="number" {...register('volunteers_quantity', { valueAsNumber: true })} />
                                                                {errors.volunteers_quantity && <p className="text-sm text-red-600">{errors.volunteers_quantity.message}</p>}
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label htmlFor="worked_hours">Horas Trabalhadas</Label>
                                                                <Input id="worked_hours" type="number" {...register('worked_hours', { valueAsNumber: true })} />
                                                                {errors.worked_hours && <p className="text-sm text-red-600">{errors.worked_hours.message}</p>}
                                                            </div>
                                                        </div>
                                                        {createReportError && <p className="text-sm text-red-600">{createReportError}</p>}
                                                        <DialogFooter>
                                                            <DialogClose asChild>
                                                                <Button id="close-dialog-btn" type="button" variant="secondary">Cancelar</Button>
                                                            </DialogClose>
                                                            <Button type="submit" disabled={!isValid || creatingReport}>
                                                                {creatingReport && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                                                {creatingReport ? 'Salvando...' : 'Salvar Relatório'}
                                                            </Button>
                                                        </DialogFooter>
                                                    </form>
                                                </DialogContent>
                                            </Dialog>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="text-center py-10">
                                     <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold text-gray-700">Nenhum participante aceito</h3>
                                    <p className="text-gray-500">Voluntários aceitos para esta vaga aparecerão aqui.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}