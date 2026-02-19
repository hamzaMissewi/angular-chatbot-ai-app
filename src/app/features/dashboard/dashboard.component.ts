import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { Client, JobPosting, Meeting } from '../../core/models/client.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  clients = signal<Client[]>([]);
  jobs = signal<JobPosting[]>([]);
  meetings = signal<Meeting[]>([]);
  loading = signal(true);

  stats = computed(() => ({
    totalClients: this.clients().length,
    activeJobs: this.jobs().filter((job: JobPosting) => job.is_active).length,
    upcomingMeetings: this.meetings().filter((meeting: Meeting) =>
      meeting.status === 'scheduled' &&
      new Date(meeting.scheduled_at) > new Date()
    ).length
  }));

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.loadData();
  }

  private loadData() {
    this.loading.set(true);

    Promise.all([
      this.apiService.getClients().toPromise(),
      this.apiService.getJobs().toPromise(),
      this.apiService.getMeetings().toPromise()
    ]).then(([clients, jobs, meetings]) => {
      this.clients.set(clients || []);
      this.jobs.set(jobs || []);
      this.meetings.set(meetings || []);
    }).catch(error => {
      console.error('Error loading dashboard data:', error);
    }).finally(() => {
      this.loading.set(false);
    });
  }
}
