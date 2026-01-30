import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { JobPosting, Client, JobMatch } from '../../core/models/client.model';

@Component({
  selector: 'app-job-posting',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './job-posting.component.html',
  styleUrl: './job-posting.component.css'
})
export class JobPostingComponent implements OnInit {
  jobs = signal<JobPosting[]>([]);
  clients = signal<Client[]>([]);
  selectedJob = signal<JobPosting | null>(null);
  jobMatches = signal<JobMatch | null>(null);
  loading = signal(false);
  showForm = signal(false);

  newJob = signal<Partial<JobPosting>>({
    title: '',
    description: '',
    requirements: [],
    salary_range: '',
    location: '',
    is_active: true
  });

  newRequirement = signal('');

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.loadData();
  }

  private loadData() {
    this.loading.set(true);

    Promise.all([
      this.apiService.getJobs().toPromise(),
      this.apiService.getClients().toPromise()
    ]).then(([jobs, clients]) => {
      this.jobs.set(jobs || []);
      this.clients.set(clients || []);
    }).catch(error => {
      console.error('Error loading data:', error);
    }).finally(() => {
      this.loading.set(false);
    });
  }

  toggleForm() {
    this.showForm.set(!this.showForm());
    if (this.showForm()) {
      this.resetForm();
    }
  }

  resetForm() {
    this.newJob.set({
      title: '',
      description: '',
      requirements: [],
      salary_range: '',
      location: '',
      is_active: true
    });
    this.newRequirement.set('');
  }

  addRequirement() {
    const requirement = this.newRequirement().trim();
    if (requirement) {
      const current = this.newJob();
      this.newJob.set({
        ...current,
        requirements: [...(current.requirements || []), requirement]
      });
      this.newRequirement.set('');
    }
  }

  removeRequirement(index: number) {
    const current = this.newJob();
    const requirements = [...(current.requirements || [])];
    requirements.splice(index, 1);
    this.newJob.set({
      ...current,
      requirements
    });
  }

  submitJob() {
    const job = this.newJob();
    if (!job.title || !job.description || !job.client_id) {
      alert('Please fill in all required fields');
      return;
    }

    this.loading.set(true);
    this.apiService.createJob(job).subscribe({
      next: (createdJob) => {
        this.jobs.set([createdJob, ...this.jobs()]);
        this.showForm.set(false);
        this.resetForm();
      },
      error: (error) => {
        console.error('Error creating job:', error);
        alert('Error creating job posting');
      },
      complete: () => {
        this.loading.set(false);
      }
    });
  }

  findMatches(jobId: string) {
    this.loading.set(true);
    this.apiService.findMatches(jobId).subscribe({
      next: (matches) => {
        this.jobMatches.set(matches);
      },
      error: (error) => {
        console.error('Error finding matches:', error);
        alert('Error finding job matches');
      },
      complete: () => {
        this.loading.set(false);
      }
    });
  }

  selectJob(job: JobPosting) {
    this.selectedJob.set(job);
    this.jobMatches.set(null);
  }
}
