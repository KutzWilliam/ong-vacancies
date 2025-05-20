'use client';

import Image from 'next/image';
import Logo from '../../../public/Logo.png';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { login } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const schema = z.object({
    email: z.string().min(1, 'Email é obrigatório').email('Email inválido'),
    password: z.string().min(4, 'A senha deve ter pelo menos 4 caracteres'),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
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

    const onSubmit = async (data: FormData) => {
        try {
            setLoading(true);
            setErrorMessage('');
            const response = await login(data);

            if (response.ok) {
                localStorage.setItem('token', response.data.access_token);
                router.push('/menu');
            } else {
                setErrorMessage('Email ou senha inválidos');
            }
        } catch (error) {
            setErrorMessage('Erro ao tentar logar. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex flex-col md:flex-row overflow-hidden bg-white font-inter">
            <div className="md:w-[50%] w-full h-[300px] md:h-auto bg-gradient-to-b from-blue-100 to-sky-500 flex flex-col justify-center items-center">
                <Image
                    src={Logo}
                    alt="Logo Conecta Bem"
                    width={200}
                    height={200}
                    className="mb-2"
                />
                <div className="flex gap-1 text-base">
                    <span className="text-black">Não tem conta</span>
                    <span
                        onClick={() => router.push('/register')}
                        className="text-sky-900 font-medium cursor-pointer"
                    >
                        {' '}
                        Criar conta
                    </span>
                </div>
            </div>

            <div className="flex-1 flex justify-center items-center p-6">
                <div className="w-full max-w-md p-8 rounded-2xl flex flex-col items-center gap-10">
                    <h1 className="text-3xl font-semibold text-zinc-900">Entrar</h1>

                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="flex flex-col gap-6 w-full"
                    >
                        <div className="flex flex-col gap-1">
                            <label className="text-blue-600 text-sm font-medium">Email</label>
                            <input
                                type="email"
                                placeholder="you@example.com"
                                {...register('email')}
                                className={`px-3 py-2 rounded-md shadow-sm outline-1 text-sm w-full ${errors.email
                                    ? 'outline-red-300 text-red-900'
                                    : 'outline-gray-300'
                                    }`}
                            />
                            {errors.email && (
                                <span className="text-red-500 text-xs">
                                    {errors.email.message}
                                </span>
                            )}
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-blue-600 text-sm font-medium">Senha</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                {...register('password')}
                                className={`px-3 py-2 rounded-md shadow-sm outline-1 text-sm w-full ${errors.password
                                    ? 'outline-red-300 text-red-900'
                                    : 'outline-gray-300'
                                    }`}
                            />
                            {errors.password && (
                                <span className="text-red-500 text-xs">
                                    {errors.password.message}
                                </span>
                            )}
                        </div>
                        {errorMessage && (
                            <span className="text-red-500 text-sm text-center">
                                {errorMessage}
                            </span>
                        )}
                        <button
                            type="submit"
                            disabled={!isValid || loading}
                            className={`w-full h-10 rounded-3xl text-white text-sm font-normal shadow-sm transition-all ${isValid && !loading
                                ? 'bg-blue-600 hover:bg-blue-700'
                                : 'bg-blue-300 cursor-not-allowed'
                                }`}
                        >
                            {loading ? 'Entrando...' : 'Login'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}