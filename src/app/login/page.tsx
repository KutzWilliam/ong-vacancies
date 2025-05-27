"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Heart, ArrowLeft, Mail, Lock, Eye, EyeOff } from "lucide-react";


import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Voluntario from "../../../public/ONG4.jpg"


import { login } from '@/lib/api';


const schema = z.object({
    email: z.string().min(1, 'Email é obrigatório').email('Email inválido'),
    password: z.string().min(4, 'A senha deve ter pelo menos 4 caracteres'),
});
type FormData = z.infer<typeof schema>;


export default function IntegratedLoginPage() {
    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: 'onChange',
    });

    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [activeTab, setActiveTab] = useState("volunteer");

    const onSubmit = async (data: FormData) => {
        try {
            setLoading(true);
            setErrorMessage('');
            const response = await login(data);

            if (response.ok) {
                const responseData = await response.json();
                localStorage.setItem('token', responseData.access_token);
                router.push('/menu');
            } else {
                const errorData = await response.json().catch(() => ({}));
                setErrorMessage(errorData.message || 'Email ou senha inválidos');
            }
        } catch (error) {
            console.error("Login error:", error);
            setErrorMessage('Erro ao tentar logar. Verifique sua conexão e tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const renderLoginForm = (userType: 'volunteer' | 'ngo') => (
        <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor={`${userType}-email`}>Email</Label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            id={`${userType}-email`}
                            type="email"
                            placeholder={userType === 'volunteer' ? "seu.email@exemplo.com" : "email.institucional@ong.org"}
                            {...register('email')}
                            className={`pl-10 ${errors.email ? 'border-red-500 focus:border-red-500' : ''}`}
                        />
                    </div>
                    {errors.email && (
                        <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor={`${userType}-password`}>Senha</Label>
                        <Link href="/recuperar-senha" className="text-xs text-blue-600 hover:underline">
                            Esqueceu a senha?
                        </Link>
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            id={`${userType}-password`}
                            type={showPassword ? "text" : "password"}
                            placeholder="Sua senha"
                            {...register('password')}
                            className={`pl-10 pr-10 ${errors.password ? 'border-red-500 focus:border-red-500' : ''}`}
                        />
                        <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                        >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                    </div>
                    {errors.password && (
                        <p className="text-xs text-red-600 mt-1">{errors.password.message}</p>
                    )}
                </div>
                {errorMessage && (
                    <p className="text-sm text-red-600 text-center bg-red-50 p-3 rounded-md">{errorMessage}</p>
                )}
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
                <Button type="submit" className="w-full" disabled={!isValid || loading}>
                    {loading ? "Entrando..." : "Entrar"}
                </Button>
                <p className="text-sm text-center text-gray-600">
                    Não tem uma conta?{" "}
                    <Link href={activeTab === "volunteer" ? "/register" : "/register"}
                        className="text-blue-600 hover:underline font-medium"
                    >
                        {activeTab === "volunteer" ? "Cadastre-se" : "Cadastre sua ONG"}
                    </Link>
                </p>
            </CardFooter>
        </form>
    );

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <header className="w-full py-4 px-4 md:px-6 bg-white border-b sticky top-0 z-50">
                <div className="container mx-auto">
                    <Link href="/" className="flex items-center gap-2 w-fit text-sm text-gray-700 hover:text-blue-600">
                        <ArrowLeft className="h-4 w-4" />
                        <span>Voltar para a página inicial</span>
                    </Link>
                </div>
            </header>

            <main className="flex-1 flex items-center justify-center p-4 md:p-8">
                <div className="w-full max-w-5xl grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                    <div className="hidden md:flex flex-col items-center justify-center p-8 bg-blue-600 rounded-xl text-white self-stretch">
                        <div className="mb-8 text-center">
                            <Heart className="h-16 w-16 text-white mb-4 mx-auto" />
                            <h1 className="text-3xl font-bold mb-2">VolunteerConnect</h1>
                            <p className="text-blue-100">Conectando corações, transformando vidas.</p>
                        </div>
                        <div className="relative h-[250px] w-full rounded-lg overflow-hidden shadow-lg">
                            <Image
                                src={Voluntario}
                                alt="Pessoas colaborando em atividade voluntária"
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

                        <Tabs defaultValue="volunteer" value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <TabsList className="grid grid-cols-2 mb-6">
                                <TabsTrigger value="volunteer">Sou Voluntário</TabsTrigger>
                                <TabsTrigger value="ngo">Sou ONG</TabsTrigger>
                            </TabsList>

                            <TabsContent value="volunteer">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Login de Voluntário</CardTitle>
                                        <CardDescription>
                                            Acesse sua conta para encontrar oportunidades.
                                        </CardDescription>
                                    </CardHeader>
                                    {renderLoginForm('volunteer')}
                                </Card>
                            </TabsContent>

                            <TabsContent value="ngo">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Login de ONG</CardTitle>
                                        <CardDescription>
                                            Acesse sua conta para gerenciar sua organização.
                                        </CardDescription>
                                    </CardHeader>
                                    {renderLoginForm('ngo')}
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