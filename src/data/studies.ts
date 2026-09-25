export interface StudyConfig {
  id: string;
  title: string;
  shortTitle: string;
  subtitle: string;
  targetGroup: string;
  duration: string;
  badge: string;
  codePrefix: string;
  pdfTemplate: string;
  formLink: string;
  formPrefillParam?: string;
  path: string;
  principalInvestigator: string;
  investigators: {
    role: string;
    name: string;
    organization: string;
    phone?: string;
  }[];
}

export const STUDIES: Record<string, StudyConfig> = {
  'caregiver-burden': {
    id: 'caregiver-burden',
    title: 'Assessing Cancer Caregiver Burden',
    shortTitle: 'Caregiver Burden',
    subtitle: 'Assessing Cancer Caregiver burden in Karachi’s Public Healthcare System.',
    targetGroup: 'Family Caregivers of Cancer Patients',
    duration: '20–30 minutes interview',
    badge: 'Study 1',
    codePrefix: 'P',
    pdfTemplate: '/ICF-Caregivers.pdf',
    formLink: 'https://docs.google.com/forms/d/e/1FAIpQLSeeN09XyddfeBKge4DL7hfkc-a981UI2jmmzXtClfzVMm46nQ/viewform',
    formPrefillParam: 'entry.451770697',
    path: '/study/caregiver-burden',
    principalInvestigator: 'Dr. Anita Vallacha',
    investigators: [
      {
        role: 'Principal Investigator',
        name: 'Dr. Anita Vallacha',
        organization: 'Oncology Department, Jinnah Postgraduate Medical Centre (JPMC), Karachi',
        phone: '0336-8025062'
      }
    ]
  },
  'health-literacy': {
    id: 'health-literacy',
    title: 'Health Literacy & Cancer Pathways',
    shortTitle: 'Health Literacy',
    subtitle: 'Health Literacy and Its Impact on Cancer Diagnosis and Treatment Pathways: A Cross-Sectional Study at Jinnah Postgraduate Medical Centre, Karachi',
    targetGroup: 'Cancer Patients at JPMC Oncology Department',
    duration: '30–45 minutes interview',
    badge: 'Study 2',
    codePrefix: 'HL',
    pdfTemplate: '/JPMC-ICF-Health-Literacy.pdf',
    formLink: 'https://forms.gle/mZozK9o5uBjL77X18',
    path: '/study/health-literacy',
    principalInvestigator: 'Dr. Anita Vallacha',
    investigators: [
      {
        role: 'Principal Investigator',
        name: 'Dr. Anita Vallacha',
        organization: 'Oncology Department, Jinnah Postgraduate Medical Centre (JPMC), Karachi',
        phone: '0336-8025062'
      },
      {
        role: 'Co-Investigator',
        name: 'Prof. Dr. Ghulam Haider',
        organization: 'Oncology Department, Jinnah Postgraduate Medical Centre (JPMC), Karachi',
        phone: '0300-2307257'
      }
    ]
  }
};

export const STUDY_LIST = Object.values(STUDIES);
