// src/app/menu/manage-applications/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getMyProfile, getRegistrationsForVacancy, updateVacancyRegistrationStatus } from '@/lib/api';

// Imports de Componentes e Ícones
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, MessageSquare, ThumbsDown, ThumbsUp } from "lucide-react";
import { Alert } from '@/components/ui/alert';

type Registration = {
    id: string;
    user: {
        id: string;
        name: string;
        email: string;
        description: string;
        localization: string;
    };
    vacancy: {
        id: string;
        position: string;
        description: string;
        category: string;
    };
    status: 'pending' | 'accepted' | 'rejected';
    created_at: string;
};

export default function ManageApplicationsPage() {
    const router = useRouter();
    const [registrations, setRegistrations] = useState<Registration[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

     const fetchRegistrations = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }
        try {
            const registrationsResponse = await getRegistrationsForVacancy(token);
            if (registrationsResponse.ok) {
                const registrationsData = await registrationsResponse.json();
                let allRegistrations: Registration[] = [];
                if (Array.isArray(registrationsData?.vacancies)) {
                    registrationsData.vacancies.forEach((vacancy: { registrations: Registration[] }) => {
                        if (Array.isArray(vacancy?.registrations)) {
                            allRegistrations = allRegistrations.concat(vacancy.registrations);
                        }
                    });
                }
                setRegistrations(allRegistrations);
            } else {
                throw new Error('Falha ao recarregar candidaturas');
            }
        } catch (err) {
            setError('Erro ao recarregar candidaturas.');
        }
    };


    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }
        const initialFetch = async () => {
            setLoading(true);
            try {
                const profileResponse = await getMyProfile(token);
                if (!profileResponse.ok) throw new Error('Falha ao carregar perfil');
                const profileData = await profileResponse.json();
                if (profileData.user.type !== 'ong') {
                    router.push('/menu');
                    return;
                }
                await fetchRegistrations();
            } catch (err) {
                console.error('Erro ao buscar dados:', err);
                setError('Não foi possível carregar os dados.');
                localStorage.removeItem('token');
                router.push('/login');
            } finally {
                setLoading(false);
            }
        };
        initialFetch();
    }, [router]);

    const handleUpdateStatus = async (registrationId: string, status: 'accepted' | 'rejected') => {
        try {
            setUpdatingStatus(registrationId);
            setError(null);

            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/login');
                return;
            }

            const response = await updateVacancyRegistrationStatus(token, registrationId, { status });

            if (response.ok) {
                await fetchRegistrations();
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Erro ao atualizar status da candidatura');
            }
        } catch (error) {
            setError('Erro ao atualizar status. Tente novamente.');
        } finally {
            setUpdatingStatus(null);
        }
    };

    if (loading) {
        return <div className="flex h-screen items-center justify-center">Carregando candidaturas...</div>;
    }

    const renderRegistrationCard = (registration: Registration) => (
         <div key={registration.id} className="p-4 hover:bg-gray-50 border-b">
            <div className="flex flex-col md:flex-row md:items-start gap-4">
                <Avatar className="h-12 w-12">
                    <AvatarFallback>{registration.user.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-1">
                        <h3 className="font-medium">{registration.user.name}</h3>
                        <span className="text-sm text-gray-500">
                            Candidatura em {new Date(registration.created_at).toLocaleDateString()}
                        </span>
                    </div>
                    <p className="text-sm text-blue-600 mb-2">
                        Para: {registration.vacancy?.position || 'Vaga não especificada'}
                    </p>
                    <div className="bg-gray-50 p-3 rounded-lg mb-3">
                        <p className="text-sm text-gray-700">{registration.user.description || 'O candidato não forneceu uma descrição.'}</p>
                    </div>
                    {registration.status === 'pending' && (
                        <div className="flex flex-col md:flex-row gap-2 md:justify-end">
                            <Button variant="outline" className="text-sm" disabled={updatingStatus === registration.id}>
                                <MessageSquare className="h-4 w-4 mr-2" />
                                Enviar Mensagem
                            </Button>
                            <Button variant="outline" className="text-red-500 border-red-200 hover:bg-red-50" onClick={() => handleUpdateStatus(registration.id, 'rejected')} disabled={updatingStatus === registration.id}>
                                <ThumbsDown className="h-4 w-4 mr-2"/>
                                {updatingStatus === registration.id ? 'Rejeitando...' : 'Rejeitar'}
                            </Button>
                            <Button className="bg-green-600 hover:bg-green-700" onClick={() => handleUpdateStatus(registration.id, 'accepted')} disabled={updatingStatus === registration.id}>
                                <ThumbsUp className="h-4 w-4 mr-2"/>
                                {updatingStatus === registration.id ? 'Aceitando...' : 'Aceitar'}
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    const pendingRegistrations = registrations.filter(r => r.status === 'pending');
    const acceptedRegistrations = registrations.filter(r => r.status === 'accepted');
    const rejectedRegistrations = registrations.filter(r => r.status === 'rejected');
    
    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold">Gerenciamento de Candidaturas</h1>
                        <p className="text-gray-500">Analise e gerencie as candidaturas para suas vagas.</p>
                    </div>
                     <Button variant="outline" onClick={() => router.push('/menu')}>
                        <ArrowLeft className="h-4 w-4 mr-2"/>
                        Voltar ao Dashboard
                    </Button>
                </div>
                 {error && <Alert variant="destructive" className="mb-4">{error}</Alert>}
                 <Card>
                     <Tabs defaultValue="pendentes" className="w-full">
                         <TabsList className="grid w-full grid-cols-3">
                             <TabsTrigger value="pendentes">Pendentes <Badge className="ml-2">{pendingRegistrations.length}</Badge></TabsTrigger>
                             <TabsTrigger value="aceitas">Aceitas <Badge className="ml-2">{acceptedRegistrations.length}</Badge></TabsTrigger>
                             <TabsTrigger value="rejeitadas">Rejeitadas <Badge variant="destructive" className="ml-2">{rejectedRegistrations.length}</Badge></TabsTrigger>
                         </TabsList>
                         <TabsContent value="pendentes">
                            <CardContent className='p-0'>
                                {pendingRegistrations.length > 0 ? pendingRegistrations.map(renderRegistrationCard) : <p className="p-6 text-center text-gray-500">Nenhuma candidatura pendente.</p>}
                            </CardContent>
                         </TabsContent>
                         <TabsContent value="aceitas">
                             <CardContent className='p-0'>
                                {acceptedRegistrations.length > 0 ? acceptedRegistrations.map(renderRegistrationCard) : <p className="p-6 text-center text-gray-500">Nenhuma candidatura aceita.</p>}
                            </CardContent>
                         </TabsContent>
                         <TabsContent value="rejeitadas">
                              <CardContent className='p-0'>
                                {rejectedRegistrations.length > 0 ? rejectedRegistrations.map(renderRegistrationCard) : <p className="p-6 text-center text-gray-500">Nenhuma candidatura rejeitada.</p>}
                            </CardContent>
                         </TabsContent>
                     </Tabs>
                </Card>
            </div>
        </div>
    );
}