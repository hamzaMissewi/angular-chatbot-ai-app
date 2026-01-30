export interface Client {
  id: string;
  company_name: string;
  email: string;
  phone: string;
  created_at: string;
}

export interface Worker {
  id: string;
  name: string;
  email: string;
  phone: string;
  skills: string[];
  experience_years: number;
  created_at: string;
}

export interface JobPosting {
  id: string;
  client_id: string;
  title: string;
  description: string;
  requirements: string[];
  salary_range?: string;
  location: string;
  is_active: boolean;
  created_at: string;
}

export interface Meeting {
  id: string;
  client_id: string;
  worker_id?: string;
  title: string;
  description: string;
  scheduled_at: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  created_at: string;
}

export interface JobMatch {
  job: JobPosting;
  matched_workers: Worker[];
  match_count: number;
}
