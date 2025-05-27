'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getMyProfile, getRegistrationsForVacancy, updateVacancyRegistrationStatus } from '@/lib/api';

type UserProfile = {
    id: string;
    name: string;
    email: string;
    description: string;
    localization: string;
    type: string;
};

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
    const [user, setUser] = useState<UserProfile | null>(null);
    const [registrations, setRegistrations] = useState<Registration[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

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
                    if (profileResponse.ok) {
                        const profileData = await profileResponse.json();
                        setUser(profileData.user);


                        if (profileData.user.type !== 'ong') {
                            router.push('/menu');
                            return;
                        }


                        const registrationsResponse = await getRegistrationsForVacancy(token);
                        if (registrationsResponse.ok) {
                            const registrationsData = await registrationsResponse.json();
                            console.log('Resposta da API de candidaturas:', registrationsData);
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
                            throw new Error('Falha ao carregar candidaturas');
                        }
                    } else {
                        throw new Error('Falha ao carregar perfil');
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
                }
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
        return <div className="p-4 text-gray-600">Carregando...</div>;
    }

    if (error) {
        return <div className="p-4 text-red-600">{error}</div>;
    }

    if (!user) {
        return <div className="p-4 text-red-600">Usuário não encontrado.</div>;
    }

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="mb-8">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-800">Gerenciar Candidaturas</h1>
                    <button
                        onClick={() => router.push('/menu')}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                        Voltar ao Menu
                    </button>
                </div>
            </div>

            <div className="space-y-6">
                {registrations.length === 0 ? (
                    <p className="text-gray-500 text-center">Nenhuma candidatura recebida.</p>
                ) : (
                    registrations.map((registration) => (
                        <div
                            key={registration.id}
                            className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800">
                                        {registration.vacancy?.position || 'Vaga não encontrada'}
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Categoria: {registration.vacancy?.category || 'Não especificada'}
                                    </p>
                                </div>
                                <span
                                    className={`px-3 py-1 rounded-full text-sm font-medium ${registration.status === 'pending'
                                            ? 'bg-yellow-100 text-yellow-800'
                                            : registration.status === 'accepted'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                        }`}
                                >
                                    {registration.status === 'pending'
                                        ? 'Pendente'
                                        : registration.status === 'accepted'
                                            ? 'Aceita'
                                            : 'Rejeitada'}
                                </span>
                            </div>

                            <div className="mt-4">
                                <h4 className="font-medium text-gray-700">Candidato</h4>
                                <div className="mt-2 space-y-2">
                                    <p className="text-gray-600">
                                        <span className="font-medium">Nome:</span> {registration.user?.name || 'Não especificado'}
                                    </p>
                                    <p className="text-gray-600">
                                        <span className="font-medium">Email:</span> {registration.user?.email || 'Não especificado'}
                                    </p>
                                    <p className="text-gray-600">
                                        <span className="font-medium">Localização:</span>{' '}
                                        {registration.user?.localization || 'Não especificada'}
                                    </p>
                                    <p className="text-gray-600">
                                        <span className="font-medium">Descrição:</span>{' '}
                                        {registration.user?.description || 'Não especificada'}
                                    </p>
                                </div>
                            </div>

                            {registration.status === 'pending' && (
                                <div className="mt-6 flex gap-4">
                                    <button
                                        onClick={() => handleUpdateStatus(registration.id, 'accepted')}
                                        disabled={updatingStatus === registration.id}
                                        className={`flex-1 px-4 py-2 rounded-md text-white ${updatingStatus === registration.id
                                                ? 'bg-green-400 cursor-not-allowed'
                                                : 'bg-green-600 hover:bg-green-700'
                                            }`}
                                    >
                                        {updatingStatus === registration.id
                                            ? 'Atualizando...'
                                            : 'Aceitar Candidatura'}
                                    </button>
                                    <button
                                        onClick={() => handleUpdateStatus(registration.id, 'rejected')}
                                        disabled={updatingStatus === registration.id}
                                        className={`flex-1 px-4 py-2 rounded-md text-white ${updatingStatus === registration.id
                                                ? 'bg-red-400 cursor-not-allowed'
                                                : 'bg-red-600 hover:bg-red-700'
                                            }`}
                                    >
                                        {updatingStatus === registration.id
                                            ? 'Atualizando...'
                                            : 'Rejeitar Candidatura'}
                                    </button>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
} 