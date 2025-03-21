const api = (endpoint: string) =>
  `${import.meta.env.VITE_API_GATEWAY}/${endpoint}`;

const endpoints = {
  auth: {
    login: () => api('auth/login'),
    logout: () => api('auth/logout'),
    profile: () => api('auth/profile'),
  },
  dashboard: {
    stats: () => api('dashboard/stats'),
  },
  users: {
    list: () => api('users'),
    create: () => api('users'),
    update: (id: string) => api(`users/${id}`),
    updateStatus: (id: string) => api(`users/${id}/status`),
  },
  academicYears: {
    list: () => api('academic-years'),
    nextStudentIdPrefix: () => api('academic-years/next-student-id-prefix'),
    dropdown: () => api('academic-years/dropdown'),
    create: () => api('academic-years'),
    update: (id: string) => api(`academic-years/${id}`),
    updateStatus: (id: string) => api(`academic-years/${id}/status`),
  },
  students: {
    listEnrolled: (query: string = '') => api(`students/enrolled?${query}`),
    list: (query: string = '') => api(`students?${query}`),
    findById: (id: string) => api(`students/${id}`),
    create: () => api('students'),
    createPersonalInfo: () => api('students/personal'),
    updatePersonalInfo: (id: string) => api(`students/guardian-info/${id}`),
    update: (id: string) => api(`students/${id}`),
    enrolled: (id: string) => api(`students/enrolled/${id}`),
  },
  classes: {
    list: () => api('classes'),
    dropdown: () => api('classes/dropdown'),
    create: () => api('classes'),
    update: (id: string) => api(`classes/${id}`),
  },
  academicFees: {
    list: () => api('academic-fees'),
    create: () => api('academic-fees'),
    update: (id: string) => api(`academic-fees/${id}`),
  },
};

export default endpoints;
