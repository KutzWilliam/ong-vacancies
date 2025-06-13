// src/app/menu/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getMyProfile, listAllVacancies, registerToVacancy, matchVacancies } from "@/lib/api";
import Link from "next/link";
import Image from "next/image";

// Imports de Componentes e Ícones
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Heart, Home, Briefcase, Bell, User, LogOut, CheckCircle, Search, Filter, MapPin, Calendar, Clock, Users, ChevronRight, X, Grid, FileText, Settings, BarChart, Plus, AlertCircle, TrendingUp, Award, MoreHorizontal
} from "lucide-react";

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
    position: string;
    description: string;
    category: string;
    start_date: string;
    end_date: string;
    localization: string;
    created_at: string;
    updated_at: string;
    // Adicionando campos dos layouts para compatibilidade
    organization?: string;
    organizationLogo?: string;
    spots?: number;
    spotsAvailable?: number;
    skills?: string[];
    requirements?: string[];
    benefits?: string[];
    impact?: string;
    images?: string[];
    time?: string;
};

// Dados simulados para o dashboard da ONG
const dashboardStats = {
    activeProjects: 8,
    totalVolunteers: 124,
    pendingApplications: 17,
    completedProjects: 32,
    hoursContributed: 2450,
    peopleImpacted: 1280,
};

export default function MenuPage() {
    const router = useRouter();
    const [user, setUser] = useState<UserProfile | null>(null);
    const [vacancies, setVacancies] = useState<Vacancy[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [candidateLoading, setCandidateLoading] = useState<string | null>(null);
    const [candidateError, setCandidateError] = useState<string | null>(null);
    const [matchedVacancies, setMatchedVacancies] = useState<Vacancy[]>([]);
    const [loadingMatchedVacancies, setLoadingMatchedVacancies] = useState(false);
    const [errorMatchedVacancies, setErrorMatchedVacancies] = useState<string | null>(null);

    // Estados para a UI da página de projetos do usuário
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("Todos");
    const [selectedVacancy, setSelectedVacancy] = useState<Vacancy | null>(null);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
        } else {
            const fetchData = async () => {
                try {
                    setLoading(true);
                    setError(null);

                    const profileResponse = await getMyProfile(token);
                    if (!profileResponse.ok) throw new Error('Falha ao carregar perfil');
                    const profileData = await profileResponse.json();
                    setUser(profileData.user);

                    const vacanciesResponse = await listAllVacancies();
                    if (!vacanciesResponse.ok) throw new Error('Falha ao carregar vagas');
                    const vacanciesData = await vacanciesResponse.json();
                    const allVacancies = Array.isArray(vacanciesData?.vacancies) ? vacanciesData.vacancies : [];
                    setVacancies(allVacancies);

                    if (profileData.user.type === 'user') {
                        setLoadingMatchedVacancies(true);
                        const matchedResponse = await matchVacancies(token);
                        if (matchedResponse.ok) {
                            const matchedData = await matchedResponse.json();
                            const matched = Array.isArray(matchedData?.matches) ? matchedData.matches : [];
                            setMatchedVacancies(matched);
                            if (matched.length > 0) setSelectedVacancy(matched[0]);
                        } else {
                            setErrorMatchedVacancies('Falha ao carregar vagas recomendadas');
                        }
                        setLoadingMatchedVacancies(false);
                    } else {
                        // Para ONGs, apenas listamos todas as vagas por enquanto
                        if (allVacancies.length > 0) setSelectedVacancy(allVacancies[0]);
                    }
                } catch (err) {
                    console.error('Erro ao buscar dados:', err);
                    setError('Não foi possível carregar os dados.');
                    localStorage.removeItem('token');
                    router.push('/login');
                } finally {
                    setLoading(false);
                }
            };
            fetchData();
        }
    }, [router]);
    
    const handleCandidate = async (vacancyId: string) => {
        try {
            setCandidateLoading(vacancyId);
            setCandidateError(null);
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/login');
                return;
            }
            const response = await registerToVacancy(token, vacancyId);
            if (!response.ok) {
                const errorData = await response.json();
                setCandidateError(errorData.message || 'Erro ao se candidatar à vaga');
            } else {
                 alert('Candidatura realizada com sucesso!');
            }
        } catch (error) {
            setCandidateError('Erro ao se candidatar. Tente novamente.');
        } finally {
            setCandidateLoading(null);
        }
    };

    const getInitials = (name: string) => {
        const names = name.split(' ');
        if (names.length === 1) return names[0].substring(0, 2).toUpperCase();
        return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    };
    
    if (loading) return <div className="flex justify-center items-center h-screen">Carregando...</div>;
    if (error) return <div className="p-4 text-red-600">{error}</div>;
    if (!user) return <div className="p-4 text-red-600">Usuário não encontrado.</div>;

    // Lógica de filtragem para a visão de usuário
    const categories = ["Todos", ...Array.from(new Set(vacancies.map((v) => v.category)))];
    const projectsToDisplay = (user.type === 'user' ? matchedVacancies.length > 0 ? matchedVacancies : vacancies : vacancies);
    const filteredProjects = projectsToDisplay.filter((project) => {
        const matchesSearch =
            project.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
            project.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === "Todos" || project.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    // ----- RENDERIZAÇÃO -----

    // Header Comum
    const renderHeader = (activeLink: 'projetos' | 'contratos' | 'solicitacoes' | 'dashboard') => (
        <header className="w-full py-4 px-4 md:px-6 bg-white border-b sticky top-0 z-20">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Heart className="h-6 w-6 text-blue-600" />
                    <span className="text-lg font-bold text-blue-600">VolunteerConnect</span>
                </div>
                {user.type === 'user' && (
                    <nav className="hidden md:flex items-center gap-6">
                        <Link href="/menu" className={`flex items-center gap-1 text-sm font-medium ${activeLink === 'projetos' ? 'text-blue-600 border-b-2 border-blue-600 pb-1' : 'text-gray-600 hover:text-blue-600'}`}>
                            <Briefcase className="h-4 w-4" />
                            <span>Encontrar Vagas</span>
                        </Link>
                         <Link href="/menu/my-reports" className={`flex items-center gap-1 text-sm font-medium ${activeLink === 'contratos' ? 'text-blue-600 border-b-2 border-blue-600 pb-1' : 'text-gray-600 hover:text-blue-600'}`}>
                            <CheckCircle className="h-4 w-4" />
                            <span>Meus Relatórios</span>
                        </Link>
                        {/* Adicionar links para outras páginas se necessário */}
                    </nav>
                )}
                 {user.type === 'ong' && (
                    <nav className="hidden md:flex items-center gap-6">
                        <Link href="/menu" className={`flex items-center gap-1 text-sm font-medium ${activeLink === 'dashboard' ? 'text-blue-600 border-b-2 border-blue-600 pb-1' : 'text-gray-600 hover:text-blue-600'}`}>
                            <Grid className="h-4 w-4" />
                            <span>Dashboard</span>
                        </Link>
                         <Link href="/menu/manage-my-vacancies" className={`flex items-center gap-1 text-sm font-medium ${activeLink === 'projetos' ? 'text-blue-600 border-b-2 border-blue-600 pb-1' : 'text-gray-600 hover:text-blue-600'}`}>
                            <FileText className="h-4 w-4" />
                            <span>Gerenciar Vagas</span>
                        </Link>
                        <Link href="/menu/manage-applications" className={`flex items-center gap-1 text-sm font-medium ${activeLink === 'solicitacoes' ? 'text-blue-600 border-b-2 border-blue-600 pb-1' : 'text-gray-600 hover:text-blue-600'}`}>
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
                                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt={user.name} />
                                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end" forceMount>
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none">{user.name}</p>
                                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                             <DropdownMenuGroup>
                                 <Link href="/menu" passHref><DropdownMenuItem>Menu Principal</DropdownMenuItem></Link>
                                 {user.type === 'user' && (
                                     <Link href="/menu/my-reports" passHref><DropdownMenuItem>Meus Relatórios</DropdownMenuItem></Link>
                                 )}
                                 {user.type === 'ong' && (
                                     <>
                                         <Link href="/menu/create-vacancy" passHref><DropdownMenuItem>Criar Nova Vaga</DropdownMenuItem></Link>
                                         <Link href="/menu/manage-applications" passHref><DropdownMenuItem>Gerenciar Candidaturas</DropdownMenuItem></Link>
                                         <Link href="/menu/manage-my-vacancies" passHref><DropdownMenuItem>Gerenciar Minhas Vagas</DropdownMenuItem></Link>
                                     </>
                                 )}
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
    
    // Visão do Usuário
    if (user.type === "user") {
        return (
            <div className="min-h-screen flex flex-col bg-gray-50">
                {renderHeader('projetos')}
                <main className="flex-1 container mx-auto py-6 px-4 md:px-6">
                    <div className="flex flex-col md:flex-row gap-6">
                        {/* Coluna da Esquerda - Listagem de Vagas */}
                        <div className="md:w-2/5 lg:w-1/3">
                            <div className="bg-white rounded-lg shadow-sm border p-4 mb-4">
                                <h2 className="text-lg font-semibold mb-4">Encontre Vagas</h2>
                                <div className="relative mb-4">
                                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        placeholder="Buscar vagas..."
                                        className="pl-10"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <div className="mb-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Filter className="h-4 w-4 text-gray-500" />
                                        <span className="text-sm font-medium">Filtrar por categoria</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {categories.map((category) => (
                                            <Badge
                                                key={category}
                                                variant={selectedCategory === category ? "default" : "outline"}
                                                className={`cursor-pointer ${selectedCategory === category ? "bg-blue-600" : ""}`}
                                                onClick={() => setSelectedCategory(category)}
                                            >
                                                {category}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                                <Separator className="my-4" />
                                <div>
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="text-sm text-gray-500">{filteredProjects.length} vagas encontradas</span>
                                    </div>
                                    <ScrollArea className="h-[calc(100vh-420px)]">
                                        <div className="space-y-3 pr-4">
                                            {filteredProjects.map((project) => (
                                                <Card
                                                    key={project.id}
                                                    className={`cursor-pointer hover:border-blue-200 transition-colors ${selectedVacancy?.id === project.id ? "border-blue-500 ring-1 ring-blue-500" : ""}`}
                                                    onClick={() => setSelectedVacancy(project)}
                                                >
                                                    <CardContent className="p-3">
                                                        <div className="flex items-start gap-3">
                                                            <Avatar className="h-10 w-10">
                                                                <AvatarImage src={project.organizationLogo || "/placeholder.svg"} alt={project.organization} />
                                                                <AvatarFallback>{project.organization?.substring(0, 2) || 'V'}</AvatarFallback>
                                                            </Avatar>
                                                            <div className="flex-1 min-w-0">
                                                                <h3 className="font-medium text-sm line-clamp-1">{project.position}</h3>
                                                                <p className="text-xs text-gray-500 mb-1">{project.organization || 'Organização não informada'}</p>
                                                                <div className="flex flex-wrap gap-1 mt-1">
                                                                    <Badge variant="secondary" className="text-xs py-0">{project.category}</Badge>
                                                                </div>
                                                            </div>
                                                            <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                            {filteredProjects.length === 0 && (
                                                <div className="text-center py-8">
                                                    <X className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                                                    <p className="text-gray-500">Nenhuma vaga encontrada</p>
                                                    <p className="text-sm text-gray-400">Tente ajustar seus filtros</p>
                                                </div>
                                            )}
                                        </div>
                                    </ScrollArea>
                                </div>
                            </div>
                        </div>

                        {/* Coluna da Direita - Detalhes da Vaga */}
                        <div className="md:w-3/5 lg:w-2/3">
                            {selectedVacancy && (
                                <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-24">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h1 className="text-2xl font-bold mb-1">{selectedVacancy.position}</h1>
                                            <div className="flex items-center gap-2">
                                                <Avatar className="h-6 w-6">
                                                     <AvatarImage src={selectedVacancy.organizationLogo || "/placeholder.svg"} alt={selectedVacancy.organization} />
                                                     <AvatarFallback>{selectedVacancy.organization?.substring(0, 2) || 'V'}</AvatarFallback>
                                                </Avatar>
                                                <span className="text-sm text-gray-600">{selectedVacancy.organization || 'Organização não informada'}</span>
                                            </div>
                                        </div>
                                        <Button onClick={() => handleCandidate(selectedVacancy.id)} disabled={!!candidateLoading} className="bg-blue-600 hover:bg-blue-700">
                                            {candidateLoading === selectedVacancy.id ? 'Candidatando...' : 'Candidatar-se'}
                                        </Button>
                                    </div>
                                     {candidateError && <p className="mb-4 text-sm text-red-600 text-center">{candidateError}</p>}
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-5 w-5 text-gray-500" />
                                            <div>
                                                <p className="text-xs text-gray-500">Localização</p>
                                                <p className="text-sm font-medium">{selectedVacancy.localization}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-5 w-5 text-gray-500" />
                                            <div>
                                                <p className="text-xs text-gray-500">Período</p>
                                                <p className="text-sm font-medium">{new Date(selectedVacancy.start_date).toLocaleDateString()} - {new Date(selectedVacancy.end_date).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <Tabs defaultValue="descricao" className="mb-6">
                                        <TabsList className="grid grid-cols-2 mb-4">
                                            <TabsTrigger value="descricao">Descrição</TabsTrigger>
                                            <TabsTrigger value="requisitos">Requisitos</TabsTrigger>
                                        </TabsList>
                                        <TabsContent value="descricao" className="text-sm text-gray-700">
                                            <p>{selectedVacancy.description}</p>
                                        </TabsContent>
                                         <TabsContent value="requisitos">
                                             <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                                                 {selectedVacancy.requirements?.length ? selectedVacancy.requirements.map((req, index) => (
                                                     <li key={index}>{req}</li>
                                                 )) : <li>Nenhum requisito específico informado.</li>}
                                             </ul>
                                        </TabsContent>
                                    </Tabs>
                                    
                                    <div className="flex justify-end">
                                        <Button onClick={() => handleCandidate(selectedVacancy.id)} disabled={!!candidateLoading} className="bg-blue-600 hover:bg-blue-700">
                                            {candidateLoading === selectedVacancy.id ? 'Candidatando...' : 'Candidatar-se'}
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        );
    }
    
    // Visão da ONG (Dashboard)
    if (user.type === "ong") {
        return (
             <div className="min-h-screen flex flex-col bg-gray-50">
                {renderHeader('dashboard')}
                <main className="flex-1 container mx-auto p-4 md:p-6">
                     <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                        <div>
                            <h1 className="text-2xl font-bold">Dashboard</h1>
                            <p className="text-gray-500">Bem-vindo(a) ao seu painel de controle, {user.name}</p>
                        </div>
                        <Button className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700" onClick={() => router.push('/menu/create-vacancy')}>
                            <Plus className="h-4 w-4 mr-2" />
                            Nova Vaga
                        </Button>
                    </div>

                    {/* Cards de estatísticas (dados simulados) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                         <Card>
                             <CardContent className="p-6">
                                 <div className="flex justify-between items-start">
                                     <div>
                                         <p className="text-sm font-medium text-gray-500">Vagas Ativas</p>
                                         <h3 className="text-3xl font-bold mt-1">{vacancies.length}</h3>
                                     </div>
                                     <div className="bg-blue-100 p-2 rounded-full">
                                         <FileText className="h-5 w-5 text-blue-600" />
                                     </div>
                                 </div>
                             </CardContent>
                         </Card>
                          <Card>
                             <CardContent className="p-6">
                                 <div className="flex justify-between items-start">
                                     <div>
                                         <p className="text-sm font-medium text-gray-500">Candidaturas Pendentes</p>
                                         <h3 className="text-3xl font-bold mt-1">{dashboardStats.pendingApplications}</h3>
                                     </div>
                                     <div className="bg-yellow-100 p-2 rounded-full">
                                         <Clock className="h-5 w-5 text-yellow-600" />
                                     </div>
                                 </div>
                             </CardContent>
                         </Card>
                         <Card>
                             <CardContent className="p-6">
                                 <div className="flex justify-between items-start">
                                     <div>
                                         <p className="text-sm font-medium text-gray-500">Voluntários Ativos</p>
                                         <h3 className="text-3xl font-bold mt-1">{dashboardStats.totalVolunteers}</h3>
                                     </div>
                                     <div className="bg-green-100 p-2 rounded-full">
                                         <Users className="h-5 w-5 text-green-600" />
                                     </div>
                                 </div>
                             </CardContent>
                         </Card>
                    </div>

                     {/* Lista de Vagas da ONG */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Minhas Vagas</CardTitle>
                            <CardDescription>Gerencie suas vagas publicadas</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {vacancies.length > 0 ? vacancies.map(vacancy => (
                                     <Card key={vacancy.id} className="overflow-hidden">
                                        <CardHeader>
                                             <CardTitle className="truncate">{vacancy.position}</CardTitle>
                                             <Badge variant="outline">{vacancy.category}</Badge>
                                        </CardHeader>
                                        <CardContent>
                                             <p className="text-sm text-gray-500 line-clamp-3 mb-4">{vacancy.description}</p>
                                             <div className="flex items-center text-sm text-gray-500 mb-2">
                                                 <MapPin className="h-4 w-4 mr-2" />
                                                 <span>{vacancy.localization}</span>
                                             </div>
                                              <div className="flex items-center text-sm text-gray-500">
                                                 <Calendar className="h-4 w-4 mr-2" />
                                                 <span>{new Date(vacancy.start_date).toLocaleDateString()} - {new Date(vacancy.end_date).toLocaleDateString()}</span>
                                             </div>
                                        </CardContent>
                                         <div className="p-4 border-t flex justify-end gap-2">
                                            <Button variant="outline" size="sm" onClick={() => router.push(`/menu/manage-my-vacancies/${vacancy.id}`)}>
                                                <Users className="h-4 w-4 mr-2"/>
                                                Ver Candidatos
                                            </Button>
                                             <Button variant="default" size="sm" onClick={() => router.push(`/menu/edit-vacancy/${vacancy.id}`)}>
                                                <Settings className="h-4 w-4 mr-2"/>
                                                Editar
                                             </Button>
                                         </div>
                                     </Card>
                                )) : (
                                    <p className="col-span-full text-center text-gray-500">Você ainda não publicou nenhuma vaga.</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </main>
            </div>
        );
    }

    return null; // Fallback
}