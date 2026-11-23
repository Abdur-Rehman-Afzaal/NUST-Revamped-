export type DegreeLevel = 'Undergraduate' | 'MS' | 'PhD';

export type SchoolCode = 'SEECS' | 'SMME' | 'NBS' | 'SADA' | 'S3H';

export interface ProgramItem {
  id: string;
  title: string;
  level: DegreeLevel;
  school: SchoolCode;
  schoolName: string;
  disciplineLabel: string;
  campus: string;
  durationYears: number;
  creditHours: number;
  tuitionPerSemesterPKR: number;
  admissionFeePKR: number;
  netPattern: string;
  meritCutoffLastYear: string;
  intake: string;
  summary: string;
  highlights: string[];
}

export interface PortalLink {
  id: string;
  label: string;
  audience: 'Prospective' | 'Current Student' | 'Industry & Research' | 'Alumni';
  shortDesc: string;
  urlHint: string;
  actionLabel: string;
  details: string[];
}

export interface MegaMenuColumn {
  heading: string;
  links: {
    label: string;
    description: string;
    href: string;
    filterSchool?: SchoolCode;
    filterLevel?: DegreeLevel;
    modalAction?: 'admissions' | 'search' | 'portal-nstp' | 'portal-qalam';
  }[];
}

export interface MegaMenuSection {
  id: string;
  label: string;
  columns: MegaMenuColumn[];
  featuredCallout: {
    kicker: string;
    title: string;
    description: string;
    ctaLabel: string;
    href: string;
    modalAction?: 'admissions' | 'portal-nstp';
  };
}

export interface ResearchSpotlight {
  id: string;
  kicker: string;
  title: string;
  school: string;
  leadInvestigator: string;
  impactMetric: string;
  summary: string;
  abstract: string;
  image?: string;
  imageAlt?: string;
}

export interface NewsItem {
  id: string;
  category: 'Announcement' | 'NET Deadline' | 'Campus Event';
  date: string;
  meta: string;
  title: string;
  summary: string;
  venueOrAction: string;
}

export interface CampusLocation {
  id: string;
  city: string;
  campusName: string;
  address: string;
  schoolsHosted: string;
  phone: string;
  helplineLabel: string;
}

export interface HeroSlide {
  id: string;
  label: string;
  image: string;
  alt: string;
  caption: string;
}

export const NUST_MEDIA = {
  emblem: '/src/assets/nust/nust_emblem.svg',
  promenade: '/src/assets/nust/nust_promenade.jpg',
  lake: '/src/assets/nust/nust_lake.jpg',
  researchCenter: '/src/assets/nust/nust_research_center.jpg',
  lecture2025: '/src/assets/nust/nust_lecture_2025.jpg',
  nstpLogo: '/src/assets/nust/nstp_og.png',
};

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'h12-overview',
    label: 'H-12 Main Campus',
    image: NUST_MEDIA.promenade,
    alt: 'Panoramic view of NUST Sector H-12 Main Campus in Islamabad showing the Main Office dome and academic blocks',
    caption: 'Sector H-12 Main Campus & Central Secretariat, Islamabad (707 Acres)',
  },
  {
    id: 'uspcas-energy',
    label: 'USPCAS-E Research',
    image: NUST_MEDIA.researchCenter,
    alt: 'U.S.-Pakistan Center for Advanced Studies in Energy building at NUST H-12 Islamabad',
    caption: 'Center for Advanced Studies in Energy (USPCAS-E), NUST H-12',
  },
  {
    id: 'nust-lake',
    label: 'Campus Grounds',
    image: NUST_MEDIA.lake,
    alt: 'Sunset over NUST Lake at the H-12 Islamabad residential campus',
    caption: 'NUST Lake & Residential Zone, Sector H-12, Islamabad',
  },
];

export const UTILITY_PORTALS: PortalLink[] = [
  {
    id: 'qalam',
    label: 'Qalam',
    audience: 'Current Student',
    shortDesc: 'Course registration, attendance, transcripts, and fee challans.',
    urlHint: 'qalam.nust.edu.pk',
    actionLabel: 'Open Qalam Workspace',
    details: [
      'Fall & Spring semester course enrollment and drop/add window',
      'Real-time attendance ledger and semester GPA transcripts',
      'Digital fee voucher generation and residential hostel status',
    ],
  },
  {
    id: 'lms',
    label: 'LMS',
    audience: 'Current Student',
    shortDesc: 'Course syllabi, lecture decks, assignments, and Turnitin submissions.',
    urlHint: 'lms.nust.edu.pk',
    actionLabel: 'Launch NUST LMS',
    details: [
      'Unified coursework portal across all 18 constituent schools and colleges',
      'Lab manual distribution and graded rubric feedback',
      'Integrated Turnitin originality verification for term papers and theses',
    ],
  },
  {
    id: 'admissions',
    label: 'Admissions Portal',
    audience: 'Prospective',
    shortDesc: 'NET registration, SAT/ACT national & international seats, and merit lists.',
    urlHint: 'ugadmissions.nust.edu.pk',
    actionLabel: 'Open Admissions & Merit Estimator',
    details: [
      'NET Series I–IV registration with Islamabad, Karachi, Quetta & Gilgit centers',
      'Single application form across SEECS, SMME, NBS, SADA, and S3H',
      'Need-based financial aid and merit scholarship application integrated',
    ],
  },
  {
    id: 'nstp',
    label: 'NSTP',
    audience: 'Industry & Research',
    shortDesc: 'National Science & Technology Park at NUST H-12, Islamabad.',
    urlHint: 'nstp.pk',
    actionLabel: 'Explore NSTP Ecosystem',
    details: [
      '110+ high-tech startups, R&D centers, and global firms on H-12 campus',
      'Hatch 8 pre-incubator and Cube 8 deep-tech accelerator cohorts',
      'Joint industry-faculty R&D contracting and IP commercialization desk',
    ],
  },
  {
    id: 'alumni',
    label: 'Alumni',
    audience: 'Alumni',
    shortDesc: 'Global network of 55,000+ NUST graduates, attestation & endowment.',
    urlHint: 'alumni.nust.edu.pk',
    actionLabel: 'Connect with Alumni Network',
    details: [
      'Online degree and transcript verification desk',
      'Alumni chapters across North America, Europe, GCC, and APAC',
      'NUST Need-Based Scholarship Endowment and student mentorship',
    ],
  },
];

export const MEGA_MENUS: MegaMenuSection[] = [
  {
    id: 'institutions',
    label: 'Institutions',
    columns: [
      {
        heading: 'Engineering, IT & Computer Sciences',
        links: [
          {
            label: 'SEECS — Electrical Engg. & Computer Science',
            description: 'CS, Software Engineering, AI, Data Science & Electrical Engg.',
            href: '#programs',
            filterSchool: 'SEECS',
          },
          {
            label: 'SMME — Mechanical & Manufacturing Engg.',
            description: 'Mechanical, Aerospace, Robotics & Biomedical Engineering',
            href: '#programs',
            filterSchool: 'SMME',
          },
          {
            label: 'Constituent Colleges (EME, MCS, MCE, CAE, PNEC)',
            description: 'Rawalpindi, Risalpur, and Karachi engineering campuses',
            href: '#footer',
          },
        ],
      },
      {
        heading: 'Business, Architecture & Social Sciences',
        links: [
          {
            label: 'NBS — NUST Business School',
            description: 'BBA (Hons), Accounting & Finance, MBA & Analytics',
            href: '#programs',
            filterSchool: 'NBS',
          },
          {
            label: 'SADA — Art, Design & Architecture',
            description: 'B.Arch (5-Year), Industrial Design & Urban Planning',
            href: '#programs',
            filterSchool: 'SADA',
          },
          {
            label: 'S3H — Social Sciences & Humanities',
            description: 'Economics, Mass Communication, Public Policy & Psychology',
            href: '#programs',
            filterSchool: 'S3H',
          },
        ],
      },
    ],
    featuredCallout: {
      kicker: '18 Constituent Institutions',
      title: 'Five Cities, One Academic Standard',
      description:
        'Explore NUST schools in Islamabad alongside constituent engineering colleges in Rawalpindi, Risalpur, Karachi, and Quetta.',
      ctaLabel: 'Browse Program Matrix',
      href: '#programs',
    },
  },
  {
    id: 'academics',
    label: 'Academics',
    columns: [
      {
        heading: 'Degree Programmes',
        links: [
          {
            label: 'Undergraduate Degrees (BS / BE / B.Arch)',
            description: 'PEC, NCEAC & PCATP accredited 4- and 5-year programmes',
            href: '#programs',
            filterLevel: 'Undergraduate',
          },
          {
            label: 'Master of Science & MBA (MS / MBA)',
            description: 'Coursework + research thesis tracks with assistantships',
            href: '#programs',
            filterLevel: 'MS',
          },
          {
            label: 'Doctoral Studies (PhD)',
            description: 'Funded research fellowships across 38+ disciplines',
            href: '#programs',
            filterLevel: 'PhD',
          },
        ],
      },
      {
        heading: 'Student Academic Services',
        links: [
          {
            label: 'Qalam Student Information System',
            description: 'Course enrollment, attendance, transcripts & fee challans',
            href: '#top',
            modalAction: 'portal-qalam',
          },
          {
            label: 'Academic Calendar & Fee Disclosure',
            description: 'Upfront per-semester tuition & credit hour breakdown',
            href: '#programs',
          },
        ],
      },
    ],
    featuredCallout: {
      kicker: 'Upfront Fee Transparency',
      title: 'Compare Tuition & Merit Side-by-Side',
      description:
        'View published per-semester PKR tuition, credit hours, and prior closing merit cutoffs across schools.',
      ctaLabel: 'Open Directory',
      href: '#programs',
    },
  },
  {
    id: 'admissions',
    label: 'Admissions',
    columns: [
      {
        heading: 'Entry Test & Merit',
        links: [
          {
            label: 'NUST Entry Test (NET) 2027',
            description: 'Computer-based & paper-based test schedules across 4 series',
            href: '#news',
            modalAction: 'admissions',
          },
          {
            label: 'Merit Aggregate Calculator',
            description: 'Calculate aggregate (75% NET · 15% FSc · 10% Matric)',
            href: '#programs',
            modalAction: 'admissions',
          },
          {
            label: 'SAT / ACT National & International Seats',
            description: 'Direct admission track for overseas & international applicants',
            href: '#programs',
            modalAction: 'admissions',
          },
        ],
      },
      {
        heading: 'Financial Aid & Fellowships',
        links: [
          {
            label: 'Need-Based Scholarships & Qarz-e-Hasna',
            description: 'Over PKR 1.4B disbursed annually to deserving scholars',
            href: '#programs',
            modalAction: 'admissions',
          },
          {
            label: 'Graduate Teaching Fellowships',
            description: 'Tuition waiver + monthly stipend for MS & PhD scholars',
            href: '#programs',
            filterLevel: 'PhD',
          },
        ],
      },
    ],
    featuredCallout: {
      kicker: 'Fall 2027 Intake',
      title: 'NET Series-I Registration Open',
      description:
        'Apply once across multiple disciplines. Test centers operate in Islamabad, Karachi, Quetta, and Gilgit.',
      ctaLabel: 'Estimate NET Merit',
      href: '#admissions',
      modalAction: 'admissions',
    },
  },
  {
    id: 'research',
    label: 'Research & NSTP',
    columns: [
      {
        heading: 'Innovation & Commercialisation',
        links: [
          {
            label: 'National Science & Technology Park (NSTP)',
            description: 'Pakistan’s flagship IASP-certified Special Technology Zone',
            href: '#research',
            modalAction: 'portal-nstp',
          },
          {
            label: 'USPCAS-E & National Research Centers',
            description: 'Energy, AI, Robotics & Automation, and Cyber Security',
            href: '#research',
          },
        ],
      },
      {
        heading: 'Global Benchmarks',
        links: [
          {
            label: 'QS World & Subject Rankings',
            description: '#1 in Pakistan · #353 Globally · Top 150 Engineering',
            href: '#research',
          },
          {
            label: 'Faculty & Policy Symposia',
            description: 'Recent research briefs and economic policy roundtables',
            href: '#research',
          },
        ],
      },
    ],
    featuredCallout: {
      kicker: 'NSTP · Defining Innovation',
      title: '110+ Resident Tech Firms at H-12',
      description:
        'Co-locating high-growth ventures and industrial R&D labs directly beside NUST academic schools.',
      ctaLabel: 'Explore NSTP',
      href: '#research',
      modalAction: 'portal-nstp',
    },
  },
  {
    id: 'campus',
    label: 'Campus Life',
    columns: [
      {
        heading: 'Locations & Residential Life',
        links: [
          {
            label: 'H-12 Main Campus, Islamabad',
            description: '707-acre campus beneath the Margalla Hills',
            href: '#footer',
          },
          {
            label: 'Regional Campuses & Constituent Colleges',
            description: 'Rawalpindi, Risalpur, Karachi, and Quetta directories',
            href: '#footer',
          },
        ],
      },
      {
        heading: 'Events & Helplines',
        links: [
          {
            label: 'Open Houses & Campus Events',
            description: 'Upcoming academic symposia, showcases, and seat RSVP',
            href: '#news',
          },
          {
            label: '24/7 Medical & Campus Helpline',
            description: 'Central emergency response and admissions support desk',
            href: '#footer',
          },
        ],
      },
    ],
    featuredCallout: {
      kicker: 'What’s On at NUST',
      title: 'Open Houses & Exhibitions',
      description:
        'Reserve your seat for upcoming H-12 open houses, NSTP Demo Day, and SADA design exhibitions.',
      ctaLabel: 'View Calendar',
      href: '#news',
    },
  },
];

export const PROGRAMS: ProgramItem[] = [
  {
    id: 'bs-cs-seecs',
    title: 'BS Computer Science',
    level: 'Undergraduate',
    school: 'SEECS',
    schoolName: 'School of Electrical Engineering & Computer Science',
    disciplineLabel: 'Computing (SEECS)',
    campus: 'H-12 Islamabad',
    durationYears: 4,
    creditHours: 136,
    tuitionPerSemesterPKR: 175000,
    admissionFeePKR: 35000,
    netPattern: 'NET-Engineering / Computing (Math 50%, Physics 30%, English 20%)',
    meritCutoffLastYear: '79.4%',
    intake: 'Fall Only',
    summary:
      'Rigorous foundation in algorithms, systems architecture, distributed computing, and machine intelligence anchored by NCEAC accreditation.',
    highlights: [
      'Direct access to National Centre of Artificial Intelligence (NCAI) labs',
      'Mandatory senior capstone co-supervised with NSTP tech firms',
      'Elective concentrations in Cloud Infrastructure, Vision, and Systems',
    ],
  },
  {
    id: 'bs-ai-seecs',
    title: 'BS Artificial Intelligence',
    level: 'Undergraduate',
    school: 'SEECS',
    schoolName: 'School of Electrical Engineering & Computer Science',
    disciplineLabel: 'Computing (SEECS)',
    campus: 'H-12 Islamabad',
    durationYears: 4,
    creditHours: 135,
    tuitionPerSemesterPKR: 175000,
    admissionFeePKR: 35000,
    netPattern: 'NET-Computing (Math 50%, Physics 30%, English 20%)',
    meritCutoffLastYear: '81.1%',
    intake: 'Fall Only',
    summary:
      'Mathematical and engineering mastery in deep learning, reinforcement learning, natural language processing, and edge AI deployment.',
    highlights: [
      'Dedicated GPU compute cluster for undergraduate model training',
      'Applied robotics & autonomous perception studio modules',
      'Industry-sponsored ethical AI and MLOps practicum',
    ],
  },
  {
    id: 'be-se-seecs',
    title: 'BE Software Engineering',
    level: 'Undergraduate',
    school: 'SEECS',
    schoolName: 'School of Electrical Engineering & Computer Science',
    disciplineLabel: 'Computing (SEECS)',
    campus: 'H-12 Islamabad',
    durationYears: 4,
    creditHours: 138,
    tuitionPerSemesterPKR: 175000,
    admissionFeePKR: 35000,
    netPattern: 'NET-Engineering (Math 50%, Physics 30%, English 20%)',
    meritCutoffLastYear: '78.2%',
    intake: 'Fall Only',
    summary:
      'PEC Washington Accord accredited engineering degree focused on resilient software architecture, verification, and DevSecOps.',
    highlights: [
      'Washington Accord globally recognized engineering accreditation',
      'Formal methods, enterprise systems, and security engineering labs',
      '96% graduate placement within 6 months of convocation',
    ],
  },
  {
    id: 'ms-ds-seecs',
    title: 'MS Data Science',
    level: 'MS',
    school: 'SEECS',
    schoolName: 'School of Electrical Engineering & Computer Science',
    disciplineLabel: 'Computing (SEECS)',
    campus: 'H-12 Islamabad',
    durationYears: 2,
    creditHours: 30,
    tuitionPerSemesterPKR: 128000,
    admissionFeePKR: 25000,
    netPattern: 'GAT-General / NUST Graduate Admission Test (50% min)',
    meritCutoffLastYear: '3.0+ CGPA',
    intake: 'Fall & Spring',
    summary:
      'Evening and research-track graduate program bridging statistical inference, large-scale data pipelines, and applied causal modeling.',
    highlights: [
      '24 credit hours coursework + 6 credit hours applied research thesis',
      'Research Assistantships available with NUST-NSTP partner labs',
      'Evening scheduling accommodates working industry engineers',
    ],
  },
  {
    id: 'phd-cs-seecs',
    title: 'PhD Computer Science',
    level: 'PhD',
    school: 'SEECS',
    schoolName: 'School of Electrical Engineering & Computer Science',
    disciplineLabel: 'Computing (SEECS)',
    campus: 'H-12 Islamabad',
    durationYears: 4,
    creditHours: 48,
    tuitionPerSemesterPKR: 95000,
    admissionFeePKR: 25000,
    netPattern: 'GAT-Subject / GRE Subject + Faculty Research Proposal',
    meritCutoffLastYear: 'MS 3.2+ CGPA',
    intake: 'Fall & Spring',
    summary:
      'Doctoral research producing high-impact publications and patents in Federated Learning, Quantum Cryptography, and IoT Systems.',
    highlights: [
      'Full tuition waiver + PKR 60,000/month fellowship for qualified scholars',
      'International split-site PhD exchange partnerships in EU & UK',
      'Dedicated high-performance compute allocation at SEECS Research Wing',
    ],
  },
  {
    id: 'be-me-smme',
    title: 'BE Mechanical Engineering',
    level: 'Undergraduate',
    school: 'SMME',
    schoolName: 'School of Mechanical & Manufacturing Engineering',
    disciplineLabel: 'Engineering (SMME)',
    campus: 'H-12 Islamabad',
    durationYears: 4,
    creditHours: 137,
    tuitionPerSemesterPKR: 175000,
    admissionFeePKR: 35000,
    netPattern: 'NET-Engineering (Math 50%, Physics 30%, English 20%)',
    meritCutoffLastYear: '73.5%',
    intake: 'Fall Only',
    summary:
      'Core thermofluids, solid mechanics, mechatronics, and CAD/CAM manufacturing training inside Pakistan’s best-equipped mechanical workshops.',
    highlights: [
      'Formula Student (NUST Formula Racing) engineering workshop access',
      'Wind tunnel, CNC 5-axis machining, and materials characterization labs',
      'PEC Level-II Washington Accord accredited degree',
    ],
  },
  {
    id: 'ms-rai-smme',
    title: 'MS Robotics & Intelligent Machine Engineering',
    level: 'MS',
    school: 'SMME',
    schoolName: 'School of Mechanical & Manufacturing Engineering',
    disciplineLabel: 'Engineering (SMME)',
    campus: 'H-12 Islamabad',
    durationYears: 2,
    creditHours: 30,
    tuitionPerSemesterPKR: 128000,
    admissionFeePKR: 25000,
    netPattern: 'GAT-General / NUST Graduate Admission Test',
    meritCutoffLastYear: '2.8+ CGPA',
    intake: 'Fall Only',
    summary:
      'Interdisciplinary graduate specialization in autonomous aerial/ground vehicles, surgical robotics, and nonlinear control systems.',
    highlights: [
      'Housed alongside the National Centre of Robotics & Automation (NCRA)',
      'Motion-capture flight arena & industrial KUKA manipulator testbeds',
      'Direct commercialization pathways through NSTP Cube 8',
    ],
  },
  {
    id: 'phd-me-smme',
    title: 'PhD Mechanical Engineering',
    level: 'PhD',
    school: 'SMME',
    schoolName: 'School of Mechanical & Manufacturing Engineering',
    disciplineLabel: 'Engineering (SMME)',
    campus: 'H-12 Islamabad',
    durationYears: 4,
    creditHours: 48,
    tuitionPerSemesterPKR: 95000,
    admissionFeePKR: 25000,
    netPattern: 'GAT-Subject (Mechanical) + Research Proposal',
    meritCutoffLastYear: 'MS 3.2+ CGPA',
    intake: 'Fall & Spring',
    summary:
      'Advanced doctoral inquiry in composite aerospace structures, micro-fluidics, renewable energy turbines, and additive manufacturing.',
    highlights: [
      'Electron microscopy & laser vibrometry research facilities',
      'HEC & PSF funded research assistantships',
      'Collaborative projects with aviation and energy sector partners',
    ],
  },
  {
    id: 'bba-nbs',
    title: 'BBA (Hons) Business Administration',
    level: 'Undergraduate',
    school: 'NBS',
    schoolName: 'NUST Business School',
    disciplineLabel: 'Business (NBS)',
    campus: 'H-12 Islamabad',
    durationYears: 4,
    creditHours: 134,
    tuitionPerSemesterPKR: 185000,
    admissionFeePKR: 35000,
    netPattern: 'NET-Business Studies (Quant Math 50%, English 50%)',
    meritCutoffLastYear: '76.8%',
    intake: 'Fall Only',
    summary:
      'AACSB-benchmarked management curriculum blending corporate finance, quantitative strategy, digital marketing, and entrepreneurship.',
    highlights: [
      'Bloomberg Terminal Finance Lab & real-time market simulation',
      'Mandatory corporate internship & NSTP venture consulting project',
      'Highest employer recruitment rating among Pakistani business schools',
    ],
  },
  {
    id: 'mba-nbs',
    title: 'MBA (Executive & Full-Time)',
    level: 'MS',
    school: 'NBS',
    schoolName: 'NUST Business School',
    disciplineLabel: 'Business (NBS)',
    campus: 'H-12 Islamabad',
    durationYears: 2,
    creditHours: 60,
    tuitionPerSemesterPKR: 195000,
    admissionFeePKR: 30000,
    netPattern: 'NBS Admission Test / GMAT (550+) + Panel Interview',
    meritCutoffLastYear: '2+ Yrs Exp.',
    intake: 'Fall Only',
    summary:
      'Case-method leadership program training senior managers in supply chain resilience, fintech strategy, and emerging-market growth.',
    highlights: [
      'Harvard Business School case methodology across core modules',
      'International business immersion week with partner schools',
      'Dedicated Executive Career Advisory & C-suite speaker series',
    ],
  },
  {
    id: 'barch-sada',
    title: 'B.Arch (Bachelor of Architecture)',
    level: 'Undergraduate',
    school: 'SADA',
    schoolName: 'School of Art, Design & Architecture',
    disciplineLabel: 'Architecture (SADA)',
    campus: 'H-12 Islamabad',
    durationYears: 5,
    creditHours: 170,
    tuitionPerSemesterPKR: 180000,
    admissionFeePKR: 35000,
    netPattern: 'NET-Architecture (Design Aptitude 50%, Math 30%, English 20%)',
    meritCutoffLastYear: '75.2%',
    intake: 'Fall Only',
    summary:
      'PCATP-accredited 5-year studio-intensive program uniting sustainable urbanism, passive climatic design, and fabrication craft.',
    highlights: [
      '24/7 architectural studio bays, laser cutters & timber model workshop',
      'Annual national architecture & urban heritage field studios',
      'Critiques led by practicing international & Pakistani architects',
    ],
  },
  {
    id: 'ms-urban-sada',
    title: 'MS Urban & Regional Planning',
    level: 'MS',
    school: 'SADA',
    schoolName: 'School of Art, Design & Architecture',
    disciplineLabel: 'Architecture (SADA)',
    campus: 'H-12 Islamabad',
    durationYears: 2,
    creditHours: 30,
    tuitionPerSemesterPKR: 128000,
    admissionFeePKR: 25000,
    netPattern: 'GAT-General + Portfolio & Statement of Purpose',
    meritCutoffLastYear: '2.8+ CGPA',
    intake: 'Fall Only',
    summary:
      'Spatial policy, GIS urban analytics, and climate-resilient metropolitan planning for fast-growing South Asian cities.',
    highlights: [
      'ArcGIS & spatial data visualization studio integrated',
      'Live policy briefs with Capital Development Authority & UN-Habitat',
      'Cross-disciplinary electives with S3H & Environmental Engineering',
    ],
  },
  {
    id: 'bs-econ-s3h',
    title: 'BS Economics',
    level: 'Undergraduate',
    school: 'S3H',
    schoolName: 'School of Social Sciences & Humanities',
    disciplineLabel: 'Social Sciences (S3H)',
    campus: 'H-12 Islamabad',
    durationYears: 4,
    creditHours: 132,
    tuitionPerSemesterPKR: 162000,
    admissionFeePKR: 35000,
    netPattern: 'NET-Social Sciences (Quant Math 50%, English 50%)',
    meritCutoffLastYear: '74.0%',
    intake: 'Fall Only',
    summary:
      'Quantitative economics degree pairing econometrics, macroeconomic policy modeling, and development economics with R/Stata labs.',
    highlights: [
      'Econometrics & Policy Simulation Lab on H-12 campus',
      'Strong placement pipeline to World Bank, SBP, and global MS programs',
      'Minor tracks available in Data Analytics and Public Policy',
    ],
  },
  {
    id: 'phd-econ-s3h',
    title: 'PhD Economics',
    level: 'PhD',
    school: 'S3H',
    schoolName: 'School of Social Sciences & Humanities',
    disciplineLabel: 'Social Sciences (S3H)',
    campus: 'H-12 Islamabad',
    durationYears: 4,
    creditHours: 48,
    tuitionPerSemesterPKR: 92000,
    admissionFeePKR: 25000,
    netPattern: 'GAT-Subject / GRE + Research Proposal Defense',
    meritCutoffLastYear: 'MS 3.2+ CGPA',
    intake: 'Fall & Spring',
    summary:
      'Empirical policy research examining monetary transmission, climate finance, labor economics, and South Asian trade corridors.',
    highlights: [
      'Access to longitudinal household and macro panel datasets',
      'Publication support for Q1/Q2 international economics journals',
      'Teaching fellowship & conference travel grants included',
    ],
  },
];

export const RESEARCH_SPOTLIGHTS: ResearchSpotlight[] = [
  {
    id: 'res-energy-uspcas',
    kicker: 'Energy & Smart Grids · USPCAS-E & SEECS',
    title: 'AI-Dispatched Solar Micro-Inverters & Grid Resilience',
    school: 'Center for Advanced Studies in Energy (USPCAS-E), H-12',
    leadInvestigator: 'Prof. Ayesha Siddiqui & USPCAS-E Energy Fellows',
    impactMetric: '22% lower distribution losses across 14 rural pilot feeders',
    summary:
      'Edge-inference inverter firmware developed at NUST’s H-12 Energy Complex balances rooftop solar storage across weak rural feeders.',
    abstract:
      'Tested inside the U.S.-Pakistan Center for Advanced Studies in Energy at NUST Islamabad, this decentralized droop-control firmware prevents voltage collapse during cloud transients and reduces diesel generator runtime by over 60%.',
    image: NUST_MEDIA.researchCenter,
    imageAlt: 'Center for Advanced Studies in Energy building at NUST H-12 Islamabad',
  },
  {
    id: 'res-macro-policy',
    kicker: 'Economic Policy · S3H Islamabad',
    title: 'Macroeconomic Resilience & Industrial Trade Corridors',
    school: 'School of Social Sciences & Humanities (S3H), H-12',
    leadInvestigator: 'NUST Policy Roundtable & Visiting Economists',
    impactMetric: '12 joint policy briefs published with regional ministries',
    summary:
      'International macroeconomics seminars at NUST H-12 examine sovereign debt dynamics, green industrial policy, and export diversification.',
    abstract:
      'Bringing together faculty scholars, central bank researchers, and international visiting economists at NUST Islamabad, the S3H policy series produces open-access empirical models for South Asian fiscal stability.',
    image: NUST_MEDIA.lecture2025,
    imageAlt: 'Macroeconomics seminar and policy roundtable at NUST Islamabad',
  },
  {
    id: 'res-composite-airframe',
    kicker: 'Aerospace & Materials · SMME & SADA',
    title: 'Carbon-Epoxy Airframes & Passive Climate Structures',
    school: 'SMME Structural Dynamics & SADA Fabrication Labs',
    leadInvestigator: 'Dr. Kamran Rashid & Ar. Zainab Qureshi',
    impactMetric: '34% structural mass reduction · 6.4°C passive indoor cooling',
    summary:
      'Interdisciplinary materials research spanning embedded optical strain sensors for unmanned aircraft and compressed-earth passive cooling blocks.',
    abstract:
      'Cross-school research at H-12 pairs SMME autoclave composite testing with SADA thermal mass modeling—producing field-ready aerospace diagnostics and flood-resilient housing modules.',
    image: NUST_MEDIA.lake,
    imageAlt: 'NUST H-12 Campus Lake and ecological watershed in Islamabad',
  },
];

export const NEWS_ITEMS: NewsItem[] = [
  {
    id: 'news-qs-2027',
    category: 'Announcement',
    date: 'Nov 18, 2026',
    meta: 'University Ranking · Global Affairs',
    title: 'NUST Retains #1 Spot in Pakistan in QS World & Engineering Rankings',
    summary:
      'Ranked #353 globally and Top 150 worldwide in Engineering & Technology, led by international research citations and employer reputation.',
    venueOrAction: 'Read Ranking Summary',
  },
  {
    id: 'news-hec-grant',
    category: 'Announcement',
    date: 'Nov 12, 2026',
    meta: 'Research Office · ORIC',
    title: 'PKR 420M Awarded Across 11 NUST-Industry Applied Tech Consortia',
    summary:
      'Joint grants between SEECS, SMME, and NSTP resident enterprises will fund grid-scale storage, biomedical devices, and precision agriculture.',
    venueOrAction: 'View Funded Labs',
  },
  {
    id: 'news-convocation',
    category: 'Announcement',
    date: 'Nov 04, 2026',
    meta: 'Academic Affairs · H-12',
    title: 'Undergraduate Financial Aid Endowment Expands Need-Based Coverage',
    summary:
      'Incoming Fall 2027 scholars from underserved districts qualify for 100% tuition and hostel support under the expanded NUST Need-Based Fund.',
    venueOrAction: 'Check Aid Eligibility',
  },
];

export const NET_DEADLINES: NewsItem[] = [
  {
    id: 'net-series-1',
    category: 'NET Deadline',
    date: 'Dec 08, 2026',
    meta: 'NET Series-I · Registration Closes',
    title: 'NUST Entry Test (NET) Series-I Application & Fee Submission',
    summary:
      'Computer-based tests at H-12 Islamabad commence Dec 14; paper-based tests in Karachi and Quetta follow in late December.',
    venueOrAction: 'Register / Estimate Merit',
  },
  {
    id: 'net-series-2',
    category: 'NET Deadline',
    date: 'Jan 25, 2027',
    meta: 'NET Series-II · Window Opens',
    title: 'NET Series-II Online Portal Opens for All UG Disciplines',
    summary:
      'Candidates may appear in multiple NET series; NUST automatically retains your highest score for final merit computation.',
    venueOrAction: 'View Test Pattern',
  },
  {
    id: 'net-ms-phd',
    category: 'NET Deadline',
    date: 'Feb 19, 2027',
    meta: 'Graduate Admissions · MS & PhD',
    title: 'Spring / Fall Graduate Fellowship & GAT Verification Deadline',
    summary:
      'Submit research proposals and HEC GAT/GRE scores for funded Teaching & Research Assistantships across 18 schools.',
    venueOrAction: 'Browse MS & PhD Programs',
  },
];

export const CAMPUS_EVENTS: NewsItem[] = [
  {
    id: 'evt-open-house',
    category: 'Campus Event',
    date: 'Dec 05, 2026 · 10:00 PKT',
    meta: 'Jinnah Auditorium · H-12 Islamabad',
    title: 'Fall 2027 Prospective Student Open House & Lab Tour',
    summary:
      'Meet Deans from SEECS, SMME, NBS, SADA, and S3H, tour robotics and Bloomberg labs, and attend a live NET strategy briefing.',
    venueOrAction: 'H-12 Main Campus',
  },
  {
    id: 'evt-nstp-demo',
    category: 'Campus Event',
    date: 'Dec 11, 2026 · 14:30 PKT',
    meta: 'NSTP Innovation Atrium · H-12',
    title: 'NSTP Cube 8 Deep-Tech Demo Day & Investor Showcase',
    summary:
      '18 university spinouts in clean energy, med-tech, and autonomous systems pitch live to regional venture funds and industry leaders.',
    venueOrAction: 'NSTP Atrium',
  },
  {
    id: 'evt-sada-exhibition',
    category: 'Campus Event',
    date: 'Dec 16, 2026 · 11:00 PKT',
    meta: 'SADA Courtyard Gallery · H-12',
    title: 'Annual Architecture & Industrial Design Degree Show',
    summary:
      'Public exhibition of climate-resilient housing prototypes, structural timber pavilions, and graduate urban planning theses.',
    venueOrAction: 'SADA Gallery',
  },
];

export const CAMPUSES: CampusLocation[] = [
  {
    id: 'islamabad',
    city: 'Islamabad',
    campusName: 'H-12 Main Campus',
    address: 'Sector H-12, Srinagar Highway, Islamabad 44000',
    schoolsHosted: 'SEECS, SMME, NBS, SADA, S3H, SCEE, SCME, SNS, ASAB, NSHS, SINES & NSTP',
    phone: '+92-51-9085-1000',
    helplineLabel: 'Central Admissions & Campus Desk',
  },
  {
    id: 'rawalpindi',
    city: 'Rawalpindi',
    campusName: 'CEME & MCS Campuses',
    address: 'Peshawar Road (CEME) & Humayun Road (MCS), Rawalpindi',
    schoolsHosted: 'College of Electrical & Mechanical Engineering · Military College of Signals',
    phone: '+92-51-5444-4000',
    helplineLabel: 'CEME / MCS Academic Office',
  },
  {
    id: 'risalpur',
    city: 'Risalpur',
    campusName: 'MCE & CAE Campuses',
    address: 'Nowshera-Mardan Road, Risalpur Cantt, Khyber Pakhtunkhwa',
    schoolsHosted: 'Military College of Engineering · College of Aeronautical Engineering',
    phone: '+92-923-631-621',
    helplineLabel: 'Risalpur Engineering Registry',
  },
  {
    id: 'karachi',
    city: 'Karachi',
    campusName: 'PNEC Campus',
    address: 'Habib Ibrahim Rehmatullah Road, Karsaz, Karachi',
    schoolsHosted: 'Pakistan Navy Engineering College (Mechanical, Electrical, Naval Architecture)',
    phone: '+92-21-9924-0114',
    helplineLabel: 'PNEC Admissions & Student Desk',
  },
  {
    id: 'quetta',
    city: 'Quetta',
    campusName: 'NUST Balochistan Campus (NBC)',
    address: 'Chiltan Road, Quetta Cantt, Balochistan',
    schoolsHosted: 'Civil Engineering, Computer Science & Regional Development Studies',
    phone: '+92-81-920-4051',
    helplineLabel: 'NBC Regional Office',
  },
];
