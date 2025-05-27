"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
    Heart,
    ArrowLeft,
    Mail,
    Lock,
    Eye,
    EyeOff,
    User,
    MapPin,
    Building,
    FileText,
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import Voluntario from "../../../public/ONG3.webp"


import { registerUser } from '@/lib/api';


interface RegisterFormState {
    name: string;
    email: string;
    password: string;
    description: string;
    localization: string;
    type: 'user' | 'ong';
}

export default function IntegratedRegisterPage() {
    const router = useRouter();

    const [form, setForm] = useState<RegisterFormState>({
        name: '',
        email: '',
        password: '',
        description: '',
        localization: '',
        type: 'user',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);


    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };


    const handleTabChange = (value: string) => {
        setForm(prevForm => ({
            ...prevForm,
            type: value === 'volunteer' ? 'user' : 'ong',
        }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await registerUser(form);
            console.log('Register response:', response);

            alert('Cadastro realizado com sucesso!');
        } catch (error) {
            console.error('Register error:', error);
            alert('Erro ao realizar cadastro. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    const currentTabValue = form.type === 'user' ? 'volunteer' : 'ngo';

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <header className="w-full py-4 px-4 md:px-6 bg-white border-b sticky top-0 z-50">
                <div className="container mx-auto flex justify-between items-center">
                    <Link href="/" className="flex items-center gap-2 text-sm text-gray-700 hover:text-blue-600">
                        <ArrowLeft className="h-4 w-4" />
                        <span>Voltar para a página inicial</span>
                    </Link>
                    <Link href="/login" className="text-sm text-blue-600 hover:underline">
                        Já tem uma conta? Faça login
                    </Link>
                </div>
            </header>

            <main className="flex-1 flex items-center justify-center p-4 md:p-8">
                <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 md:gap-12 items-start">

                    <div className="hidden md:flex flex-col p-8 bg-blue-600 rounded-xl text-white sticky top-24 self-start"> {/* Ajustado top */}
                        <div className="mb-8 text-center">
                            <Heart className="h-16 w-16 text-white mb-4 mx-auto" />
                            <h1 className="text-3xl font-bold mb-2">Junte-se à Nossa Comunidade</h1>
                            <p className="text-blue-100 mb-6">
                                Conecte-se com causas que fazem a diferença e transforme vidas através do voluntariado.
                            </p>
                        </div>
                        <div className="relative h-[250px] w-full rounded-lg overflow-hidden shadow-lg">
                            <Image
                                src={Voluntario}
                                alt="Comunidade de voluntários"
                                layout="fill"
                                objectFit="cover"
                            />
                        </div>
                    </div>

                    <div className="w-full">
                        <div className="md:hidden flex items-center justify-center mb-6">
                            <Heart className="h-10 w-10 text-blue-600 mr-2" />
                            <span className="text-xl font-bold text-blue-600">VolunteerConnect</span>
                        </div>

                        <Tabs value={currentTabValue} onValueChange={handleTabChange} className="w-full">
                            <TabsList className="grid grid-cols-2 mb-6">
                                <TabsTrigger value="volunteer">Sou Voluntário</TabsTrigger>
                                <TabsTrigger value="ngo">Sou ONG</TabsTrigger>
                            </TabsList>

                            <TabsContent value="volunteer">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Cadastro de Voluntário</CardTitle>
                                        <CardDescription>Crie sua conta para encontrar oportunidades incríveis.</CardDescription>
                                    </CardHeader>
                                    <form onSubmit={handleSubmit}>
                                        <CardContent className="space-y-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="name-volunteer">Nome Completo</Label>
                                                <div className="relative">
                                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                    <Input
                                                        id="name-volunteer"
                                                        name="name"
                                                        value={form.name}
                                                        onChange={handleChange}
                                                        placeholder="Seu nome completo"
                                                        className="pl-10"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="email-volunteer">Email</Label>
                                                <div className="relative">
                                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                    <Input
                                                        id="email-volunteer"
                                                        name="email"
                                                        type="email"
                                                        value={form.email}
                                                        onChange={handleChange}
                                                        placeholder="seu.email@exemplo.com"
                                                        className="pl-10"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="password-volunteer">Senha</Label>
                                                <div className="relative">
                                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                    <Input
                                                        id="password-volunteer"
                                                        name="password"
                                                        type={showPassword ? "text" : "password"}
                                                        value={form.password}
                                                        onChange={handleChange}
                                                        placeholder="Crie uma senha forte"
                                                        className="pl-10 pr-10"
                                                        required
                                                    />
                                                    <button
                                                        type="button"
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                    >
                                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="description-volunteer">Sobre Você / Motivação</Label>
                                                <div className="relative">
                                                    <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                                    <Textarea
                                                        id="description-volunteer"
                                                        name="description"
                                                        value={form.description}
                                                        onChange={handleChange}
                                                        placeholder="Fale um pouco sobre você, seus interesses ou por que quer ser voluntário."
                                                        className="pl-10 min-h-[100px]"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="localization-volunteer">Sua Localização (Cidade/Estado)</Label>
                                                <div className="relative">
                                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                    <Input
                                                        id="localization-volunteer"
                                                        name="localization"
                                                        value={form.localization}
                                                        onChange={handleChange}
                                                        placeholder="Ex: São Paulo, SP"
                                                        className="pl-10"
                                                    />
                                                </div>
                                            </div>
                                        </CardContent>
                                        <div className="px-6 pb-6 pt-2">
                                            <Button type="submit" className="w-full" disabled={isLoading}>
                                                {isLoading ? "Criando conta..." : "Criar Conta de Voluntário"}
                                            </Button>
                                        </div>
                                    </form>
                                </Card>
                            </TabsContent>


                            <TabsContent value="ngo">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Cadastro de ONG</CardTitle>
                                        <CardDescription>Registre sua organização para encontrar voluntários.</CardDescription>
                                    </CardHeader>
                                    <form onSubmit={handleSubmit}>
                                        <CardContent className="space-y-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="name-ngo">Nome da Organização</Label>
                                                <div className="relative">
                                                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                    <Input
                                                        id="name-ngo"
                                                        name="name"
                                                        value={form.name}
                                                        onChange={handleChange}
                                                        placeholder="Nome oficial da ONG"
                                                        className="pl-10"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="email-ngo">Email Institucional</Label>
                                                <div className="relative">
                                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                    <Input
                                                        id="email-ngo"
                                                        name="email"
                                                        type="email"
                                                        value={form.email}
                                                        onChange={handleChange}
                                                        placeholder="contato@suaong.org"
                                                        className="pl-10"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="password-ngo">Senha</Label>
                                                <div className="relative">
                                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                    <Input
                                                        id="password-ngo"
                                                        name="password"
                                                        type={showPassword ? "text" : "password"}
                                                        value={form.password}
                                                        onChange={handleChange}
                                                        placeholder="Crie uma senha para a conta da ONG"
                                                        className="pl-10 pr-10"
                                                        required
                                                    />
                                                    <button
                                                        type="button"
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                    >
                                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="description-ngo">Descrição da Organização</Label>
                                                <div className="relative">
                                                    <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                                    <Textarea
                                                        id="description-ngo"
                                                        name="description"
                                                        value={form.description}
                                                        onChange={handleChange}
                                                        placeholder="Descreva a missão, atividades e causa da sua ONG."
                                                        className="pl-10 min-h-[100px]"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="localization-ngo">Endereço da Sede</Label>
                                                <div className="relative">
                                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                    <Input
                                                        id="localization-ngo"
                                                        name="localization"
                                                        value={form.localization}
                                                        onChange={handleChange}
                                                        placeholder="Endereço completo da ONG"
                                                        className="pl-10"
                                                    />
                                                </div>
                                            </div>
                                        </CardContent>
                                        <div className="px-6 pb-6 pt-2">
                                            <Button type="submit" className="w-full" disabled={isLoading}>
                                                {isLoading ? "Criando conta..." : "Criar Conta da ONG"}
                                            </Button>
                                        </div>
                                    </form>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </main>

            <footer className="w-full py-6 px-4 md:px-6 bg-white border-t mt-auto">
                <div className="container mx-auto text-center text-sm text-gray-600">
                    <p>© {new Date().getFullYear()} VolunteerConnect. Todos os direitos reservados.</p>
                </div>
            </footer>
        </div>
    );
}