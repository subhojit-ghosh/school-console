export type StudentPersonalType = {
  id?: number;
  regNo: string;
  admissionDate: string | null;
  classId: number | string | null;

  studentPhoto: any;
  fatherPhoto: any;
  motherPhoto: any;

  name: string;
  dob: any;
  gender: 'M' | 'F' | 'O';

  religion: string;
  nationality: string;
  nativeLanguage: string;
  caste: string;

  fathersName: string;
  fathersPhone: string;
  mothersName: string;
  mothersPhone: string;

  presentAddess: string;
  presentPo: string;
  presentPs: string;
  presentPin: number;

  isBothAddressSame: boolean;

  permanentAddess: string;
  permanentPo: string;
  permanentPs: string;
  permanentPin: number;

  previousSchoolDetails: {
    name: string;
    place: string;
    key: string;
    affilatedBoard: string;
    standard: string;
    periodStart: any | null;
    periodEnd: any | null;
  }[];

  medicalHistory: string;
  medicalFile: any;
  vaccinationRecord: any;

  siblingDetails: {
    key: string;
    name: string;
    dob: any | null;
    classId: string;
    presentSchool: string;
  }[];

  fatherQualification: string | null;
  fatherProfession: string | null;
  fatherAnnualIncome: number | null;
  fatherAddress: string | null;
  fatherCity: string | null;
  fatherPin: string | number | null;
  fatherState: string | null;
  fatherCountry: string | null;
  fatherMobile: string | number | null;
  fatherEmail: string | null;
  fatherSign: any;
  fatherPlace: string;

  motherQualification: string | null;
  motherProfession: string | null;
  motherAnnualIncome: number | null;
  motherAddress: string | null;
  motherCity: string | null;
  motherPin: string | number | null;
  motherState: string | null;
  motherCountry: string | null;
  motherMobile: string | number | null;
  motherEmail: string | null;
  motherSign: any;
  motherPlace: string;

  guardianQualification: string | null;
  guardianProfession: string | null;
  guardianAnnualIncome: number | null;
  guardianAddress: string | null;
  guardianCity: string | null;
  guardianPin: string | number | null;
  guardianState: string | null;
  guardianCountry: string | null;
  guardianMobile: string | number | null;
  guardianEmail: string | null;
  guardianSign: any;
  guardianPlace: string;

  consent: boolean;
};

export type GuardianAddressType = {
  qualification: string | null;
  profession: string | null;
  annualIncome: number | null;
  address: string | null;
  city: string | null;
  pin: number | null;
  state: string | null;
  country: string | null;
  mobile: string | null;
  email: string | null;
};
