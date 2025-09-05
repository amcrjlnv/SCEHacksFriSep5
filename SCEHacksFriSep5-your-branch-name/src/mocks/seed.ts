export interface MockUser {
  id: string;
  name: string;
  roles: string[];
  skills: string[];
  interests: string[];
  contact: string;
  blurb: string;
  availability: string;
}

export const HACKATHONS = [
  'SCE 2025',
  'HackDavis',
  'HackHarvard'
] as const;

export const ROLES = [
  'FE', 'BE', 'ML/AI', 'Mobile', 'Design', 'Product', 'Hardware'
] as const;

export const SKILLS = [
  'React', 'Tailwind', 'FastAPI', 'Python', 'Node', 'Postgres', 'Mongo', 
  'LangChain', 'PyTorch', 'TypeScript', 'JavaScript', 'Flutter', 'Swift',
  'Figma', 'Unity', 'Arduino', 'TensorFlow', 'Vue', 'Svelte', 'Go'
] as const;

export const INTERESTS = [
  'Health', 'Fintech', 'EdTech', 'Climate', 'Social Good', 'Productivity', 'Fun'
] as const;

export const AVAILABILITY_OPTIONS = [
  'Full weekend', 'Evenings only', 'Flexible'
] as const;

export const mockUsers: Record<string, MockUser[]> = {
  'SCE 2025': [
    {
      id: 'sce-1',
      name: 'Alex Chen',
      roles: ['FE', 'Design'],
      skills: ['React', 'Tailwind', 'TypeScript', 'Figma'],
      interests: ['Health', 'EdTech'],
      contact: 'alexc#1234',
      blurb: 'Frontend dev with design background. Love creating intuitive UIs for healthcare apps.',
      availability: 'Full weekend'
    },
    {
      id: 'sce-2',
      name: 'Jordan Smith',
      roles: ['BE', 'ML/AI'],
      skills: ['Python', 'FastAPI', 'PyTorch', 'Postgres'],
      interests: ['Health', 'Climate'],
      contact: 'jordan.smith@email.com',
      blurb: 'ML engineer focused on healthcare applications. Built predictive models for patient outcomes.',
      availability: 'Full weekend'
    },
    {
      id: 'sce-3',
      name: 'Sam Rodriguez',
      roles: ['Mobile', 'FE'],
      skills: ['Flutter', 'React', 'TypeScript', 'Firebase'],
      interests: ['Productivity', 'Fun'],
      contact: 'samrod#5678',
      blurb: 'Mobile developer who loves building apps that make life easier and more enjoyable.',
      availability: 'Flexible'
    },
    {
      id: 'sce-4',
      name: 'Morgan Taylor',
      roles: ['Product', 'Design'],
      skills: ['Figma', 'React', 'Python'],
      interests: ['Social Good', 'EdTech'],
      contact: 'morgan.taylor@email.com',
      blurb: 'Product designer with coding skills. Passionate about creating tech for social impact.',
      availability: 'Evenings only'
    },
    {
      id: 'sce-5',
      name: 'Casey Wong',
      roles: ['BE', 'Hardware'],
      skills: ['Node', 'Arduino', 'Python', 'Mongo'],
      interests: ['Climate', 'Hardware'],
      contact: 'caseyw#9012',
      blurb: 'Full-stack developer with IoT experience. Building sustainable tech solutions.',
      availability: 'Full weekend'
    },
    {
      id: 'sce-6',
      name: 'Riley Kim',
      roles: ['ML/AI', 'BE'],
      skills: ['TensorFlow', 'Python', 'FastAPI', 'LangChain'],
      interests: ['Fintech', 'Productivity'],
      contact: 'riley.kim@email.com',
      blurb: 'AI researcher working on NLP and financial prediction models.',
      availability: 'Flexible'
    },
    {
      id: 'sce-7',
      name: 'Avery Johnson',
      roles: ['FE', 'Mobile'],
      skills: ['Vue', 'Swift', 'TypeScript', 'Tailwind'],
      interests: ['Fun', 'Productivity'],
      contact: 'avery#3456',
      blurb: 'Creative developer who enjoys building engaging user experiences.',
      availability: 'Full weekend'
    }
  ],
  'HackDavis': [
    {
      id: 'hd-1',
      name: 'Taylor Park',
      roles: ['BE', 'ML/AI'],
      skills: ['Python', 'TensorFlow', 'Postgres', 'FastAPI'],
      interests: ['Climate', 'Health'],
      contact: 'taylor.park@email.com',
      blurb: 'Data scientist focused on environmental sustainability and public health.',
      availability: 'Full weekend'
    },
    {
      id: 'hd-2',
      name: 'Blake Davis',
      roles: ['FE', 'Design'],
      skills: ['React', 'Figma', 'JavaScript', 'Tailwind'],
      interests: ['EdTech', 'Social Good'],
      contact: 'blaked#7890',
      blurb: 'Frontend designer passionate about accessible education technology.',
      availability: 'Flexible'
    },
    {
      id: 'hd-3',
      name: 'Quinn Miller',
      roles: ['Hardware', 'BE'],
      skills: ['Arduino', 'Python', 'Node', 'Unity'],
      interests: ['Climate', 'Fun'],
      contact: 'quinn.miller@email.com',
      blurb: 'Hardware hacker building interactive installations for climate awareness.',
      availability: 'Full weekend'
    },
    {
      id: 'hd-4',
      name: 'Sage Brown',
      roles: ['Product', 'FE'],
      skills: ['React', 'Figma', 'TypeScript', 'Node'],
      interests: ['Health', 'Productivity'],
      contact: 'sagebrown#2468',
      blurb: 'Product manager with technical skills. Building tools for better health outcomes.',
      availability: 'Evenings only'
    },
    {
      id: 'hd-5',
      name: 'River Chen',
      roles: ['Mobile', 'ML/AI'],
      skills: ['Flutter', 'PyTorch', 'Python', 'Firebase'],
      interests: ['EdTech', 'Productivity'],
      contact: 'river.chen@email.com',
      blurb: 'Mobile AI developer creating personalized learning experiences.',
      availability: 'Flexible'
    },
    {
      id: 'hd-6',
      name: 'Phoenix Lee',
      roles: ['FE', 'BE'],
      skills: ['Svelte', 'Go', 'Postgres', 'Tailwind'],
      interests: ['Fintech', 'Climate'],
      contact: 'phoenix#1357',
      blurb: 'Full-stack developer interested in sustainable fintech solutions.',
      availability: 'Full weekend'
    }
  ],
  'HackHarvard': [
    {
      id: 'hh-1',
      name: 'Rowan Kim',
      roles: ['ML/AI', 'BE'],
      skills: ['LangChain', 'Python', 'TensorFlow', 'FastAPI'],
      interests: ['EdTech', 'Fintech'],
      contact: 'rowan.kim@email.com',
      blurb: 'AI researcher developing LLM applications for finance and education.',
      availability: 'Full weekend'
    },
    {
      id: 'hh-2',
      name: 'Skyler Jones',
      roles: ['FE', 'Product'],
      skills: ['React', 'TypeScript', 'Tailwind', 'Figma'],
      interests: ['Health', 'Social Good'],
      contact: 'skyler#9876',
      blurb: 'Product-focused frontend developer with a passion for healthcare innovation.',
      availability: 'Flexible'
    },
    {
      id: 'hh-3',
      name: 'Drew Wilson',
      roles: ['BE', 'Hardware'],
      skills: ['Node', 'Arduino', 'Mongo', 'Python'],
      interests: ['Climate', 'Hardware'],
      contact: 'drew.wilson@email.com',
      blurb: 'Backend engineer with IoT expertise, focusing on environmental monitoring.',
      availability: 'Full weekend'
    },
    {
      id: 'hh-4',
      name: 'Finley Adams',
      roles: ['Design', 'FE'],
      skills: ['Figma', 'React', 'Vue', 'Tailwind'],
      interests: ['Fun', 'Productivity'],
      contact: 'finley#5432',
      blurb: 'Creative designer who codes. Love making productivity tools that are actually fun to use.',
      availability: 'Evenings only'
    },
    {
      id: 'hh-5',
      name: 'Emery Clark',
      roles: ['Mobile', 'ML/AI'],
      skills: ['Swift', 'PyTorch', 'Python', 'TensorFlow'],
      interests: ['Health', 'Productivity'],
      contact: 'emery.clark@email.com',
      blurb: 'iOS developer integrating ML models for health and fitness applications.',
      availability: 'Full weekend'
    },
    {
      id: 'hh-6',
      name: 'Justice Smith',
      roles: ['BE', 'Product'],
      skills: ['FastAPI', 'Python', 'Postgres', 'React'],
      interests: ['Social Good', 'EdTech'],
      contact: 'justice#6789',
      blurb: 'Backend developer turned product manager, building platforms for social impact.',
      availability: 'Flexible'
    },
    {
      id: 'hh-7',
      name: 'Oakley Brown',
      roles: ['FE', 'Design'],
      skills: ['React', 'Figma', 'TypeScript', 'Tailwind'],
      interests: ['Fintech', 'Fun'],
      contact: 'oakley.brown@email.com',
      blurb: 'Frontend developer and designer making fintech more accessible and enjoyable.',
      availability: 'Full weekend'
    }
  ]
};