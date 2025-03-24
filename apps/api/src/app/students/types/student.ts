export type StudentPhotoDocumentType = {
  studentPhoto: Express.Multer.File;
  fatherPhoto: Express.Multer.File;
  motherPhoto: Express.Multer.File;
  studentBirthCertificate: Express.Multer.File;
  studentVacinationRecord: Express.Multer.File;
  studentMedicalRecord: Express.Multer.File;

  fatherSignature: Express.Multer.File;
  motherSignature: Express.Multer.File;
  guardainSignature: Express.Multer.File;
};
