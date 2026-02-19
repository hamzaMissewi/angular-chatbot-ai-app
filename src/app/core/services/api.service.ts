import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Client, Worker, JobPosting, Meeting, JobMatch } from '../models/client.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly apiUrl = 'http://localhost:3000/api';
  
  constructor(private http: HttpClient) {}

  // Client endpoints
  getClients(): Observable<Client[]> {
    return this.http.get<Client[]>(`${this.apiUrl}/clients`);
  }

  getClient(id: string): Observable<Client> {
    return this.http.get<Client>(`${this.apiUrl}/clients/${id}`);
  }

  createClient(client: Partial<Client>): Observable<Client> {
    return this.http.post<Client>(`${this.apiUrl}/clients`, client);
  }

  // Worker endpoints
  getWorkers(): Observable<Worker[]> {
    return this.http.get<Worker[]>(`${this.apiUrl}/workers`);
  }

  getWorker(id: string): Observable<Worker> {
    return this.http.get<Worker>(`${this.apiUrl}/workers/${id}`);
  }

  createWorker(worker: Partial<Worker>): Observable<Worker> {
    return this.http.post<Worker>(`${this.apiUrl}/workers`, worker);
  }

  // Job endpoints
  getJobs(): Observable<JobPosting[]> {
    return this.http.get<JobPosting[]>(`${this.apiUrl}/jobs`);
  }

  getJob(id: string): Observable<JobPosting> {
    return this.http.get<JobPosting>(`${this.apiUrl}/jobs/${id}`);
  }

  createJob(job: Partial<JobPosting>): Observable<JobPosting> {
    return this.http.post<JobPosting>(`${this.apiUrl}/jobs`, job);
  }

  // Meeting endpoints
  getMeetings(): Observable<Meeting[]> {
    return this.http.get<Meeting[]>(`${this.apiUrl}/meetings`);
  }

  getMeeting(id: string): Observable<Meeting> {
    return this.http.get<Meeting>(`${this.apiUrl}/meetings/${id}`);
  }

  createMeeting(meeting: Partial<Meeting>): Observable<Meeting> {
    return this.http.post<Meeting>(`${this.apiUrl}/meetings`, meeting);
  }

  // Matching endpoint
  findMatches(jobId: string): Observable<JobMatch> {
    return this.http.get<JobMatch>(`${this.apiUrl}/match/${jobId}`);
  }
}
