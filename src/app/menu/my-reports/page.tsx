// src/app/menu/my-reports/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getMyProfile, getMyReport } from '@/lib/api';
import Link from 'next/link';

// Imports de Componentes e Ícones
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Briefcase, CheckCircle, Clock, FileText, Heart, LogOut, Users, XCircle, Home } from "lucide-react";

type UserProfile = {
    id: string; name: string; email: string; description: string; localization: string; type: "user" | "ong";
};

type Report = {
    id: string;
    description: string;
    volunteers_quantity: number;
    worked_hours: string; // Mantido como string, conforme o original
};

export default function MyReportsPage() {
    const router = useRouter();
    const [user, setUser] = useState<UserProfile | null>(null);
    const [reports, setReports] = useState<Report[]>([]);
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

                if (profileData.user.type !== 'user') {
                    router.push('/menu'); // ONGs não têm esta página
                    return;
                }

                const reportsResponse = await getMyReport(token);
                if (!reportsResponse.ok) throw new Error('Falha ao carregar relatórios');
                const reportsData = await reportsResponse.json();
                setReports(Array.isArray(reportsData?.reports) ? reportsData.reports : []);

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
        return <div className="flex justify-center items-center h-screen bg-gray-50">Carregando seus relatórios...</div>;
    }

     // Header Comum
    const renderHeader = () => (
         <header className="w-full py-4 px-4 md:px-6 bg-white border-b sticky top-0 z-20">
             <div className="container mx-auto flex justify-between items-center">
                 <div className="flex items-center gap-2">
                     <Heart className="h-6 w-6 text-blue-600" />
                     <span className="text-lg font-bold text-blue-600">VolunteerConnect</span>
                 </div>
                 <nav className="hidden md:flex items-center gap-6">
                     <Link href="/menu" className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-blue-600">
                         <Briefcase className="h-4 w-4" />
                         <span>Encontrar Vagas</span>
                     </Link>
                     <Link href="/menu/my-reports" className="flex items-center gap-1 text-sm font-medium text-blue-600 border-b-2 border-blue-600 pb-1">
                         <CheckCircle className="h-4 w-4" />
                         <span>Meus Relatórios</span>
                     </Link>
                 </nav>
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
                                    <Link href="/menu/my-reports" passHref><DropdownMenuItem>Meus Relatórios</DropdownMenuItem></Link>
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
                            <CardTitle>Meus Relatórios de Voluntariado</CardTitle>
                            <CardDescription>Aqui estão os relatórios de atividades gerados pelas ONGs para você.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {reports.length > 0 ? (
                                <ul className="space-y-4">
                                    {reports.map((report) => (
                                        <li key={report.id} className="border rounded-lg p-4 bg-white shadow-sm">
                                            <p className="text-gray-800 mb-4">{report.description}</p>
                                            <div className="flex flex-col md:flex-row md:items-center gap-4 text-sm text-gray-600 border-t pt-3">
                                                <div className="flex items-center gap-2">
                                                    <Users className="h-4 w-4 text-blue-500" />
                                                    <strong>Voluntários na atividade:</strong>
                                                    <span>{report.volunteers_quantity}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Clock className="h-4 w-4 text-green-500" />
                                                    <strong>Horas Trabalhadas:</strong>
                                                    <span>{report.worked_hours}</span>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="text-center py-10">
                                    <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold text-gray-700">Nenhum relatório encontrado</h3>
                                    <p className="text-gray-500">Quando uma ONG criar um relatório sobre sua participação, ele aparecerá aqui.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}