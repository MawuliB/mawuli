// Portfolio Data Interfaces

export interface Profile {
  name: string;
  title: string;
  bio: string;
  avatar: string;
  tagline: string;
  location: string;
  email: string;
  phone?: string;
}

export interface Skill {
  name: string;
  category: 'frontend' | 'backend' | 'database' | 'devops' | 'tools' | 'other';
  level: number; // 0-100
  yearsOfExperience?: number;
  icon?: string;
}

export interface Experience {
  id: number;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string | 'Present';
  description: string;
  responsibilities: string[];
  technologies: string[];
  achievements?: string[];
}

export interface Education {
  id: number;
  institution: string;
  degree: string;
  field: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  honors?: string[];
  relevantCourses?: string[];
  achievements?: string[];
  coursework?: string[];
}

export interface Project {
  id: number;
  title: string;
  description: string;
  longDescription?: string;
  technologies: string[];
  imageUrl?: string;
  githubUrl?: string;
  liveUrl?: string;
  startDate?: string;
  endDate?: string;
  status: 'completed' | 'in-progress' | 'planned';
  featured?: boolean;
  highlights?: string[];
}

export interface Social {
  name: string;
  url: string;
  icon: string;
  username?: string;
}

export interface Contact {
  email: string;
  phone?: string;
  location: string;
  socials: Social[];
  availableForWork: boolean;
  preferredContactMethod?: string;
}

export interface PortfolioData {
  profile: Profile;
  skills: Skill[];
  experience: Experience[];
  education: Education[];
  projects: Project[];
  contact: Contact;
  lastUpdated: string;
}
