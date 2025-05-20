'use client';

import { useState } from 'react';
import FormInput from '@/components/FormInput';
import Button from '@/components/Button';
import { registerUser } from '@/lib/api';

export default function RegisterPage() {
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        description: '',
        localization: '',
        type: 'user',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const response = await registerUser(form);
        console.log('Register response:', response);
    };

    return (
        <div className="max-w-md mx-auto mt-20">
            <h1 className="text-2xl font-bold mb-6 text-center">Cadastro</h1>
            <form onSubmit={handleSubmit}>
                <FormInput label="Nome" name="name" onChange={handleChange} required />
                <FormInput label="Email" name="email" type="email" onChange={handleChange} required />
                <FormInput label="Senha" name="password" type="password" onChange={handleChange} required />
                <FormInput label="Descrição" name="description" onChange={handleChange} />
                <FormInput label="Localização" name="localization" onChange={handleChange} />
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Tipo</label>
                    <select
                        name="type"
                        value={form.type}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-md"
                    >
                        <option value="user">Voluntário</option>
                        <option value="ong">ONG</option>
                    </select>
                </div>
                <Button type="submit">Cadastrar</Button>
            </form>
        </div>
    );
}