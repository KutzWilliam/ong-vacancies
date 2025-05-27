'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getMyProfile, listAllVacancies, registerToVacancy } from '@/lib/api';

type UserProfile = {
    id: string;
    name: string;
    email: string;
    description: string;
    localization: string;
    type: string;
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
};

export default function MenuPage() {
    const router = useRouter();
    const [user, setUser] = useState<UserProfile | null>(null);
    const [vacancies, setVacancies] = useState<Vacancy[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [candidateLoading, setCandidateLoading] = useState<string | null>(null);
    const [candidateError, setCandidateError] = useState<string | null>(null);

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
                    } else {
                        throw new Error('Falha ao carregar perfil');
                    }


                    const vacanciesResponse = await listAllVacancies();
                    if (vacanciesResponse.ok) {
                        const vacanciesData = await vacanciesResponse.json();
                        console.log('Resposta da API de vagas:', vacanciesData);
                        setVacancies(Array.isArray(vacanciesData?.vacancies) ? vacanciesData.vacancies : []);
                    } else {
                        throw new Error('Falha ao carregar vagas');
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

            if (response.ok) {

                const vacanciesResponse = await listAllVacancies();
                if (vacanciesResponse.ok) {
                    const vacanciesData = await vacanciesResponse.json();
                    setVacancies(Array.isArray(vacanciesData?.vacancies) ? vacanciesData.vacancies : []);
                }
            } else {
                const errorData = await response.json();
                setCandidateError(errorData.message || 'Erro ao se candidatar à vaga');
            }
        } catch (error) {
            setCandidateError('Erro ao se candidatar. Tente novamente.');
        } finally {
            setCandidateLoading(null);
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
                    <h1 className="text-2xl font-bold text-gray-800">Bem-vindo(a), {user.name}!</h1>
                    {user.type === 'ong' && (
                        <div className="flex gap-4">
                            <button
                                onClick={() => router.push('/menu/manage-applications')}
                                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                            >
                                Gerenciar Candidaturas
                            </button>
                            <button
                                onClick={() => router.push('/menu/create-vacancy')}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                            >
                                Criar Nova Vaga
                            </button>
                        </div>
                    )}
                </div>
                <div className="mt-4 p-4 bg-white rounded-lg shadow">
                    <p className="text-gray-600">Email: {user.email}</p>
                    <p className="text-gray-600">Localização: {user.localization}</p>
                    <p className="text-gray-600">Descrição: {user.description}</p>
                    <p className="text-gray-600">Tipo de usuário: {user.type}</p>
                </div>
            </div>

            <div className="mt-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Vagas Disponíveis</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {vacancies.map((vacancy) => (
                        <div key={vacancy.id} className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
                            <h3 className="text-lg font-semibold text-gray-800">{vacancy.position}</h3>
                            <p className="text-sm text-gray-500 mt-1">{vacancy.category}</p>
                            <p className="text-gray-600 mt-2">{vacancy.description}</p>
                            <div className="mt-4 space-y-2">
                                <p className="text-sm text-gray-500">
                                    <span className="font-medium">Localização:</span> {vacancy.localization}
                                </p>
                                <p className="text-sm text-gray-500">
                                    <span className="font-medium">Início:</span> {new Date(vacancy.start_date).toLocaleDateString()}
                                </p>
                                <p className="text-sm text-gray-500">
                                    <span className="font-medium">Término:</span> {new Date(vacancy.end_date).toLocaleDateString()}
                                </p>
                            </div>
                            {user.type === 'user' && (
                                <>
                                    <button
                                        onClick={() => handleCandidate(vacancy.id)}
                                        disabled={candidateLoading === vacancy.id}
                                        className={`mt-4 w-full py-2 px-4 rounded-md text-white transition-colors ${candidateLoading === vacancy.id
                                                ? 'bg-blue-400 cursor-not-allowed'
                                                : 'bg-blue-600 hover:bg-blue-700'
                                            }`}
                                    >
                                        {candidateLoading === vacancy.id ? 'Candidatando...' : 'Candidatar-se'}
                                    </button>
                                    {candidateError && candidateLoading === vacancy.id && (
                                        <p className="mt-2 text-sm text-red-600 text-center">{candidateError}</p>
                                    )}
                                </>
                            )}
                        </div>
                    ))}
                </div>
                {vacancies.length === 0 && (
                    <p className="text-gray-500 text-center mt-4">Nenhuma vaga disponível no momento.</p>
                )}
            </div>
        </div>
    );
}