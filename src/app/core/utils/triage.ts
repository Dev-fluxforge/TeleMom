import { DangerSign, RiskLevel, VitalReadings } from '../models/maternal.models';

export const DANGER_SIGNS: DangerSign[] = [
  {
    id: 'vaginal_bleeding',
    code: 'DS_BLEED',
    label: 'Heavy Bleeding',
    description: 'Soaking more than 2 pads an hour or large blood clots',
    pidginDesc: 'Blood dey rush pass 2 pad within one hour',
    category: 'maternal',
    severity: 'critical',
    icon: 'water_drop'
  },
  {
    id: 'severe_headache_vision',
    code: 'DS_HEADACHE_VISION',
    label: 'Severe Headache / Blurred Vision',
    description: 'Throbbing head pain with spots in eyes, epigastric pain',
    pidginDesc: 'Heavy headache with blurred eye or spark like light',
    category: 'maternal',
    severity: 'critical',
    icon: 'visibility_off'
  },
  {
    id: 'high_fever_chills',
    code: 'DS_FEVER',
    label: 'High Fever & Shivering',
    description: 'Body very hot (temperature > 38°C) or severe shivering chills',
    pidginDesc: 'Body dey hot well well with cold dey shake teeth',
    category: 'maternal',
    severity: 'critical',
    icon: 'thermostat'
  },
  {
    id: 'baby_not_feeding',
    code: 'DS_BABY_FEED',
    label: 'Baby Not Feeding / Weak',
    description: 'Baby unable to suckle at breast, abnormally sleepy or floppy',
    pidginDesc: 'Pikin refuse to drink breast or too weak to suck',
    category: 'newborn',
    severity: 'critical',
    icon: 'no_drinks'
  },
  {
    id: 'baby_fast_breathing',
    code: 'DS_BABY_BREATH',
    label: 'Baby Fast Breathing / Chest Sinking',
    description: 'Chest draws in deeply when breathing in, grunting or panting',
    pidginDesc: 'Pikin chest dey enter inside deep when breathing fast',
    category: 'newborn',
    severity: 'critical',
    icon: 'air'
  },
  {
    id: 'foul_discharge',
    code: 'DS_DISCHARGE',
    label: 'Foul-Smelling Discharge',
    description: 'Vaginal flow or umbilical cord with strong bad odor',
    pidginDesc: 'Water or cord smell bad well well',
    category: 'maternal',
    severity: 'warning',
    icon: 'warning_amber'
  },
  {
    id: 'severe_abdominal_pain',
    code: 'DS_ABDO_PAIN',
    label: 'Sharp Severe Stomach Pain',
    description: 'Intense cramping or continuous abdominal rigidity',
    pidginDesc: 'Sharp heavy pain inside belly wey no dey stop',
    category: 'maternal',
    severity: 'critical',
    icon: 'healing'
  },
  {
    id: 'swollen_face_hands',
    code: 'DS_SWELLING',
    label: 'Sudden Swelling of Face & Hands',
    description: 'Puffy eyes, rings tight, rapid sudden weight swelling',
    pidginDesc: 'Face and hands swell up sudden sudden',
    category: 'maternal',
    severity: 'warning',
    icon: 'accessibility_new'
  },
  {
    id: 'baby_yellow_jaundice',
    code: 'DS_JAUNDICE',
    label: 'Baby Yellow Skin or Eyes',
    description: 'Soles of feet or whites of eyes deep yellow',
    pidginDesc: 'Pikin eye or leg yellow like palm oil',
    category: 'newborn',
    severity: 'warning',
    icon: 'face'
  }
];

export interface TriageEvaluation {
  riskLevel: RiskLevel;
  criticalSymptoms: DangerSign[];
  warningSymptoms: DangerSign[];
  summary: string;
  clinicalProtocolRecommendation: string;
  familyGuidance: string;
}

export function evaluateDangerSigns(
  selectedIds: string[],
  vitals?: VitalReadings
): TriageEvaluation {
  const selectedSigns = DANGER_SIGNS.filter(ds => selectedIds.includes(ds.id));
  const critical = selectedSigns.filter(ds => ds.severity === 'critical');
  const warning = selectedSigns.filter(ds => ds.severity === 'warning');

  // Check vitals thresholds
  const highSystolic = vitals?.systolicBp && vitals.systolicBp >= 140;
  const highDiastolic = vitals?.diastolicBp && vitals.diastolicBp >= 90;
  const severeBp = (vitals?.systolicBp && vitals.systolicBp >= 160) || (vitals?.diastolicBp && vitals.diastolicBp >= 110);
  const highTemp = vitals?.temperatureCelsius && vitals.temperatureCelsius >= 38.5;
  const fastBreathingBaby = vitals?.babyBreathsPerMinute && vitals.babyBreathsPerMinute >= 60;

  if (critical.length > 0 || severeBp || fastBreathingBaby) {
    const symptomNames = critical.map(s => s.label).join(', ');
    
    // Clinical protocol tailored to specific signs
    let protocol = 'Immediate PHC emergency admission. Notify on-duty midwife/medical officer.';
    let familyAdvice = 'Go immediately to the nearest Primary Health Center. Do not give herbs or wait.';

    if (selectedIds.includes('vaginal_bleeding')) {
      protocol = 'Suspected Postpartum Hemorrhage (PPH) or antepartum bleeding. Prep IV cannula 16G, normal saline, Oxytocin 10 IU IM or Misoprostol 800mcg sublingually. Prepare emergency blood cross-match.';
      familyAdvice = 'Lie mother flat with feet slightly elevated. Keep her warm with a wrapper. Get transport to facility right now.';
    } else if (selectedIds.includes('severe_headache_vision') || severeBp) {
      protocol = 'Suspected Severe Pre-Eclampsia / Impending Eclampsia. Prepare Magnesium Sulfate (MgSO4) loading dose (4g IV + 10g IM Pritchard regimen). Check urine protein.';
      familyAdvice = 'Keep the room quiet and dim. Do not shout or give cold water. Prepare to move mother to the hospital immediately.';
    } else if (selectedIds.includes('baby_not_feeding') || selectedIds.includes('baby_fast_breathing') || fastBreathingBaby) {
      protocol = 'Suspected Neonatal Sepsis / Severe Respiratory Distress. Initiate skin-to-skin Kangaroo Mother Care, check airway, prep Amoxicillin/Gentamicin loading dose according to weight.';
      familyAdvice = 'Keep baby strapped warm skin-to-skin against mother chest. Do not bathe the baby with cold water. Go to the clinic now.';
    } else if (selectedIds.includes('high_fever_chills') || highTemp) {
      protocol = 'Suspected Maternal Puerperal Sepsis or severe malaria in pregnancy. Obtain malaria RDT, blood film, and blood culture. Administer broad-spectrum antibiotics and Artesunate if positive.';
      familyAdvice = 'Do not wrap mother in too many thick blankets if fever is very high. Give clean water in sips and head to the PHC.';
    }

    return {
      riskLevel: 'red',
      criticalSymptoms: critical,
      warningSymptoms: warning,
      summary: `RED ALERT: Critical danger sign detected (${symptomNames || 'Abnormal vitals'}). Immediate clinical triage required.`,
      clinicalProtocolRecommendation: protocol,
      familyGuidance: familyAdvice
    };
  }

  if (warning.length > 0 || highSystolic || highDiastolic || (vitals?.temperatureCelsius && vitals.temperatureCelsius >= 37.5)) {
    const warningNames = warning.map(s => s.label).join(', ');
    return {
      riskLevel: 'amber',
      criticalSymptoms: [],
      warningSymptoms: warning,
      summary: `AMBER WARNING: Potential early complications detected (${warningNames || 'Elevated vitals'}). Closer observation required within 4-6 hours.`,
      clinicalProtocolRecommendation: 'CHEW or Midwife outreach call. Re-evaluate blood pressure, temperature, and neonatal alertness. Advise clinic visit if symptoms persist.',
      familyGuidance: 'Keep close watch over mother and newborn. Check if baby is breastfeeding well. If symptom worsens or new signs appear, visit the clinic today.'
    };
  }

  return {
    riskLevel: 'green',
    criticalSymptoms: [],
    warningSymptoms: [],
    summary: 'ALL CLEAR: No active danger signs reported. Mother and baby are within normal safe parameters.',
    clinicalProtocolRecommendation: 'Continue standard routine monitoring and scheduled antenatal/postnatal clinic visits.',
    familyGuidance: 'Everything looks safe and normal today. Continue nutritious food, iron supplements, clean water, and exclusive breastfeeding.'
  };
}
