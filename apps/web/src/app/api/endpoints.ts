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
    list: () => api(`students`),
    findById: (id: string) => api(`students/${id}`),
    create: () => api('students'),
    createPersonalInfo: () => api('students/personal'),
    updatePersonalInfoById: (id: string) => api(`students/guardian-info/${id}`),
    updateDocumentsById: (id: string) => api(`students/uploads/${id}`),
    deleteDocument: (id: string) => api(`students/delete/document/${id}`),
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
  transactions: {
    fees: (
      academicYearId: number | string,
      classId: number | string,
      studentId: number | string
    ) => api(`transactions/fees/${academicYearId}/${classId}/${studentId}`),
    list: () => api(`transactions`),
    items: (id: number) => api(`transactions/${id}/items`),
    saveTransaction: () => api(`transactions`),
    receiptById: (id: string) => api(`transactions/receipt/${id}`),
  },
  reports: {
    dues: () => api('reports/dues'),
  },
  transports: {
    saveSettings: (id?: string) => api(`transport/settings`),
    getSettingsByAcadId: (id?: string) => api(`transport/settings/${id}/`),
    saveTransportFee: () => api(`transport/fees`),
    getFeeDropDownItemByStudentAcadId: (
      academicYearId: string,
      studentId: string
    ) => api(`transport/fee-items/dropdown/${academicYearId}/${studentId}`),
    getListByAcadId: (academicYearId: string) =>
      api(`transport/list/${academicYearId}`),
    getTransportItemById: (id: string) => api(`transport/fee-item/${id}`),
    receiptById: (id: string) => api(`transport/receipt/${id}`),
  },
};

export default endpoints;
