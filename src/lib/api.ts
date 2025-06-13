const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface UserRegisterData {
  name: string;
  email: string;
  password: string;
  description: string;
  localization: string;
  type: 'user';
}

interface OngRegisterData {
  name: string;
  email: string;
  password: string;
  description: string;
  localization: string;
  type: 'ong';
}

interface LoginData {
  email: string;
  password: string;
}

interface VacancyCreationData {
  position: string;
  description: string;
  category: string;
  start_date: string;
  end_date: string;
  localization: string;
}

interface VacancyUpdateData {
  position?: string;
  description?: string;
  category?: string;
  start_date?: string;
  end_date?: string;
  localization?: string;
}

interface ReportCreationData {
  description: string;
  volunteers_quantity: number;
  worked_hours: number;
}

interface ReportUpdateData {
  description?: string;
  volunteers_quantity?: number;
  worked_hours?: number;
}

interface UpdateRegistrationStatusData {
  status: 'accepted' | 'rejected' | 'pending';
}

async function registerUser(data: UserRegisterData): Promise<Response> {
  return fetch(`${BASE_URL}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
}

async function registerONG(data: OngRegisterData): Promise<Response> {
  return fetch(`${BASE_URL}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
}

async function login(data: LoginData): Promise<Response> {
  return fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
}

async function getMyProfile(token: string): Promise<Response> {
  return fetch(`${BASE_URL}/users/me`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

async function createVacancy(token: string, data: VacancyCreationData): Promise<Response> {
  return fetch(`${BASE_URL}/vacancies`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
}

async function listAllVacancies(): Promise<Response> {
  return fetch(`${BASE_URL}/vacancies`, {
    method: 'GET',
  });
}

async function getVacancyById(id: string): Promise<Response> {
  return fetch(`${BASE_URL}/vacancies/${id}`, {
    method: 'GET',
  });
}

async function updateVacancy(token: string, id: string, data: VacancyUpdateData): Promise<Response> {
  return fetch(`${BASE_URL}/vacancies/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
}

async function deleteVacancy(token: string, id: string): Promise<Response> {
  return fetch(`${BASE_URL}/vacancies/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

async function matchVacancies(token: string): Promise<Response> {
  return fetch(`${BASE_URL}/vacancies/match`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

async function registerToVacancy(token: string, vacancyId: string): Promise<Response> {
  return fetch(`${BASE_URL}/vacancy-registrations/${vacancyId}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

async function getRegistrationsForVacancy(token: string): Promise<Response> {
  return fetch(`${BASE_URL}/vacancy-registrations`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

async function updateVacancyRegistrationStatus(token: string, registrationId: string, data: UpdateRegistrationStatusData): Promise<Response> {
  return fetch(`${BASE_URL}/vacancy-registrations/${registrationId}/status`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
}

async function createReport(token: string, data: ReportCreationData): Promise<Response> {
  return fetch(`${BASE_URL}/reports`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
}

async function getMyReport(token: string): Promise<Response> {
  return fetch(`${BASE_URL}/reports`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

async function updateReport(token: string, data: ReportUpdateData): Promise<Response> {
  return fetch(`${BASE_URL}/reports`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
}

async function createReportForVolunteer(token: string, data: { description: string, volunteers_quantity: number, worked_hours: number, volunteerId: string }): Promise<Response> {
    return fetch(`${BASE_URL}/reports/volunteer`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
}

export {
    BASE_URL,
    registerUser,
    registerONG,
    login,
    getMyProfile,
    createVacancy,
    listAllVacancies,
    getVacancyById,
    updateVacancy,
    deleteVacancy,
    matchVacancies,
    registerToVacancy,
    getRegistrationsForVacancy,
    updateVacancyRegistrationStatus,
    createReport,
    getMyReport,
    updateReport,
    createReportForVolunteer,
};
export type {
        UserRegisterData,
        OngRegisterData,
        LoginData,
        VacancyCreationData,
        VacancyUpdateData,
        ReportCreationData,
        ReportUpdateData,
        UpdateRegistrationStatusData
    };
