export type StudentPersonalType = {
  regNo: string;
  admissionDate: string | null;
  classId: string | null;

  studentPhoto: any;
  fatherPhoto: any;
  motherPhoto: any;

  studentName: string;
  dob: string;
  gender: 'M' | 'F' | 'O';

  religion: string;
  nationality: string;
  nativeLanguage: string;
  caste: string;

  fatherName: string;
  fatherNo: number;
  motherName: number;
  motherNo: string;

  pAddress: string;
  pPo: string;
  pPs: string;
  pPin: number;

  isBothAddressSame: boolean;

  prAddress: string;
  prPo: string;
  prPs: string;
  prPin: number;

  previousSchoolDetails: {
    name: string;
    place: string;
    key: string;
    affilatedBoard: string;
    standard: string;
    periodStart: string | null;
    periodEnd: string | null;
  }[];

  medicalHistory: string;
  medicalFile: any;
  vaccinationRecord: any;

  siblingDetails: {
    key: string;
    name: string;
    dob: string | null;
    classId: string;
    presentSchool: string;
  }[];

  qualificationF: string | null;
  professionF: string | null;
  annualIncomeF: number | null;
  addressF: string | null;
  cityF: string | null;
  pinF: number | null;
  stateF: string | null;
  countryF: string | null;
  mobileF: string | null;
  emailF: string | null;
  signF: any;
  placeF: string;

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
