import { Injectable, signal, computed } from '@angular/core';
import { MotherProfile, EmergencyAlert, CheckInRecord, UserRole, NigerianLocation, VitalReadings } from '../models/maternal.models';
import { evaluateDangerSigns } from '../utils/triage';

const LOCAL_STORAGE_KEY_MOTHERS = 'telemama_mothers_v1';
const LOCAL_STORAGE_KEY_ALERTS = 'telemama_alerts_v1';
const LOCAL_STORAGE_KEY_CHECKINS = 'telemama_checkins_v1';
const LOCAL_STORAGE_KEY_ROLE = 'telemama_active_role_v1';
const LOCAL_STORAGE_KEY_ACTIVE_MOTHER = 'telemama_active_mother_id_v1';

export const NIGERIAN_LOCATIONS: NigerianLocation[] = [
  {
    state: 'Lagos',
    lgas: ['Alimosho', 'Ikeja', 'Surulere', 'Ikorodu', 'Agege'],
    facilities: ['Alimosho Comprehensive PHC', 'Ikeja Primary Health Centre', 'Akerele Maternal & Child Centre', 'Ikorodu General PHC Ward']
  },
  {
    state: 'Kano',
    lgas: ['Nasarawa', 'Dala', 'Fagge', 'Tarauni', 'Gwale'],
    facilities: ['Nasarawa Maternal Health Clinic', 'Dala Primary Health Centre', 'Waziri Gidado Comprehensive PHC']
  },
  {
    state: 'Oyo',
    lgas: ['Ibadan North', 'Ibadan South-West', 'Oyo East', 'Ogbomoso North'],
    facilities: ['Bodija Primary Health Centre', 'Ring Road Maternal Post', 'Oranyan Primary Healthcare Ward']
  },
  {
    state: 'Kaduna',
    lgas: ['Kaduna North', 'Zaria', 'Chikun', 'Sabon Gari'],
    facilities: ['Kawo Maternal Clinic', 'Tudun Wada Comprehensive PHC', 'Chikun Primary Health Clinic']
  },
  {
    state: 'Cross River',
    lgas: ['Calabar South', 'Calabar Municipal', 'Akpabuyo'],
    facilities: ['Anantigha Primary Health Centre', 'Diamond Hill Health Post', 'Akpabuyo Rural PHC']
  },
  {
    state: 'Ogun',
    lgas: ['Abeokuta South', 'Sagamu', 'Ijebu Ode', 'Ado-Odo/Ota'],
    facilities: ['Ake Primary Health Centre', 'Sagamu Maternal Health Unit', 'Ota Comprehensive Health Centre']
  }
];

const INITIAL_MOTHERS: MotherProfile[] = [
  {
    id: 'MOM-001',
    fullName: 'Amina Bello',
    phoneNumber: '+234 803 452 8819',
    age: 24,
    state: 'Lagos',
    lga: 'Alimosho',
    wardOrCommunity: 'Egbeda / Pipeline Road',
    parity: 'G2 P1',
    isPostpartum: false,
    gestationalWeeks: 34,
    eddOrDeliveryDate: '2026-12-05',
    nominatedSupportPerson: {
      name: 'Babatunde Bello',
      phone: '+234 802 331 4455',
      relationship: 'Husband'
    },
    primaryHealthCenter: 'Alimosho Comprehensive PHC',
    riskLevel: 'red',
    lastCheckInDate: 'Today, 25 mins ago',
    monitoredSince: '2026-08-14',
    medicalNotes: 'Previous borderline elevated blood pressure. History of mild ankle edema.'
  },
  {
    id: 'MOM-002',
    fullName: 'Fatima Danjuma',
    phoneNumber: '+234 809 112 3344',
    age: 28,
    state: 'Kano',
    lga: 'Nasarawa',
    wardOrCommunity: 'Dakata Ward',
    parity: 'G3 P2',
    isPostpartum: true,
    postpartumDays: 3,
    eddOrDeliveryDate: '2026-10-21',
    babyName: 'Baby Ibrahim',
    nominatedSupportPerson: {
      name: 'Sani Danjuma',
      phone: '+234 813 556 7788',
      relationship: 'Husband'
    },
    primaryHealthCenter: 'Nasarawa Maternal Health Clinic',
    riskLevel: 'red',
    lastCheckInDate: 'Today, 1 hour ago',
    monitoredSince: '2026-06-10',
    medicalNotes: 'Delivered at home with Traditional Birth Attendant; baby brought to PHC for BCG day 2.'
  },
  {
    id: 'MOM-003',
    fullName: 'Chioma Eze',
    phoneNumber: '+234 701 998 7766',
    age: 26,
    state: 'Oyo',
    lga: 'Ibadan North',
    wardOrCommunity: 'Bodija Market Area',
    parity: 'G1 P0',
    isPostpartum: false,
    gestationalWeeks: 28,
    eddOrDeliveryDate: '2027-01-16',
    nominatedSupportPerson: {
      name: 'Emeka Eze',
      phone: '+234 805 776 5432',
      relationship: 'Husband'
    },
    primaryHealthCenter: 'Bodija Primary Health Centre',
    riskLevel: 'amber',
    lastCheckInDate: 'Today, 3 hours ago',
    monitoredSince: '2026-07-22',
    medicalNotes: 'Mild morning headache and swollen fingers. Advised to reduce salt and rest.'
  },
  {
    id: 'MOM-004',
    fullName: 'Blessings Okon',
    phoneNumber: '+234 818 223 9900',
    age: 22,
    state: 'Cross River',
    lga: 'Calabar South',
    wardOrCommunity: 'Anantigha Waterfront',
    parity: 'G1 P0',
    isPostpartum: false,
    gestationalWeeks: 36,
    eddOrDeliveryDate: '2026-11-20',
    nominatedSupportPerson: {
      name: 'Victoria Okon',
      phone: '+234 803 999 1122',
      relationship: 'Mother'
    },
    primaryHealthCenter: 'Anantigha Primary Health Centre',
    riskLevel: 'green',
    lastCheckInDate: 'Today, 08:15 AM',
    monitoredSince: '2026-05-18',
    medicalNotes: 'Active fetal movements reported (>10 kicks/12h). Routine ANC up to date.'
  },
  {
    id: 'MOM-005',
    fullName: 'Halima Usman',
    phoneNumber: '+234 802 887 6655',
    age: 31,
    state: 'Kaduna',
    lga: 'Kaduna North',
    wardOrCommunity: 'Kawo Central',
    parity: 'G4 P3',
    isPostpartum: true,
    postpartumDays: 14,
    eddOrDeliveryDate: '2026-10-10',
    babyName: 'Baby Zainab',
    nominatedSupportPerson: {
      name: 'Hadiza Usman',
      phone: '+234 703 445 6677',
      relationship: 'Sister'
    },
    primaryHealthCenter: 'Kawo Maternal Clinic',
    riskLevel: 'green',
    lastCheckInDate: 'Yesterday, 18:30',
    monitoredSince: '2026-04-12',
    medicalNotes: 'Baby feeding well, cord stump detached cleanly on day 6. No postpartum fever.'
  },
  {
    id: 'MOM-006',
    fullName: 'Grace Adeyemi',
    phoneNumber: '+234 806 334 1122',
    age: 29,
    state: 'Ogun',
    lga: 'Abeokuta South',
    wardOrCommunity: 'Ake Palace Area',
    parity: 'G2 P1',
    isPostpartum: false,
    gestationalWeeks: 32,
    eddOrDeliveryDate: '2026-12-18',
    nominatedSupportPerson: {
      name: 'Olumide Adeyemi',
      phone: '+234 812 334 5566',
      relationship: 'Husband'
    },
    primaryHealthCenter: 'Ake Primary Health Centre',
    riskLevel: 'amber',
    lastCheckInDate: 'Today, 06:45 AM',
    monitoredSince: '2026-06-30',
    medicalNotes: 'Reported low grade fever 37.8°C and chills. Suspected mild malaria in pregnancy.'
  },
  {
    id: 'MOM-007',
    fullName: 'Zainab Ibrahim',
    phoneNumber: '+234 708 554 3321',
    age: 21,
    state: 'Lagos',
    lga: 'Ikorodu',
    wardOrCommunity: 'Ijede Waterways',
    parity: 'G1 P0',
    isPostpartum: true,
    postpartumDays: 6,
    eddOrDeliveryDate: '2026-10-18',
    babyName: 'Baby Farouk',
    nominatedSupportPerson: {
      name: 'Aisha Ibrahim',
      phone: '+234 803 778 9900',
      relationship: 'Mother-in-law'
    },
    primaryHealthCenter: 'Ikorodu General PHC Ward',
    riskLevel: 'green',
    lastCheckInDate: 'Today, 09:30 AM',
    monitoredSince: '2026-05-02',
    medicalNotes: 'Normal postpartum recovery. Exclusive breastfeeding established.'
  }
];

const INITIAL_ALERTS: EmergencyAlert[] = [
  {
    id: 'ALT-901',
    motherId: 'MOM-001',
    motherName: 'Amina Bello',
    motherPhone: '+234 803 452 8819',
    lga: 'Alimosho, Lagos',
    state: 'Lagos',
    locationDetails: 'Egbeda, Near Pipeline Primary School',
    timestamp: '25 mins ago',
    triggerType: 'danger_sign_triage',
    riskLevel: 'red',
    symptoms: ['Severe Headache / Blurred Vision', 'Swelling of Face & Hands'],
    summary: 'RED ALERT: Severe headache with blurred vision & facial swelling. Blood pressure reading flagged 162/104 mmHg. High risk of eclamptic convulsion.',
    clinicalProtocolRecommendation: 'Prepare Magnesium Sulfate loading dose (4g IV over 10-15 mins + 10g IM deep in buttocks). Administer oral Nifedipine 10mg if BP > 160/110.',
    familyGuidance: 'Keep room dim and quiet. Do NOT force her to drink water. Prepare to accompany her to Alimosho Comprehensive PHC immediately.',
    supportPersonNotified: true,
    healthWorkerNotified: true,
    status: 'active',
    transportStatus: 'requested',
    transportType: 'tricycle_ambulance',
    responseLogs: [
      {
        timestamp: '24 mins ago',
        actor: 'Telemama Auto-Triage',
        action: 'System Escalation',
        notes: 'SMS & IVR voice call triggered to nominated contact Babatunde Bello and Alimosho PHC on-call midwife.'
      },
      {
        timestamp: '18 mins ago',
        actor: 'Nurse Folake (Alimosho PHC)',
        action: 'Phone Triage',
        notes: 'Called husband. Mother has severe visual spots. Instructed them to prepare for transport.'
      }
    ]
  },
  {
    id: 'ALT-902',
    motherId: 'MOM-002',
    motherName: 'Fatima Danjuma',
    motherPhone: '+234 809 112 3344',
    lga: 'Nasarawa, Kano',
    state: 'Kano',
    locationDetails: 'Dakata Ward, Behind Old Market',
    timestamp: '1 hour ago',
    triggerType: 'sos_button',
    riskLevel: 'red',
    symptoms: ['Baby Not Feeding / Weak', 'Baby Fast Breathing / Chest Sinking'],
    summary: 'RED ALERT: 3-day-old newborn Baby Ibrahim unable to suckle and showing deep intercostal chest indrawing. Potential neonatal pneumonia or severe sepsis.',
    clinicalProtocolRecommendation: 'Immediate newborn stabilization. Ensure airway is clear, warm baby with skin-to-skin Kangaroo Care. Administer weight-based Ampicillin + Gentamicin.',
    familyGuidance: 'Keep baby warm skin-to-skin against mother chest under her wrapper. Do NOT bathe with cold water. Move straight to Nasarawa Maternal Health Clinic.',
    supportPersonNotified: true,
    healthWorkerNotified: true,
    status: 'dispatched',
    transportStatus: 'en_route',
    transportType: 'tricycle_ambulance',
    responseLogs: [
      {
        timestamp: '58 mins ago',
        actor: 'Telemama SOS Button',
        action: 'Emergency Triggered',
        notes: 'Mother pressed big red emergency button on app.'
      },
      {
        timestamp: '45 mins ago',
        actor: 'CHEW Musa Garba',
        action: 'Dispatched Transport',
        notes: 'Community Tricycle Ambulance dispatched from Nasarawa PHC. Driver Kabir en-route.'
      }
    ]
  },
  {
    id: 'ALT-903',
    motherId: 'MOM-006',
    motherName: 'Grace Adeyemi',
    motherPhone: '+234 806 334 1122',
    lga: 'Abeokuta South, Ogun',
    state: 'Ogun',
    locationDetails: 'Ake Palace Area, Abeokuta',
    timestamp: '2 hours ago',
    triggerType: 'danger_sign_triage',
    riskLevel: 'amber',
    symptoms: ['High Fever & Shivering (Mild)'],
    summary: 'AMBER WARNING: Gestational week 32 with fever spikes (37.8°C) and chills. Early febrile illness or malaria in pregnancy.',
    clinicalProtocolRecommendation: 'Schedule same-day clinic consultation for malaria rapid diagnostic test (RDT), urine microscopy, and vital check.',
    familyGuidance: 'Give plenty of clean drinking water. Have mother rest. Come to Ake PHC before noon today.',
    supportPersonNotified: true,
    healthWorkerNotified: true,
    status: 'acknowledged',
    transportStatus: 'not_requested',
    responseLogs: [
      {
        timestamp: '1 hour 45 mins ago',
        actor: 'Midwife Funke',
        action: 'Follow-up Call',
        notes: 'Spoke with mother. Mother will attend morning outpatient ANC clinic today.'
      }
    ]
  }
];

@Injectable({
  providedIn: 'root'
})
export class MaternalStateService {
  // Signals
  readonly mothers = signal<MotherProfile[]>(this.loadInitialMothers());
  readonly alerts = signal<EmergencyAlert[]>(this.loadInitialAlerts());
  readonly checkIns = signal<CheckInRecord[]>(this.loadInitialCheckIns());
  readonly activeUserRole = signal<UserRole>(this.loadInitialRole());
  readonly activeMotherId = signal<string>(this.loadInitialMotherId());

  // Recent simulated SMS/Notification toast
  readonly recentBroadcast = signal<{
    id: string;
    recipient: string;
    title: string;
    message: string;
    type: 'sms' | 'call' | 'dispatch' | 'info';
    timestamp: string;
  } | null>(null);

  // Audio simulation state for low-literacy voice hints
  readonly playingAudioHintId = signal<string | null>(null);

  // Derived state
  readonly currentMother = computed(() => {
    const list = this.mothers();
    const id = this.activeMotherId();
    return list.find(m => m.id === id) || list[0];
  });

  readonly redAlertsCount = computed(() => {
    return this.alerts().filter(a => a.riskLevel === 'red' && a.status !== 'resolved').length;
  });

  readonly amberAlertsCount = computed(() => {
    return this.alerts().filter(a => a.riskLevel === 'amber' && a.status !== 'resolved').length;
  });

  readonly activeAlerts = computed(() => {
    return this.alerts().filter(a => a.status !== 'resolved');
  });

  readonly resolvedAlerts = computed(() => {
    return this.alerts().filter(a => a.status === 'resolved');
  });

  readonly highRiskMothers = computed(() => {
    return this.mothers().filter(m => m.riskLevel === 'red');
  });

  readonly warningMothers = computed(() => {
    return this.mothers().filter(m => m.riskLevel === 'amber');
  });

  readonly safeMothers = computed(() => {
    return this.mothers().filter(m => m.riskLevel === 'green');
  });

  // Current mother alerts
  readonly currentMotherAlerts = computed(() => {
    const currentId = this.currentMother()?.id;
    return this.alerts().filter(a => a.motherId === currentId);
  });

  // Current mother's support person
  readonly currentMotherSupport = computed(() => {
    return this.currentMother()?.nominatedSupportPerson;
  });

  // Methods
  setRole(role: UserRole): void {
    this.activeUserRole.set(role);
    this.saveToStorage(LOCAL_STORAGE_KEY_ROLE, role);
  }

  setActiveMother(motherId: string): void {
    this.activeMotherId.set(motherId);
    this.saveToStorage(LOCAL_STORAGE_KEY_ACTIVE_MOTHER, motherId);
  }

  // Submit daily check-in
  submitDailyCheckIn(
    motherId: string,
    symptomIds: string[],
    vitals?: VitalReadings,
    channel: 'smartphone_app' | 'ussd' | 'sms_callback' | 'chew_home_visit' = 'smartphone_app'
  ): { riskLevel: 'green' | 'amber' | 'red'; triageSummary: string; newAlertId?: string } {
    const evaluation = evaluateDangerSigns(symptomIds, vitals);
    const mother = this.mothers().find(m => m.id === motherId) || this.currentMother();
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' today';

    const newRecord: CheckInRecord = {
      id: 'CHK-' + Date.now().toString().slice(-6),
      motherId: mother.id,
      timestamp,
      symptomsReported: symptomIds,
      vitalReadings: vitals,
      riskLevel: evaluation.riskLevel,
      triageSummary: evaluation.summary,
      status: evaluation.riskLevel === 'green' ? 'safe' : 'alert_sent',
      channel
    };

    // Update check-in history
    this.checkIns.update(prev => [newRecord, ...prev]);
    this.saveToStorage(LOCAL_STORAGE_KEY_CHECKINS, this.checkIns());

    // Update mother risk level & last check-in
    this.mothers.update(list => list.map(m => {
      if (m.id === mother.id) {
        return {
          ...m,
          riskLevel: evaluation.riskLevel,
          lastCheckInDate: 'Just now'
        };
      }
      return m;
    }));
    this.saveToStorage(LOCAL_STORAGE_KEY_MOTHERS, this.mothers());

    let newAlertId: string | undefined = undefined;

    // If red or amber, generate an emergency alert
    if (evaluation.riskLevel === 'red' || evaluation.riskLevel === 'amber') {
      newAlertId = 'ALT-' + Date.now().toString().slice(-4);
      const newAlert: EmergencyAlert = {
        id: newAlertId,
        motherId: mother.id,
        motherName: mother.fullName,
        motherPhone: mother.phoneNumber,
        lga: `${mother.lga}, ${mother.state}`,
        state: mother.state,
        locationDetails: mother.wardOrCommunity,
        timestamp: 'Just now',
        triggerType: 'danger_sign_triage',
        riskLevel: evaluation.riskLevel,
        symptoms: evaluation.criticalSymptoms.concat(evaluation.warningSymptoms).map(s => s.label),
        summary: evaluation.summary,
        clinicalProtocolRecommendation: evaluation.clinicalProtocolRecommendation,
        familyGuidance: evaluation.familyGuidance,
        supportPersonNotified: true,
        healthWorkerNotified: true,
        status: 'active',
        transportStatus: evaluation.riskLevel === 'red' ? 'requested' : 'not_requested',
        transportType: 'tricycle_ambulance',
        responseLogs: [
          {
            timestamp: 'Just now',
            actor: 'Telemama Auto-Triage',
            action: 'Check-in Danger Escalation',
            notes: `Reported symptoms: ${evaluation.criticalSymptoms.concat(evaluation.warningSymptoms).map(s => s.label).join(', ') || 'Abnormal Vitals'}.`
          }
        ]
      };

      this.alerts.update(prev => [newAlert, ...prev]);
      this.saveToStorage(LOCAL_STORAGE_KEY_ALERTS, this.alerts());

      // Show instant simulated broadcast notification
      this.triggerSimulatedBroadcast(
        `SMS to ${mother.nominatedSupportPerson.name} (${mother.nominatedSupportPerson.phone})`,
        `EMERGENCY ALERT: Telemama detected warning signs for ${mother.fullName}. PHC is notified. Check on her now.`,
        'sms'
      );
    } else {
      this.triggerSimulatedBroadcast(
        `SMS Confirmation to ${mother.fullName}`,
        `E SE / MUN GODE: Today's check-in received. You and baby are safe. Keep taking routine iron and clean water.`,
        'info'
      );
    }

    return {
      riskLevel: evaluation.riskLevel,
      triageSummary: evaluation.summary,
      newAlertId
    };
  }

  // Trigger Big Red Emergency Button (SOS)
  triggerEmergencySOS(
    motherId: string,
    locationNote = 'Current location dispatched via GPS / Cell-tower telemetry'
  ): EmergencyAlert {
    const mother = this.mothers().find(m => m.id === motherId) || this.currentMother();
    const alertId = 'ALT-SOS-' + Date.now().toString().slice(-4);

    const newAlert: EmergencyAlert = {
      id: alertId,
      motherId: mother.id,
      motherName: mother.fullName,
      motherPhone: mother.phoneNumber,
      lga: `${mother.lga}, ${mother.state}`,
      state: mother.state,
      locationDetails: `${mother.wardOrCommunity} (${locationNote})`,
      timestamp: 'Just now (EMERGENCY)',
      triggerType: 'sos_button',
      riskLevel: 'red',
      symptoms: ['URGENT SOS CALL - IMMEDIATE ASSISTANCE NEEDED'],
      summary: `CRITICAL SOS: ${mother.fullName} pressed the emergency help button. Immediate maternal/newborn life support dispatch activated.`,
      clinicalProtocolRecommendation: 'Dispatch PHC Emergency Response Team or designated Community Health Worker with maternal emergency kit. Alert General Hospital ambulance.',
      familyGuidance: 'Stay with the mother immediately. Keep her conscious, calm, and upright. Transport is being arranged.',
      supportPersonNotified: true,
      healthWorkerNotified: true,
      status: 'active',
      transportStatus: 'requested',
      transportType: 'tricycle_ambulance',
      responseLogs: [
        {
          timestamp: 'Just now',
          actor: 'Mother SOS Trigger',
          action: 'Panic Button Pressed',
          notes: 'High-priority alert dispatched to Nigeria Primary Healthcare Center and emergency contact list.'
        }
      ]
    };

    // Update alerts
    this.alerts.update(prev => [newAlert, ...prev]);
    this.saveToStorage(LOCAL_STORAGE_KEY_ALERTS, this.alerts());

    // Update mother status to red
    this.mothers.update(list => list.map(m => {
      if (m.id === mother.id) {
        return { ...m, riskLevel: 'red', lastCheckInDate: 'SOS Triggered (Just now)' };
      }
      return m;
    }));
    this.saveToStorage(LOCAL_STORAGE_KEY_MOTHERS, this.mothers());

    // Instant broadcast
    this.triggerSimulatedBroadcast(
      `URGENT FLASH SMS & CALL: ${mother.nominatedSupportPerson.name} (${mother.nominatedSupportPerson.phone})`,
      `CRITICAL: ${mother.fullName} triggered TELEMAMA EMERGENCY SOS at ${mother.wardOrCommunity}. Emergency transport requested. Go to her immediately!`,
      'call'
    );

    return newAlert;
  }

  // Health Worker & Family response actions
  acknowledgeAlert(alertId: string, actor: string, notes: string): void {
    this.alerts.update(list => list.map(a => {
      if (a.id === alertId) {
        return {
          ...a,
          status: 'acknowledged',
          responseLogs: [
            ...a.responseLogs,
            {
              timestamp: 'Just now',
              actor,
              action: 'Alert Acknowledged',
              notes
            }
          ]
        };
      }
      return a;
    }));
    this.saveToStorage(LOCAL_STORAGE_KEY_ALERTS, this.alerts());

    this.triggerSimulatedBroadcast(
      `Status Update to Family`,
      `Health Worker ${actor} acknowledged alert for ${alertId}: "${notes}".`,
      'info'
    );
  }

  dispatchTransport(
    alertId: string,
    transportType: 'tricycle_ambulance' | 'okada_rapid' | 'phc_ambulance' | 'family_vehicle',
    actor: string
  ): void {
    const typeLabel = transportType.replace('_', ' ').toUpperCase();
    this.alerts.update(list => list.map(a => {
      if (a.id === alertId) {
        return {
          ...a,
          status: 'dispatched',
          transportStatus: 'en_route',
          transportType,
          responseLogs: [
            ...a.responseLogs,
            {
              timestamp: 'Just now',
              actor,
              action: `Transport Dispatched (${typeLabel})`,
              notes: `Driver alerted. Estimated arrival in 12-18 minutes at patient ward.`
            }
          ]
        };
      }
      return a;
    }));
    this.saveToStorage(LOCAL_STORAGE_KEY_ALERTS, this.alerts());

    this.triggerSimulatedBroadcast(
      `Transport Dispatched`,
      `Emergency ${typeLabel} dispatched. Driver is en-route to community.`,
      'dispatch'
    );
  }

  resolveAlert(alertId: string, actor: string, resolutionNotes: string): void {
    let resolvedMotherId: string | null = null;
    this.alerts.update(list => list.map(a => {
      if (a.id === alertId) {
        resolvedMotherId = a.motherId;
        return {
          ...a,
          status: 'resolved',
          transportStatus: 'arrived',
          responseLogs: [
            ...a.responseLogs,
            {
              timestamp: 'Just now',
              actor,
              action: 'Alert Case Resolved',
              notes: resolutionNotes
            }
          ]
        };
      }
      return a;
    }));
    this.saveToStorage(LOCAL_STORAGE_KEY_ALERTS, this.alerts());

    if (resolvedMotherId) {
      // Check if mother has remaining active red/amber alerts
      const otherActiveAlerts = this.alerts().filter(
        a => a.motherId === resolvedMotherId && a.id !== alertId && a.status !== 'resolved'
      );
      const newRisk = otherActiveAlerts.length > 0 ? otherActiveAlerts[0].riskLevel : 'green';

      this.mothers.update(list => list.map(m => {
        if (m.id === resolvedMotherId) {
          return { ...m, riskLevel: newRisk };
        }
        return m;
      }));
      this.saveToStorage(LOCAL_STORAGE_KEY_MOTHERS, this.mothers());
    }

    this.triggerSimulatedBroadcast(
      `Alert Closed`,
      `Alert ${alertId} resolved by ${actor}: ${resolutionNotes}`,
      'info'
    );
  }

  // Register a new mother
  registerMother(data: Omit<MotherProfile, 'id' | 'riskLevel' | 'monitoredSince'>): MotherProfile {
    const newId = 'MOM-00' + (this.mothers().length + 1);
    const newMother: MotherProfile = {
      ...data,
      id: newId,
      riskLevel: 'green',
      monitoredSince: new Date().toISOString().split('T')[0],
      lastCheckInDate: 'Enrolled today'
    };

    this.mothers.update(prev => [newMother, ...prev]);
    this.saveToStorage(LOCAL_STORAGE_KEY_MOTHERS, this.mothers());
    this.setActiveMother(newId);

    this.triggerSimulatedBroadcast(
      `Enrolment Complete`,
      `Welcome ${newMother.fullName} to Telemama! Dial *384*26# on any phone or check-in daily.`,
      'sms'
    );

    return newMother;
  }

  // Preset scenarios for live pitch demo
  triggerPresetScenario(scenario: 'preeclampsia' | 'neonatal_sepsis' | 'all_clear' | 'sos'): void {
    if (scenario === 'preeclampsia') {
      const mother = this.mothers().find(m => m.fullName.includes('Amina')) || this.mothers()[0];
      this.setActiveMother(mother.id);
      this.submitDailyCheckIn(
        mother.id,
        ['severe_headache_vision', 'swollen_face_hands'],
        { systolicBp: 165, diastolicBp: 105 }
      );
    } else if (scenario === 'neonatal_sepsis') {
      const mother = this.mothers().find(m => m.isPostpartum) || this.mothers()[1];
      this.setActiveMother(mother.id);
      this.submitDailyCheckIn(
        mother.id,
        ['baby_not_feeding', 'baby_fast_breathing'],
        { temperatureCelsius: 38.6, babyBreathsPerMinute: 68 }
      );
    } else if (scenario === 'sos') {
      const mother = this.currentMother();
      this.triggerEmergencySOS(mother.id, 'Triggered from Quick Demo Presets Bar');
    } else if (scenario === 'all_clear') {
      const mother = this.currentMother();
      this.submitDailyCheckIn(mother.id, []);
    }
  }

  // Reset demo state back to pristine seed
  resetDemoData(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(LOCAL_STORAGE_KEY_MOTHERS);
      window.localStorage.removeItem(LOCAL_STORAGE_KEY_ALERTS);
      window.localStorage.removeItem(LOCAL_STORAGE_KEY_CHECKINS);
    }
    this.mothers.set(INITIAL_MOTHERS);
    this.alerts.set(INITIAL_ALERTS);
    this.checkIns.set([]);
    this.activeMotherId.set(INITIAL_MOTHERS[0].id);

    this.triggerSimulatedBroadcast(
      'Demo Reset',
      'Telemama state restored to default hackathon presentation seed.',
      'info'
    );
  }

  // Audio prompt simulator for low-literacy
  toggleAudioHint(hintId: string): void {
    if (this.playingAudioHintId() === hintId) {
      this.playingAudioHintId.set(null);
    } else {
      this.playingAudioHintId.set(hintId);
      // Auto stop after 5 seconds
      setTimeout(() => {
        if (this.playingAudioHintId() === hintId) {
          this.playingAudioHintId.set(null);
        }
      }, 5000);
    }
  }

  // Helper broadcast
  private triggerSimulatedBroadcast(
    recipient: string,
    message: string,
    type: 'sms' | 'call' | 'dispatch' | 'info'
  ): void {
    const broadcast = {
      id: 'BC-' + Date.now().toString(),
      recipient,
      title: type === 'sms' ? 'SIMULATED SMS' : type === 'call' ? 'SIMULATED CALL' : 'TELEMETRY DISPATCH',
      message,
      type,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };
    this.recentBroadcast.set(broadcast);

    // Auto dismiss after 7 seconds
    setTimeout(() => {
      if (this.recentBroadcast()?.id === broadcast.id) {
        this.recentBroadcast.set(null);
      }
    }, 7000);
  }

  dismissBroadcast(): void {
    this.recentBroadcast.set(null);
  }

  // LocalStorage helpers
  private loadInitialMothers(): MotherProfile[] {
    if (typeof window !== 'undefined' && window.localStorage) {
      const saved = window.localStorage.getItem(LOCAL_STORAGE_KEY_MOTHERS);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.warn('Failed parsing stored mothers', e);
        }
      }
    }
    return INITIAL_MOTHERS;
  }

  private loadInitialAlerts(): EmergencyAlert[] {
    if (typeof window !== 'undefined' && window.localStorage) {
      const saved = window.localStorage.getItem(LOCAL_STORAGE_KEY_ALERTS);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.warn('Failed parsing stored alerts', e);
        }
      }
    }
    return INITIAL_ALERTS;
  }

  private loadInitialCheckIns(): CheckInRecord[] {
    if (typeof window !== 'undefined' && window.localStorage) {
      const saved = window.localStorage.getItem(LOCAL_STORAGE_KEY_CHECKINS);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.warn('Failed parsing stored checkins', e);
        }
      }
    }
    return [];
  }

  private loadInitialRole(): UserRole {
    if (typeof window !== 'undefined' && window.localStorage) {
      const saved = window.localStorage.getItem(LOCAL_STORAGE_KEY_ROLE) as UserRole;
      if (saved) return saved;
    }
    return 'mother';
  }

  private loadInitialMotherId(): string {
    if (typeof window !== 'undefined' && window.localStorage) {
      const saved = window.localStorage.getItem(LOCAL_STORAGE_KEY_ACTIVE_MOTHER);
      if (saved) return saved;
    }
    return INITIAL_MOTHERS[0].id;
  }

  private saveToStorage(key: string, data: unknown): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        window.localStorage.setItem(key, JSON.stringify(data));
      } catch (e) {
        console.warn('Storage write failed', e);
      }
    }
  }
}
