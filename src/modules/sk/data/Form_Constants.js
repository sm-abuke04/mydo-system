export const CIVIL_STATUS_OPTIONS = [
  'Single', 'Married', 'Widowed', 'Divorced', 'Separated', 'Annulled', 'Unknown', 'Live-in'
];

export const YOUTH_CLASSIFICATION_OPTIONS = [
  'Working Youth',
  'In School Youth',
  'Out of School Youth',
  'Youth w/ Specific Needs',
  'Children in Conflict w/ Law',
  'Person w/ Disability',
  'Indigenous People'
];

export const YOUTH_AGE_GROUP_OPTIONS = [
  { label: 'Child Youth (15-17 yrs old)', value: 'Child Youth (15-17 yrs old)' },
  { label: 'Core Youth (18-24 yrs old)', value: 'Core Youth (18-24 yrs old)' },
  { label: 'Young Adult (25-30 yrs old)', value: 'Young Adult (25-30 yrs old)' }
];

export const WORK_STATUS_OPTIONS = [
  'Employed',
  'Unemployed',
  'Self-Employed',
  'Currently Looking for a Job',
  'Not Interested Looking for a Job'
];

export const EDUCATIONAL_BACKGROUND_OPTIONS = [
  'Elementary Level', 'Elementary Grad', 'High School Level', 'High School Grad',
  'Vocational Grad', 'College Level', 'College Grad', 'Masters Level',
  'Masters Grad', 'Doctorate Level', 'Doctorate Grad'
];

export const INITIAL_FORM_STATE = {
  id: null,
  firstName: '',
  middleName: '',
  lastName: '',
  suffix: '',
  region: 'VIII - Eastern Visayas',
  province: 'Northern Samar',
  cityMunicipality: 'Catarman',
  barangay: '',
  purokZone: '',
  sex: '',
  age: '',
  birthday: '',
  email: '',
  contact: '',
  civilStatus: '',
  youthClassification: [], // Array
  youthAgeGroup: '',
  workStatus: '',
  educationalBackground: '',
  isSkVoter: false,
  isNationalVoter: false,
  skmtNo: '' // Added for consistency
};