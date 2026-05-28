export interface Job {
  _id: string;
  jobApplication: {
    title: string;
    description: string;
    descriptionHTML: string;
  };
  hr: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
}

export interface SkillsMatch {
  strong: string[];
  partial: string[];
  missing: string[];
}

export interface Evaluation {
  score: number;
  reasoning: string;
  strengths: string[];
  gaps: string[];
  decision: string;
}

export interface Candidate {
  _id: string;
  candidateName: string;
  candidateEmail: string;
  jobTitle: string;
  score: number;
  tag: string;
  summary: string;
  evaluation: Evaluation;
  skillsMatch: SkillsMatch;
  webResearch: any;
  timestamp: string;
}