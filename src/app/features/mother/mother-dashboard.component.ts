import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UpperCasePipe } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MaternalStateService } from '../../core/services/maternal-state.service';
import { DANGER_SIGNS } from '../../core/utils/triage';

@Component({
  selector: 'app-mother-dashboard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, UpperCasePipe, ReactiveFormsModule, MatIconModule],
  template: `
    <div class="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      <!-- Top Profile Switcher & Info Bar -->
      <div class="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-xl bg-orange-100 text-[#C2410C] flex items-center justify-center font-bold text-lg shrink-0">
            <mat-icon class="!text-[28px] !w-[28px] !h-[28px]">face_3</mat-icon>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h1 class="text-xl font-bold text-stone-900">{{ currentMother().fullName }}</h1>
              <!-- Risk Indicator Badge -->
              @if (currentMother().riskLevel === 'red') {
                <span class="text-[11px] font-bold px-2 py-0.5 rounded-md bg-red-100 text-red-800 border border-red-200 flex items-center gap-1">
                  <mat-icon class="!text-[12px] !w-[12px] !h-[12px]">warning</mat-icon>
                  High Alert
                </span>
              } @else if (currentMother().riskLevel === 'amber') {
                <span class="text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
                  <mat-icon class="!text-[12px] !w-[12px] !h-[12px]">info</mat-icon>
                  Watch Closely
                </span>
              } @else {
                <span class="text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                  <mat-icon class="!text-[12px] !w-[12px] !h-[12px]">check_circle</mat-icon>
                  Safe & Monitored
                </span>
              }
            </div>
            
            <div class="flex flex-wrap items-center gap-2 text-xs text-stone-600 mt-1">
              <span>{{ currentMother().lga }}, {{ currentMother().state }}</span>
              <span aria-hidden="true">·</span>
              @if (currentMother().isPostpartum) {
                <span class="font-medium text-stone-900">Postpartum Day {{ currentMother().postpartumDays }} ({{ currentMother().babyName || 'Baby' }})</span>
              } @else {
                <span class="font-medium text-stone-900">Pregnant: Week {{ currentMother().gestationalWeeks }}</span>
              }
              <span aria-hidden="true">·</span>
              <span>PHC: {{ currentMother().primaryHealthCenter }}</span>
            </div>
          </div>
        </div>

        <!-- Quick Switch Mother Profile (For live testing) -->
        <div class="w-full sm:w-auto flex items-center gap-2">
          <label for="mother-select" class="text-xs text-stone-600 font-medium whitespace-nowrap">Switch Mother:</label>
          <select
            id="mother-select"
            [value]="currentMother().id"
            (change)="onMotherChange($event)"
            class="touch-target text-xs bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#C2410C]"
          >
            @for (mom of state.mothers(); track mom.id) {
              <option [value]="mom.id">
                {{ mom.fullName }} ({{ mom.isPostpartum ? 'Postpartum' : mom.gestationalWeeks + 'wks' }} - {{ mom.riskLevel | uppercase }})
              </option>
            }
          </select>
        </div>
      </div>

      <!-- "You Are Being Watched Over" Status Card -->
      <div 
        class="rounded-2xl p-5 border transition-all"
        [class.bg-emerald-50]="currentMother().riskLevel === 'green'"
        [class.border-emerald-200]="currentMother().riskLevel === 'green'"
        [class.bg-amber-50]="currentMother().riskLevel === 'amber'"
        [class.border-amber-200]="currentMother().riskLevel === 'amber'"
        [class.bg-red-50]="currentMother().riskLevel === 'red'"
        [class.border-red-300]="currentMother().riskLevel === 'red'"
      >
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div class="flex items-start gap-3">
            <div 
              class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
              [class.bg-emerald-200]="currentMother().riskLevel === 'green'"
              [class.text-emerald-900]="currentMother().riskLevel === 'green'"
              [class.bg-amber-200]="currentMother().riskLevel === 'amber'"
              [class.text-amber-900]="currentMother().riskLevel === 'amber'"
              [class.bg-red-200]="currentMother().riskLevel === 'red'"
              [class.text-red-900]="currentMother().riskLevel === 'red'"
            >
              @if (currentMother().riskLevel === 'red') {
                <mat-icon class="!text-[24px] !w-[24px] !h-[24px]">crisis_alert</mat-icon>
              } @else if (currentMother().riskLevel === 'amber') {
                <mat-icon class="!text-[24px] !w-[24px] !h-[24px]">visibility</mat-icon>
              } @else {
                <mat-icon class="!text-[24px] !w-[24px] !h-[24px]">shield</mat-icon>
              }
            </div>

            <div class="space-y-1">
              <h2 class="text-base sm:text-lg font-bold text-stone-900">
                @if (currentMother().riskLevel === 'red') {
                  Urgent Attention Active: Health Facility is Alerted
                } @else if (currentMother().riskLevel === 'amber') {
                  Care Watch Active: Warning Signs Under Review
                } @else {
                  You are safe and being watched over.
                }
              </h2>
              <p class="text-xs sm:text-sm text-stone-700 leading-relaxed">
                @if (currentMother().riskLevel === 'red') {
                  Your primary health center ({{ currentMother().primaryHealthCenter }}) and your family contact ({{ currentMother().nominatedSupportPerson.name }}) have received high-priority alerts. Emergency transport is coordinated.
                } @else if (currentMother().riskLevel === 'amber') {
                  Your reported symptoms require follow-up. Please rest, drink clean water, and expect a check-in call from your community midwife.
                } @else {
                  Your daily check-in is up to date. Next routine check-in is scheduled for tomorrow at 8:00 AM. In case of sudden danger, press the Emergency button below.
                }
              </p>
              <div class="text-xs text-stone-600 font-medium pt-1 flex items-center gap-2">
                <span>Last Check-in: {{ currentMother().lastCheckInDate || 'Not yet recorded' }}</span>
                <span>·</span>
                <span>Support: {{ currentMother().nominatedSupportPerson.name }} ({{ currentMother().nominatedSupportPerson.relationship }})</span>
              </div>
            </div>
          </div>

          @if (currentMother().riskLevel === 'red') {
            <a
              routerLink="/family"
              class="touch-target px-4 py-2.5 bg-red-700 hover:bg-red-800 text-white rounded-xl text-xs font-bold whitespace-nowrap shadow-sm shrink-0 flex items-center gap-1.5"
            >
              <mat-icon class="!text-[16px] !w-[16px] !h-[16px]">support_agent</mat-icon>
              <span>View Family Response</span>
            </a>
          }
        </div>
      </div>

      <!-- THE BIG EMERGENCY SOS BUTTON (Life-saving high-contrast CTA) -->
      <div class="bg-gradient-to-br from-red-600 to-[#C2410C] rounded-2xl p-6 text-white shadow-xl border-4 border-red-700 text-center space-y-4">
        <div class="space-y-1">
          <div class="inline-flex items-center gap-1.5 text-xs font-bold bg-white/20 px-3 py-1 rounded-full uppercase tracking-wider">
            <mat-icon class="!text-[16px] !w-[16px] !h-[16px]">emergency</mat-icon>
            Emergency Life Support Trigger
          </div>
          <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight">
            I NEED HELP NOW
          </h2>
          <p class="text-xs sm:text-sm text-red-100 max-w-lg mx-auto">
            Press this big button if you or your baby feel sudden danger, severe bleeding, or convulsions.
          </p>
        </div>

        <div class="flex justify-center pt-2">
          @if (isTriggeringSos()) {
            <div class="space-y-3">
              <div class="text-base font-bold text-amber-200 animate-pulse">
                SENDING EMERGENCY TELEMETRY... ({{ sosCountdown() }}s)
              </div>
              <div class="flex items-center justify-center gap-3">
                <button
                  type="button"
                  (click)="cancelSos()"
                  class="touch-target px-6 py-3 bg-stone-900 text-white rounded-xl font-bold text-xs hover:bg-black transition-colors"
                >
                  Cancel (False Alarm)
                </button>
                <button
                  type="button"
                  (click)="confirmImmediateSos()"
                  class="touch-target px-6 py-3 bg-white text-red-700 rounded-xl font-extrabold text-xs shadow-lg hover:bg-red-50 transition-colors"
                >
                  Send Now Immediately
                </button>
              </div>
            </div>
          } @else {
            <button
              type="button"
              (click)="startSosCountdown()"
              class="touch-target w-full sm:w-auto px-10 py-5 bg-white text-red-700 hover:bg-red-50 active:scale-[0.98] rounded-2xl font-black text-lg sm:text-xl shadow-2xl transition-all flex items-center justify-center gap-3 mx-auto border-2 border-red-200"
              aria-label="Trigger Emergency Help Alert Now"
            >
              <mat-icon class="!text-[32px] !w-[32px] !h-[32px] text-red-600">crisis_alert</mat-icon>
              <span>SEND SOS ALERT NOW</span>
            </button>
          }
        </div>

        <div class="text-[11px] text-red-200 font-medium">
          Automatically alerts: {{ currentMother().nominatedSupportPerson.name }} ({{ currentMother().nominatedSupportPerson.phone }}) & {{ currentMother().primaryHealthCenter }}
        </div>
      </div>

      <!-- Daily Danger-Signs Check-In Section -->
      <div class="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-6">
        
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
          <div>
            <div class="flex items-center gap-2 text-xs font-semibold text-[#C2410C]">
              <span>TODAY'S HEALTH CHECK-IN</span>
              <span>·</span>
              <span>EASY PICTURE CHECKLIST</span>
            </div>
            <h2 class="text-xl font-bold text-stone-900 mt-0.5">
              How are you and your baby feeling today?
            </h2>
            <p class="text-xs text-stone-600">
              Tap any symptom you are experiencing. If you feel fine, leave them unselected and press Confirm.
            </p>
          </div>

          <!-- Language toggle for Pidgin audio hints -->
          <div class="flex items-center gap-2">
            <button
              type="button"
              (click)="showPidgin.set(!showPidgin())"
              class="touch-target text-xs font-semibold px-3 py-1.5 rounded-xl border border-stone-300 hover:border-[#C2410C] text-stone-700 transition-colors flex items-center gap-1.5"
            >
              <mat-icon class="!text-[16px] !w-[16px] !h-[16px] text-[#C2410C]">translate</mat-icon>
              <span>{{ showPidgin() ? 'Show Standard English' : 'Show Simple Pidgin Hints' }}</span>
            </button>
          </div>
        </div>

        <!-- Danger Signs Grid (Large accessible touch targets with visual icons) -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          @for (sign of dangerSigns; track sign.id) {
            <div
              role="button"
              tabindex="0"
              (click)="toggleSymptom(sign.id)"
              (keydown.enter)="toggleSymptom(sign.id)"
              (keydown.space)="toggleSymptom(sign.id)"
              [attr.aria-label]="sign.label"
              [class.border-red-500]="isSelected(sign.id) && sign.severity === 'critical'"
              [class.bg-red-50]="isSelected(sign.id) && sign.severity === 'critical'"
              [class.border-amber-500]="isSelected(sign.id) && sign.severity === 'warning'"
              [class.bg-amber-50]="isSelected(sign.id) && sign.severity === 'warning'"
              [class.border-stone-200]="!isSelected(sign.id)"
              [class.bg-stone-50]="!isSelected(sign.id)"
              class="touch-target p-4 rounded-xl border-2 text-left transition-all hover:border-[#C2410C] flex items-start gap-3 relative group cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#C2410C]"
            >
              <!-- Icon Container -->
              <div 
                class="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                [class.bg-red-200]="isSelected(sign.id) && sign.severity === 'critical'"
                [class.text-red-900]="isSelected(sign.id) && sign.severity === 'critical'"
                [class.bg-amber-200]="isSelected(sign.id) && sign.severity === 'warning'"
                [class.text-amber-900]="isSelected(sign.id) && sign.severity === 'warning'"
                [class.bg-stone-200]="!isSelected(sign.id)"
                [class.text-stone-700]="!isSelected(sign.id)"
              >
                <mat-icon class="!text-[22px] !w-[22px] !h-[22px]">{{ sign.icon }}</mat-icon>
              </div>

              <!-- Text Details -->
              <div class="space-y-1 flex-1 pr-6">
                <div class="flex items-center gap-1.5">
                  <span class="text-xs font-bold text-stone-900 group-hover:text-[#C2410C] transition-colors">
                    {{ sign.label }}
                  </span>
                  @if (sign.category === 'newborn') {
                    <span class="text-[10px] font-semibold bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded">Baby</span>
                  }
                </div>

                <p class="text-[11px] text-stone-600 leading-snug">
                  {{ showPidgin() ? sign.pidginDesc : sign.description }}
                </p>

                <!-- Voice Note Simulation Audio Trigger -->
                <div class="pt-1">
                  <button
                    type="button"
                    (click)="$event.stopPropagation(); state.toggleAudioHint(sign.id)"
                    class="inline-flex items-center gap-1 text-[11px] font-semibold text-[#C2410C] hover:underline"
                    [attr.aria-label]="'Listen to audio for ' + sign.label"
                  >
                    <mat-icon class="!text-[14px] !w-[14px] !h-[14px]">
                      {{ state.playingAudioHintId() === sign.id ? 'volume_up' : 'play_circle' }}
                    </mat-icon>
                    <span>{{ state.playingAudioHintId() === sign.id ? 'Playing Voice Note...' : 'Listen in Audio' }}</span>
                  </button>
                </div>
              </div>

              <!-- Selection Checkbox Affordance -->
              <div class="absolute top-3.5 right-3.5">
                <div 
                  class="w-5 h-5 rounded-md border flex items-center justify-center"
                  [class.bg-red-600]="isSelected(sign.id) && sign.severity === 'critical'"
                  [class.border-red-600]="isSelected(sign.id) && sign.severity === 'critical'"
                  [class.bg-amber-600]="isSelected(sign.id) && sign.severity === 'warning'"
                  [class.border-amber-600]="isSelected(sign.id) && sign.severity === 'warning'"
                  [class.border-stone-300]="!isSelected(sign.id)"
                  [class.bg-white]="!isSelected(sign.id)"
                >
                  @if (isSelected(sign.id)) {
                    <mat-icon class="!text-[14px] !w-[14px] !h-[14px] text-white">check</mat-icon>
                  }
                </div>
              </div>
            </div>
          }
        </div>

        <!-- Optional Vitals Input Accordion -->
        <div class="bg-stone-50 rounded-xl p-4 border border-stone-200 space-y-3">
          <button
            type="button"
            (click)="showVitals.set(!showVitals())"
            class="touch-target w-full flex items-center justify-between text-xs font-bold text-stone-800"
          >
            <span class="flex items-center gap-2">
              <mat-icon class="!text-[18px] !w-[18px] !h-[18px] text-[#C2410C]">monitor_heart</mat-icon>
              <span>Optional: Enter Today's Vitals (BP / Temperature / Baby Breaths)</span>
            </span>
            <mat-icon class="!text-[18px] !w-[18px] !h-[18px]">
              {{ showVitals() ? 'expand_less' : 'expand_more' }}
            </mat-icon>
          </button>

          @if (showVitals()) {
            <form [formGroup]="vitalsForm" class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div>
                <label for="systolic" class="block text-[11px] font-semibold text-stone-700">Systolic BP (top number)</label>
                <input
                  id="systolic"
                  type="number"
                  formControlName="systolic"
                  placeholder="e.g. 120"
                  class="touch-target mt-1 w-full text-xs p-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#C2410C]"
                />
              </div>

              <div>
                <label for="diastolic" class="block text-[11px] font-semibold text-stone-700">Diastolic BP (bottom number)</label>
                <input
                  id="diastolic"
                  type="number"
                  formControlName="diastolic"
                  placeholder="e.g. 80"
                  class="touch-target mt-1 w-full text-xs p-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#C2410C]"
                />
              </div>

              <div>
                <label for="temperature" class="block text-[11px] font-semibold text-stone-700">Temperature (°C)</label>
                <input
                  id="temperature"
                  type="number"
                  step="0.1"
                  formControlName="temperature"
                  placeholder="e.g. 36.8"
                  class="touch-target mt-1 w-full text-xs p-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#C2410C]"
                />
              </div>
            </form>
          }
        </div>

        <!-- Action Confirmation Strip -->
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-stone-100">
          <div class="text-xs text-stone-600">
            @if (selectedSymptomIds().length === 0) {
              <span class="text-emerald-700 font-semibold flex items-center gap-1">
                <mat-icon class="!text-[16px] !w-[16px] !h-[16px]">sentiment_satisfied</mat-icon>
                No danger signs selected. Ready to report all clear.
              </span>
            } @else {
              <span class="text-red-700 font-bold flex items-center gap-1">
                <mat-icon class="!text-[16px] !w-[16px] !h-[16px]">warning</mat-icon>
                {{ selectedSymptomIds().length }} danger sign(s) selected for clinical triage.
              </span>
            }
          </div>

          <div class="flex items-center gap-3 w-full sm:w-auto">
            @if (selectedSymptomIds().length > 0) {
              <button
                type="button"
                (click)="selectedSymptomIds.set([])"
                class="touch-target px-4 py-2.5 text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors"
              >
                Clear Selections
              </button>
            }

            <button
              type="button"
              (click)="submitCheckIn()"
              class="touch-target w-full sm:w-auto px-6 py-3 bg-[#C2410C] hover:bg-[#9A3412] active:scale-[0.98] text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              <mat-icon class="!text-[18px] !w-[18px] !h-[18px]">send</mat-icon>
              <span>Submit Check-in Confirmation</span>
            </button>
          </div>
        </div>

      </div>

      <!-- Quick Audio Health Tips & Knowledge Hub -->
      <div class="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-base font-bold text-stone-900 flex items-center gap-2">
            <mat-icon class="text-[#C2410C]">hearing</mat-icon>
            <span>Maternal & Newborn Audio Advice (English / Pidgin)</span>
          </h2>
          <span class="text-xs text-stone-600">Low-literacy guidance</span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div class="p-3.5 rounded-xl border border-stone-200 bg-stone-50 space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-stone-900">How to Count Baby's Breathing</span>
              <button
                type="button"
                (click)="state.toggleAudioHint('audio_baby_breath')"
                class="text-xs font-semibold text-[#C2410C] flex items-center gap-1 hover:underline"
              >
                <mat-icon class="!text-[16px] !w-[16px] !h-[16px]">
                  {{ state.playingAudioHintId() === 'audio_baby_breath' ? 'pause_circle' : 'play_circle' }}
                </mat-icon>
                <span>{{ state.playingAudioHintId() === 'audio_baby_breath' ? 'Listening...' : 'Play Tip (45s)' }}</span>
              </button>
            </div>
            <p class="text-[11px] text-stone-600">
              When baby is calm, watch chest for 60 seconds. More than 60 breaths per minute or chest pulling inside deep means baby needs help.
            </p>
          </div>

          <div class="p-3.5 rounded-xl border border-stone-200 bg-stone-50 space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-stone-900">Recognizing High Blood Pressure</span>
              <button
                type="button"
                (click)="state.toggleAudioHint('audio_bp_preeclampsia')"
                class="text-xs font-semibold text-[#C2410C] flex items-center gap-1 hover:underline"
              >
                <mat-icon class="!text-[16px] !w-[16px] !h-[16px]">
                  {{ state.playingAudioHintId() === 'audio_bp_preeclampsia' ? 'pause_circle' : 'play_circle' }}
                </mat-icon>
                <span>{{ state.playingAudioHintId() === 'audio_bp_preeclampsia' ? 'Listening...' : 'Play Tip (50s)' }}</span>
              </button>
            </div>
            <p class="text-[11px] text-stone-600">
              Severe headache wey no go away with paracetamol, eye dey see flashes, and belly top dey pain you. Do not wait!
            </p>
          </div>
        </div>
      </div>

    </div>
  `
})
export class MotherDashboard {
  readonly state = inject(MaternalStateService);
  readonly dangerSigns = DANGER_SIGNS;

  readonly currentMother = this.state.currentMother;
  readonly selectedSymptomIds = signal<string[]>([]);
  readonly showPidgin = signal(false);
  readonly showVitals = signal(false);

  readonly isTriggeringSos = signal(false);
  readonly sosCountdown = signal(3);
  private sosTimer: ReturnType<typeof setInterval> | null = null;

  readonly vitalsForm = new FormGroup({
    systolic: new FormControl<number | null>(null),
    diastolic: new FormControl<number | null>(null),
    temperature: new FormControl<number | null>(null)
  });

  isSelected(id: string): boolean {
    return this.selectedSymptomIds().includes(id);
  }

  toggleSymptom(id: string): void {
    const current = this.selectedSymptomIds();
    if (current.includes(id)) {
      this.selectedSymptomIds.set(current.filter(item => item !== id));
    } else {
      this.selectedSymptomIds.set([...current, id]);
    }
  }

  onMotherChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.state.setActiveMother(select.value);
    this.selectedSymptomIds.set([]);
  }

  submitCheckIn(): void {
    const rawVitals = this.vitalsForm.value;
    const vitals = {
      systolicBp: rawVitals.systolic || undefined,
      diastolicBp: rawVitals.diastolic || undefined,
      temperatureCelsius: rawVitals.temperature || undefined
    };

    this.state.submitDailyCheckIn(
      this.currentMother().id,
      this.selectedSymptomIds(),
      vitals,
      'smartphone_app'
    );

    // Reset selection state
    this.selectedSymptomIds.set([]);
    this.vitalsForm.reset();
    this.showVitals.set(false);
  }

  startSosCountdown(): void {
    this.isTriggeringSos.set(true);
    this.sosCountdown.set(3);
    
    this.sosTimer = setInterval(() => {
      const current = this.sosCountdown();
      if (current <= 1) {
        if (this.sosTimer) {
          clearInterval(this.sosTimer);
          this.sosTimer = null;
        }
        this.confirmImmediateSos();
      } else {
        this.sosCountdown.set(current - 1);
      }
    }, 1000);
  }

  cancelSos(): void {
    if (this.sosTimer) clearInterval(this.sosTimer);
    this.isTriggeringSos.set(false);
    this.sosCountdown.set(3);
  }

  confirmImmediateSos(): void {
    if (this.sosTimer) clearInterval(this.sosTimer);
    this.isTriggeringSos.set(false);
    this.state.triggerEmergencySOS(this.currentMother().id, 'Mother Panic Button (App Dashboard)');
  }
}
