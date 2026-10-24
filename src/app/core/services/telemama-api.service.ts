import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, PatientPayload, PatientResponse } from '../models/telemama.models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TelemamaApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;
  private readonly headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true'
  });

  registerPatient(payload: PatientPayload): Observable<ApiResponse<PatientResponse>> {
    return this.http.post<ApiResponse<PatientResponse>>(
      `${this.baseUrl}/api/patients`,
      payload,
      { headers: this.headers }
    );
  }

  triggerCheckup(phone: string): Observable<ApiResponse> {
    const encodedPhone = encodeURIComponent(phone.trim());
    return this.http.post<ApiResponse>(
      `${this.baseUrl}/api/demo/checkup/${encodedPhone}`,
      {},
      { headers: this.headers }
    );
  }

  triggerWeek36Alert(phone: string): Observable<ApiResponse> {
    const encodedPhone = encodeURIComponent(phone.trim());
    return this.http.post<ApiResponse>(
      `${this.baseUrl}/api/demo/week36/${encodedPhone}`,
      {},
      { headers: this.headers }
    );
  }

  getPatients(): Observable<ApiResponse<PatientResponse[]>> {
    return this.http.get<ApiResponse<PatientResponse[]>>(
      `${this.baseUrl}/api/patients`,
      { headers: this.headers }
    );
  }
}
