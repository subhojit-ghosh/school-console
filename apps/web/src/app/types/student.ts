export type StudentPersonalType = {
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
  fatherPin: number | null;
  fatherState: string | null;
  fatherCountry: string | null;
  fatherMobile: string | null;
  fatherEmail: string | null;
  fatherSign: any;
  fatherPlace: string;

  qualificationM: string | null;
  professionM: string | null;
  annualIncomeM: number | null;
  addressM: string | null;
  cityM: string | null;
  pinM: number | null;
  stateM: string | null;
  countryM: string | null;
  mobileM: string | null;
  emailM: string | null;
  signM: any;
  placeM: string;

  qualificationO: string | null;
  professionO: string | null;
  annualIncomeO: number | null;
  addressO: string | null;
  cityO: string | null;
  pinO: number | null;
  stateO: string | null;
  countryO: string | null;
  mobileO: string | null;
  emailO: string | null;
  signO: any;
  placeO: string;

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
