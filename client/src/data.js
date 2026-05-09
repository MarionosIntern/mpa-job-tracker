export const COLS = [
  { id: 'Applied',   label: 'Applied',      color: '#60a5fa' },
  { id: 'Screen',    label: 'Phone Screen', color: '#c084fc' },
  { id: 'Interview', label: 'Interview',    color: '#fb923c' },
  { id: 'Offer',     label: 'Offer',        color: '#4ade80' },
  { id: 'Rejected',  label: 'Rejected',     color: '#f87171' },
];

export const INITIAL_JOBS = [
  {
    id: 1, company: 'Stripe', role: 'Software Engineer, Payments',
    location: 'Remote', salary: '$150k–$200k', status: 'Interview',
    date: '2025-04-20', score: 82,
    skills_match: ['JavaScript', 'Node.js', 'APIs', 'TypeScript'],
    skills_gap: ['Go', 'Distributed Systems'],
  },
  {
    id: 2, company: 'Vercel', role: 'Frontend Engineer',
    location: 'Remote', salary: '$130k–$170k', status: 'Applied',
    date: '2025-04-28', score: 91,
    skills_match: ['React', 'TypeScript', 'CSS', 'Next.js'],
    skills_gap: ['Rust'],
  },
  {
    id: 3, company: 'Anthropic', role: 'Software Engineer, ML Platform',
    location: 'SF / Remote', salary: '$160k–$220k', status: 'Screen',
    date: '2025-04-22', score: 74,
    skills_match: ['Python', 'APIs', 'TypeScript'],
    skills_gap: ['CUDA', 'PyTorch', 'Distributed Training'],
  },
  {
    id: 4, company: 'Linear', role: 'Product Engineer',
    location: 'Remote', salary: '$140k–$180k', status: 'Offer',
    date: '2025-04-10', score: 88,
    skills_match: ['React', 'TypeScript', 'GraphQL', 'Product Thinking'],
    skills_gap: [],
  },
  {
    id: 5, company: 'Ramp', role: 'Backend Engineer',
    location: 'NYC / Remote', salary: '$140k–$185k', status: 'Rejected',
    date: '2025-04-05', score: 68,
    skills_match: ['Python', 'PostgreSQL', 'APIs'],
    skills_gap: ['Kotlin', 'Kafka', 'High-scale Systems'],
  },
];
