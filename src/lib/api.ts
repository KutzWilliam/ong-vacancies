const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function registerUser(data: any) {
    try {
        const res = await fetch(`${API_BASE_URL}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            throw new Error('Erro ao registrar usuário');
        }

        return res.json();
    } catch (error) {
        throw new Error('Erro ao conectar com o servidor');
    }
}

export async function login(data: any) {
    try {
        const res = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        const responseData = await res.json();

        return {
            ok: res.ok,
            status: res.status,
            data: responseData,
        };
    } catch (error) {
        throw new Error('Erro ao conectar com o servidor');
    }
}

export async function getUserProfile(token: string) {
    try {
        const res = await fetch(`${API_BASE_URL}/users/me`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!res.ok) {
            throw new Error('Não autenticado');
        }

        return res.json();
    } catch (error) {
        throw new Error('Erro ao buscar perfil do usuário');
    }
}