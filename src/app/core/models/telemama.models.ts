export interface PatientPayload {
  name: string;
  phone: string;
  landmark: string;
  ward_phone: string;
  companion_name: string;
  companion_phone: string;
  family_phone: string;
  weeks_pregnant: number;
}

export interface PatientResponse extends PatientPayload {
  id: number;
  family_name?: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  warning?: string;
  action?: 'created' | 'updated';
  data?: T;
  session?: {
    id: number;
    patient_phone: string;
    status: string;
    due_at: number;
    stage: number;
    emergency_fired: number;
  };
  error?: string;
  recipient?: string;
  timeoutSeconds?: number;
  sms?: {
    success?: boolean;
    error?: string;
    simulated?: boolean;
    sid?: string;
  };
}
