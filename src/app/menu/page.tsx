'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUserProfile } from '@/lib/api';

type UserProfile = {
    id: string;
    name: string;
    email: string;
    description: string;
    localization: string;
    type: string;
};

export default function MenuPage() {
    const router = useRouter();
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const token = localStorage.getItem('token');

        if (!token) {
            router.push('/login');
        } else {
            const fetchUser = async () => {
                try {
                    setLoading(true);
                    setError(null);

                    const profile = await getUserProfile(token);
                    console.log('Perfil recebido:', profile);
                    setUser(profile.user || profile);

                } catch (err) {
                    console.error('Erro ao buscar perfil:', err);
                    setError('Não foi possível carregar os dados do usuário.');
                    localStorage.removeItem('token');
                    router.push('/login');
                } finally {
                    setLoading(false);
                }
            };

            fetchUser();
        }
    }, [router]);

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
        <div className="p-8">
            <h1 className="text-2xl font-bold text-gray-800">Bem-vindo(a), {user.name}!</h1>
            <p className="text-gray-600 mt-2">Email: {user.email}</p>
            <p className="text-gray-600">Localização: {user.localization}</p>
            <p className="text-gray-600">Descrição: {user.description}</p>
            <p className="text-gray-600">Tipo de usuário: {user.type}</p>
        </div>
    );
}