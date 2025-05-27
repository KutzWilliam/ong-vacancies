'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { createVacancy } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const schema = z.object({
    position: z.string().min(1, 'Cargo é obrigatório'),
    description: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres'),
    category: z.string().min(1, 'Categoria é obrigatória'),
    start_date: z.string().min(1, 'Data de início é obrigatória'),
    end_date: z.string().min(1, 'Data de término é obrigatória'),
    localization: z.string().min(1, 'Localização é obrigatória'),
});

type FormData = z.infer<typeof schema>;

export default function CreateVacancyPage() {
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

            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/login');
                return;
            }

            const response = await createVacancy(token, data);

            if (response.ok) {
                router.push('/menu');
            } else {
                const errorData = await response.json();
                setErrorMessage(errorData.message || 'Erro ao criar vaga');
            }
        } catch (error) {
            setErrorMessage('Erro ao criar vaga. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-2xl mx-auto px-4">
                <div className="bg-white rounded-lg shadow p-6">
                    <h1 className="text-2xl font-bold text-gray-800 mb-6">Criar Nova Vaga</h1>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Cargo
                            </label>
                            <input
                                type="text"
                                {...register('position')}
                                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    errors.position ? 'border-red-300' : 'border-gray-300'
                                }`}
                                placeholder="Ex: Voluntário de Ensino"
                            />
                            {errors.position && (
                                <p className="mt-1 text-sm text-red-600">{errors.position.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Categoria
                            </label>
                            <select
                                {...register('category')}
                                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    errors.category ? 'border-red-300' : 'border-gray-300'
                                }`}
                            >
                                <option value="">Selecione uma categoria</option>
                                <option value="educacao">Educação</option>
                                <option value="saude">Saúde</option>
                                <option value="meio-ambiente">Meio Ambiente</option>
                                <option value="social">Social</option>
                                <option value="outros">Outros</option>
                            </select>
                            {errors.category && (
                                <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Descrição
                            </label>
                            <textarea
                                {...register('description')}
                                rows={4}
                                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    errors.description ? 'border-red-300' : 'border-gray-300'
                                }`}
                                placeholder="Descreva as atividades e requisitos da vaga..."
                            />
                            {errors.description && (
                                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Data de Início
                                </label>
                                <input
                                    type="date"
                                    {...register('start_date')}
                                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        errors.start_date ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                />
                                {errors.start_date && (
                                    <p className="mt-1 text-sm text-red-600">{errors.start_date.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Data de Término
                                </label>
                                <input
                                    type="date"
                                    {...register('end_date')}
                                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        errors.end_date ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                />
                                {errors.end_date && (
                                    <p className="mt-1 text-sm text-red-600">{errors.end_date.message}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Localização
                            </label>
                            <input
                                type="text"
                                {...register('localization')}
                                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    errors.localization ? 'border-red-300' : 'border-gray-300'
                                }`}
                                placeholder="Ex: São Paulo, SP"
                            />
                            {errors.localization && (
                                <p className="mt-1 text-sm text-red-600">{errors.localization.message}</p>
                            )}
                        </div>

                        {errorMessage && (
                            <p className="text-sm text-red-600 text-center">{errorMessage}</p>
                        )}

                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={() => router.push('/menu')}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={!isValid || loading}
                                className={`flex-1 px-4 py-2 rounded-md text-white ${
                                    isValid && !loading
                                        ? 'bg-blue-600 hover:bg-blue-700'
                                        : 'bg-blue-300 cursor-not-allowed'
                                }`}
                            >
                                {loading ? 'Criando...' : 'Criar Vaga'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
} 