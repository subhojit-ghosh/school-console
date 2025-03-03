const api = (endpoint: string) =>
  `${import.meta.env.VITE_API_GATEWAY}/${endpoint}`;

const endpoints = {
  auth: {
    login: () => api('auth/login'),
    profile: () => api('auth/profile'),
  },
  users: {
    list: () => api('users'),
    create: () => api('users'),
    update: (id: string) => api(`users/${id}`),
    updateStatus: (id: string) => api(`users/${id}/status`),
  },
  academicYears: {
    list: () => api('academic-years'),
    create: () => api('academic-years'),
    update: (id: string) => api(`academic-years/${id}`),
    updateStatus: (id: string) => api(`academic-years/${id}/status`),
  },
  students: {
    list: () => api('students'),
    create: () => api('students'),
    update: (id: string) => api(`students/${id}`),
  },
  classes: {
    list: () => api('classes'),
    create: () => api('classes'),
    update: (id: string) => api(`classes/${id}`),
  },
  feeStructures: {
    list: () => api('fee-structures'),
    create: () => api('fee-structures'),
    update: (id: string) => api(`fee-structures/${id}`),
  },
};

export default endpoints;
