// src/app/menu/manage-my-vacancies/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getMyProfile, listAllVacancies } from '@/lib/api';
import Link from 'next/link';

// Imports de Componentes e Ícones
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Edit, FileText, Grid, Heart, LogOut, MapPin, Plus, Users, XCircle, Briefcase, CheckCircle, Settings } from "lucide-react";

type UserProfile = {
    id: string;
    name: string;
    email: string;
    description: string;
    localization: string;
    type: "user" | "ong";
};

type Vacancy = {
    id: string;
    userId: string; // Adicionado para permitir a filtragem
    position: string;
    description: string;
    category: string;
    start_date: string;
    end_date: string;
    localization: string;
    created_at: string;
    updated_at: string;
};

export default function ManageMyVacanciesPage() {
    const router = useRouter();
    const [user, setUser] = useState<UserProfile | null>(null);
    const [myVacancies, setMyVacancies] = useState<Vacancy[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }

        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                const profileResponse = await getMyProfile(token);
                if (!profileResponse.ok) throw new Error('Falha ao carregar perfil');
                const profileData = await profileResponse.json();
                setUser(profileData.user);

                if (profileData.user.type !== 'ong') {
                    router.push('/menu');
                    return;
                }

                const vacanciesResponse = await listAllVacancies();
                if (!vacanciesResponse.ok) throw new Error('Falha ao carregar vagas');
                const vacanciesData = await vacanciesResponse.json();
                const allVacancies = Array.isArray(vacanciesData?.vacancies) ? vacanciesData.vacancies : [];
                
                // Filtra as vagas para mostrar apenas as criadas pela ONG logada.
                // NOTA: Isso assume que a API retorna um `userId` ou similar em cada vaga.
                // Se a API não fornecer isso, a filtragem pode não funcionar como esperado.
                const filteredVacancies = allVacancies.filter((v: Vacancy) => v.userId === profileData.user.id);
                setMyVacancies(filteredVacancies);

            } catch (err) {
                console.error('Erro ao buscar dados:', err);
                setError('Não foi possível carregar os dados. Tente fazer login novamente.');
                localStorage.removeItem('token');
                router.push('/login');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [router]);

    const getInitials = (name: string) => {
        const names = name.split(' ');
        if (names.length === 1) return names[0].substring(0, 2).toUpperCase();
        return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen bg-gray-50">Carregando suas vagas...</div>;
    }

    // Header Comum para manter a consistência
    const renderHeader = () => (
         <header className="w-full py-4 px-4 md:px-6 bg-white border-b sticky top-0 z-20">
             <div className="container mx-auto flex justify-between items-center">
                 <div className="flex items-center gap-2">
                     <Heart className="h-6 w-6 text-blue-600" />
                     <span className="text-lg font-bold text-blue-600">VolunteerConnect</span>
                 </div>
                {user?.type === 'ong' && (
                     <nav className="hidden md:flex items-center gap-6">
                         <Link href="/menu" className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-blue-600">
                             <Grid className="h-4 w-4" />
                             <span>Dashboard</span>
                         </Link>
                         <Link href="/menu/manage-my-vacancies" className="flex items-center gap-1 text-sm font-medium text-blue-600 border-b-2 border-blue-600 pb-1">
                             <FileText className="h-4 w-4" />
                             <span>Gerenciar Vagas</span>
                         </Link>
                         <Link href="/menu/manage-applications" className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-blue-600">
                             <Users className="h-4 w-4" />
                             <span>Gerenciar Candidaturas</span>
                         </Link>
                     </nav>
                 )}
                 <div className="flex items-center gap-3">
                     <DropdownMenu>
                         <DropdownMenuTrigger asChild>
                             <Button variant="ghost" className="relative rounded-full h-8 w-8 p-0">
                                 <Avatar className="h-8 w-8">
                                     <AvatarImage src="/placeholder.svg" alt={user?.name} />
                                     <AvatarFallback>{user ? getInitials(user.name) : 'U'}</AvatarFallback>
                                 </Avatar>
                             </Button>
                         </DropdownMenuTrigger>
                         <DropdownMenuContent className="w-56" align="end" forceMount>
                             <DropdownMenuLabel className="font-normal">
                                 <div className="flex flex-col space-y-1">
                                     <p className="text-sm font-medium leading-none">{user?.name}</p>
                                     <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                                 </div>
                             </DropdownMenuLabel>
                             <DropdownMenuSeparator />
                              <DropdownMenuGroup>
                                  <Link href="/menu" passHref><DropdownMenuItem>Menu Principal</DropdownMenuItem></Link>
                                  <Link href="/menu/create-vacancy" passHref><DropdownMenuItem>Criar Nova Vaga</DropdownMenuItem></Link>
                                  <Link href="/menu/manage-applications" passHref><DropdownMenuItem>Gerenciar Candidaturas</DropdownMenuItem></Link>
                             </DropdownMenuGroup>
                             <DropdownMenuSeparator />
                             <DropdownMenuItem onClick={() => { localStorage.removeItem('token'); router.push('/login'); }}>
                                 <LogOut className="mr-2 h-4 w-4" />
                                 <span>Sair</span>
                             </DropdownMenuItem>
                         </DropdownMenuContent>
                     </DropdownMenu>
                 </div>
             </div>
         </header>
    );

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            {user && renderHeader()}
            <main className="flex-1 container mx-auto p-4 md:p-6">
                {error && (
                     <Alert variant="destructive" className="mb-4">
                        <XCircle className="h-4 w-4" />
                        <AlertTitle>Erro</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Gerenciar Minhas Vagas</CardTitle>
                            <CardDescription>Visualize, edite e gerencie os participantes de suas vagas publicadas.</CardDescription>
                        </div>
                        <Button onClick={() => router.push('/menu/create-vacancy')}>
                            <Plus className="h-4 w-4 mr-2" />
                            Nova Vaga
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {myVacancies.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {myVacancies.map((vacancy) => (
                                    <Card key={vacancy.id} className="flex flex-col">
                                        <CardHeader>
                                            <CardTitle className="truncate">{vacancy.position}</CardTitle>
                                            <Badge variant="secondary">{vacancy.category}</Badge>
                                        </CardHeader>
                                        <CardContent className="flex-grow">
                                            <p className="text-sm text-gray-500 line-clamp-3 mb-4">{vacancy.description}</p>
                                            <div className="space-y-2">
                                                <div className="flex items-center text-sm text-gray-500">
                                                    <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                                                    <span>{vacancy.localization}</span>
                                                </div>
                                                <div className="flex items-center text-sm text-gray-500">
                                                    <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                                                    <span>{new Date(vacancy.start_date).toLocaleDateString()} - {new Date(vacancy.end_date).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </CardContent>
                                        <CardFooter className="border-t pt-4 flex justify-end gap-2">
                                            <Button variant="outline" size="sm" onClick={() => router.push(`/menu/edit-vacancy/${vacancy.id}`)}>
                                                <Settings className="h-4 w-4 mr-2" />
                                                Editar
                                            </Button>
                                            <Button size="sm" onClick={() => router.push(`/menu/manage-my-vacancies/${vacancy.id}`)}>
                                                <Users className="h-4 w-4 mr-2" />
                                                Participantes
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-10">
                                <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-700">Nenhuma vaga publicada</h3>
                                <p className="text-gray-500">Clique em "Nova Vaga" para começar a recrutar voluntários.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}