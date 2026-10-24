export type RiskLevel = 'green' | 'amber' | 'red';

export type UserRole = 'mother' | 'family' | 'health_worker' | 'ussd_demo';

export interface SupportPerson {
  name: string;
  phone: string;
  relationship: 'Husband' | 'Mother' | 'Mother-in-law' | 'Sister' | 'Neighbor' | 'Other';
}

export interface MotherProfile {
  id: string;
  fullName: string;
  phoneNumber: string;
  age: number;
  state: string;
  lga: string;
  wardOrCommunity: string;
  parity: string; // e.g., "G2 P1"
  isPostpartum: boolean;
  gestationalWeeks?: number;
  postpartumDays?: number;
  eddOrDeliveryDate: string;
  babyName?: string;
  nominatedSupportPerson: SupportPerson;
  primaryHealthCenter: string;
  riskLevel: RiskLevel;
  lastCheckInDate?: string;
  monitoredSince: string;
  medicalNotes?: string;
}

export interface DangerSign {
  id: string;
  code: string;
  label: string;
  description: string;
  pidginDesc: string;
  category: 'maternal' | 'newborn';
  severity: 'critical' | 'warning';
  icon: string;
}

export interface VitalReadings {
  systolicBp?: number;
  diastolicBp?: number;
  temperatureCelsius?: number;
  babyBreathsPerMinute?: number;
}

export interface CheckInRecord {
  id: string;
  motherId: string;
  timestamp: string;
  symptomsReported: string[];
  vitalReadings?: VitalReadings;
  riskLevel: RiskLevel;
  triageSummary: string;
  status: 'safe' | 'alert_sent' | 'reviewed';
  channel: 'smartphone_app' | 'ussd' | 'sms_callback' | 'chew_home_visit';
}

export interface EmergencyAlert {
  id: string;
  motherId: string;
  motherName: string;
  motherPhone: string;
  lga: string;
  state: string;
  locationDetails: string;
  timestamp: string;
  triggerType: 'sos_button' | 'danger_sign_triage' | 'ussd_sos' | 'family_escalation';
  riskLevel: 'amber' | 'red';
  symptoms: string[];
  summary: string;
  clinicalProtocolRecommendation: string;
  familyGuidance: string;
  supportPersonNotified: boolean;
  healthWorkerNotified: boolean;
  status: 'active' | 'acknowledged' | 'dispatched' | 'resolved';
  transportStatus?: 'not_requested' | 'requested' | 'en_route' | 'arrived';
  transportType?: 'tricycle_ambulance' | 'okada_rapid' | 'phc_ambulance' | 'family_vehicle';
  responseLogs: {
    timestamp: string;
    actor: string;
    action: string;
    notes: string;
  }[];
}

export interface NigerianLocation {
  state: string;
  lgas: string[];
  facilities: string[];
}
