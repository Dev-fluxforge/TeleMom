import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { UpperCasePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MaternalStateService } from '../../core/services/maternal-state.service';

type UssdStep = 
  | 'idle'
  | 'dialing'
  | 'main_menu'
  | 'checkin_q1_headache'
  | 'checkin_q2_bleeding'
  | 'checkin_q3_baby'
  | 'checkin_complete_safe'
  | 'checkin_complete_danger'
  | 'emergency_confirm'
  | 'emergency_sent'
  | 'status_view'
  | 'enrol_name'
  | 'enrol_lga'
  | 'enrol_done'
  | 'callback_sent';

@Component({
  selector: 'app-ussd-simulator',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UpperCasePipe, MatIconModule],
  template: `
    <div class="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      <!-- Header -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2 text-xs font-semibold text-[#C2410C]">
            <span>FEATURE PHONE SIMULATOR</span>
            <span>·</span>
            <span>ZERO DATA / NO SMARTPHONE REQUIRED</span>
          </div>
          <h1 class="text-2xl font-extrabold text-stone-900 mt-1">Interactive USSD Prototype (*384*26#)</h1>
          <p class="text-xs text-stone-600">
            See how Telemama serves millions of Nigerian mothers using basic $10 phones (Nokia, itel, Tecno) over GSM networks.
          </p>
        </div>

        <button
          type="button"
          (click)="dialCode('*384*26#')"
          class="touch-target px-4 py-2 bg-stone-900 hover:bg-black text-amber-400 font-mono font-bold text-xs rounded-xl flex items-center gap-2 transition-all shadow-sm"
        >
          <mat-icon class="!text-[16px] !w-[16px] !h-[16px]">call</mat-icon>
          <span>Auto-Dial *384*26#</span>
        </button>
      </div>

      <!-- Main Layout: Phone Chassis on Left, Judge Guide & Menu Tree on Right -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <!-- FEATURE PHONE CHASSIS (Cols 1-5) -->
        <div class="lg:col-span-5 flex justify-center">
          <div class="w-[310px] sm:w-[330px] bg-stone-900 rounded-[44px] p-5 shadow-2xl border-4 border-stone-800 space-y-4 relative select-none">
            
            <!-- Ear Speaker Grill -->
            <div class="w-16 h-2 bg-stone-800 rounded-full mx-auto"></div>

            <!-- Phone Brand Mark -->
            <div class="text-center">
              <span class="text-[10px] font-bold tracking-widest text-stone-500 uppercase font-mono">
                TELEMAMA GSM · NIGERIA
              </span>
            </div>

            <!-- VINTAGE RETRO LCD DISPLAY (Green Monochrome Backlit Matrix) -->
            <div class="bg-[#8CA374] rounded-2xl p-3.5 border-4 border-stone-800 shadow-inner font-ussd text-stone-950 flex flex-col justify-between h-[230px] relative overflow-hidden">
              
              <!-- LCD Top Status Bar (Signal bars, Battery, Telco) -->
              <div class="flex items-center justify-between text-[10px] border-b border-stone-900/30 pb-1 font-bold">
                <span class="flex items-center gap-1">
                  <span>📶 MTN-NG</span>
                </span>
                <span>🔋 94%</span>
              </div>

              <!-- LCD Content Area -->
              <div class="py-2 text-xs leading-relaxed font-bold tracking-tight overflow-y-auto flex-1">
                @switch (currentStep()) {
                  @case ('idle') {
                    <div class="space-y-2 pt-4 text-center">
                      <p class="text-sm font-black">MTN NIGERIA</p>
                      <p class="text-[11px] text-stone-800 font-normal">Ready to dial</p>
                      <div class="text-base font-black pt-2 bg-black/10 py-1 rounded">
                        {{ dialedNumber() || 'Dial *384*26#' }}
                      </div>
                    </div>
                  }
                  @case ('dialing') {
                    <div class="space-y-3 pt-6 text-center">
                      <div class="animate-pulse">USSD code running...</div>
                      <div class="text-xs">Connecting to Telemama gateway...</div>
                    </div>
                  }
                  @case ('main_menu') {
                    <div class="space-y-1">
                      <div class="font-black border-b border-stone-900/40 pb-0.5">TELEMAMA NIGERIA</div>
                      <div class="text-[11px]">1. Daily Check-in</div>
                      <div class="text-[11px]">2. Emergency SOS (Help)</div>
                      <div class="text-[11px]">3. My Care & Clinic Date</div>
                      <div class="text-[11px]">4. Enrol New Mother</div>
                      <div class="text-[11px]">5. Request Nurse Call</div>
                      <div class="text-[11px]">0. Exit</div>
                    </div>
                  }
                  @case ('checkin_q1_headache') {
                    <div class="space-y-1">
                      <div class="font-black text-[11px]">DAILY CHECK (1/3)</div>
                      <div class="text-[11px]">Severe headache or blurred eye vision today?</div>
                      <div class="text-[11px] pt-1">1. Yes</div>
                      <div class="text-[11px]">2. No</div>
                    </div>
                  }
                  @case ('checkin_q2_bleeding') {
                    <div class="space-y-1">
                      <div class="font-black text-[11px]">DAILY CHECK (2/3)</div>
                      <div class="text-[11px]">Heavy bleeding or sharp stomach pain?</div>
                      <div class="text-[11px] pt-1">1. Yes</div>
                      <div class="text-[11px]">2. No</div>
                    </div>
                  }
                  @case ('checkin_q3_baby') {
                    <div class="space-y-1">
                      <div class="font-black text-[11px]">DAILY CHECK (3/3)</div>
                      <div class="text-[11px]">Baby refusing breast or chest breathing fast?</div>
                      <div class="text-[11px] pt-1">1. Yes</div>
                      <div class="text-[11px]">2. No</div>
                    </div>
                  }
                  @case ('checkin_complete_safe') {
                    <div class="space-y-1 pt-1">
                      <div class="font-black">MUN GODE / ALL CLEAR</div>
                      <div class="text-[11px]">Your check-in is SAFE. Continue taking iron and clean water. Next check: tomorrow.</div>
                      <div class="text-[10px] pt-1">Press 0 to exit.</div>
                    </div>
                  }
                  @case ('checkin_complete_danger') {
                    <div class="space-y-1 pt-1">
                      <div class="font-black text-red-950">!! WARNING DETECTED !!</div>
                      <div class="text-[11px]">Danger sign flagged! SMS alert sent to family & PHC midwife. Stay calm, visit clinic.</div>
                      <div class="text-[10px] pt-1">Press 0 to exit.</div>
                    </div>
                  }
                  @case ('emergency_confirm') {
                    <div class="space-y-1 pt-1">
                      <div class="font-black">!! EMERGENCY SOS !!</div>
                      <div class="text-[11px]">Send immediate ambulance & alert family?</div>
                      <div class="text-[11px] pt-1">1. YES - SEND HELP</div>
                      <div class="text-[11px]">2. Cancel</div>
                    </div>
                  }
                  @case ('emergency_sent') {
                    <div class="space-y-1 pt-1">
                      <div class="font-black">HELP IS COMING</div>
                      <div class="text-[11px]">CRITICAL ALERT SENT to {{ state.currentMother().primaryHealthCenter }} & {{ state.currentMother().nominatedSupportPerson.name }}. Keep calm!</div>
                      <div class="text-[10px] pt-1">Press 0 to exit.</div>
                    </div>
                  }
                  @case ('status_view') {
                    <div class="space-y-1 text-[11px]">
                      <div class="font-black">{{ state.currentMother().fullName }}</div>
                      <div>Status: {{ state.currentMother().riskLevel | uppercase }}</div>
                      <div>{{ state.currentMother().isPostpartum ? 'Postpartum Day ' + state.currentMother().postpartumDays : 'Pregnancy Week ' + state.currentMother().gestationalWeeks }}</div>
                      <div>Clinic: {{ state.currentMother().primaryHealthCenter }}</div>
                      <div class="text-[10px] pt-1">Press 0 to return.</div>
                    </div>
                  }
                  @case ('callback_sent') {
                    <div class="space-y-1 pt-2">
                      <div class="font-black">REQUEST RECEIVED</div>
                      <div class="text-[11px]">An on-duty midwife from {{ state.currentMother().primaryHealthCenter }} will call you back within 15 minutes.</div>
                      <div class="text-[10px] pt-1">Press 0 to exit.</div>
                    </div>
                  }
                }
              </div>

              <!-- LCD Bottom Input Field & Soft Key Labels -->
              <div class="border-t border-stone-900/30 pt-1 flex items-center justify-between text-[11px] font-bold">
                <span>Input: [ {{ currentInput() }}<span class="animate-pulse">_</span> ]</span>
                <span class="text-[10px] uppercase font-mono">Send/OK</span>
              </div>
            </div>

            <!-- Soft Navigation Keys (Left / Right / D-Pad) -->
            <div class="grid grid-cols-3 gap-2 px-2">
              <button
                type="button"
                (click)="handleSoftLeft()"
                class="touch-target py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-bold shadow-md transition-colors text-center"
              >
                SELECT
              </button>

              <div class="flex items-center justify-center">
                <button
                  type="button"
                  (click)="handleSoftLeft()"
                  class="w-10 h-10 rounded-full bg-stone-700 hover:bg-stone-600 text-stone-200 flex items-center justify-center shadow-md active:scale-95 transition-transform"
                >
                  <mat-icon class="!text-[20px] !w-[20px] !h-[20px]">check</mat-icon>
                </button>
              </div>

              <button
                type="button"
                (click)="handleSoftRight()"
                class="touch-target py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-bold shadow-md transition-colors text-center"
              >
                BACK
              </button>
            </div>

            <!-- Green Call & Red End Keys -->
            <div class="grid grid-cols-2 gap-3 px-2">
              <button
                type="button"
                (click)="handleCallKey()"
                class="touch-target py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all"
              >
                <mat-icon class="!text-[18px] !w-[18px] !h-[18px]">call</mat-icon>
                <span>CALL / SEND</span>
              </button>

              <button
                type="button"
                (click)="handleEndKey()"
                class="touch-target py-2.5 rounded-xl bg-red-700 hover:bg-red-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all"
              >
                <mat-icon class="!text-[18px] !w-[18px] !h-[18px]">call_end</mat-icon>
                <span>END / CLEAR</span>
              </button>
            </div>

            <!-- PHYSICAL TACTILE NUMERIC KEYPAD (1-9, *, 0, #) -->
            <div class="grid grid-cols-3 gap-2 px-1 pt-1">
              @for (k of keypadKeys; track k.num) {
                <button
                  type="button"
                  (click)="pressKey(k.num)"
                  class="touch-target py-2.5 rounded-xl bg-stone-800/90 hover:bg-stone-700 active:bg-stone-600 active:scale-95 text-stone-100 flex flex-col items-center justify-center shadow-md border-b-2 border-stone-950 transition-all"
                >
                  <span class="text-base font-extrabold font-mono leading-none">{{ k.num }}</span>
                  <span class="text-[9px] text-stone-400 font-mono tracking-widest leading-none mt-0.5">{{ k.sub }}</span>
                </button>
              }
            </div>

          </div>
        </div>

        <!-- RIGHT SIDE: JUDGE PLAYBOOK & USSD MENU EXPLAINER (Cols 6-12) -->
        <div class="lg:col-span-7 space-y-6">
          
          <div class="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-4">
            <h2 class="text-lg font-bold text-stone-900 flex items-center gap-2">
              <mat-icon class="text-[#C2410C]">route</mat-icon>
              <span>Why USSD is the Game-Changer for Nigeria</span>
            </h2>
            <p class="text-xs sm:text-sm text-stone-700 leading-relaxed">
              In Nigeria, over <strong>60% of rural women do not own a smartphone</strong> and live in areas where mobile data bundles are prohibitively expensive or unreliable. 
              By implementing the full triaging tree over USSD (like banking code *737#), Telemama achieves 100% device reach without excluding vulnerable mothers.
            </p>
          </div>

          <!-- Quick Test Buttons for Hackathon Presentation -->
          <div class="bg-[#F7F1E9] rounded-2xl p-6 border border-[#E5DAC8] space-y-4">
            <div class="flex items-center justify-between">
              <h3 class="text-sm font-bold text-[#C2410C] uppercase tracking-wide">
                Interactive Testing Shortcuts for Judges:
              </h3>
              <span class="text-xs text-stone-600">Click any shortcut to auto-play</span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <button
                type="button"
                (click)="simulateScenario('safe_checkin')"
                class="touch-target p-3 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-left font-medium text-stone-800 flex items-center justify-between transition-colors"
              >
                <div>
                  <div class="font-bold text-stone-900">1. Simulate Safe Check-In</div>
                  <div class="text-[11px] text-stone-600">Walks through 3 safe questions</div>
                </div>
                <mat-icon class="text-emerald-600">check_circle</mat-icon>
              </button>

              <button
                type="button"
                (click)="simulateScenario('danger_checkin')"
                class="touch-target p-3 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-left font-medium text-red-900 flex items-center justify-between transition-colors"
              >
                <div>
                  <div class="font-bold text-red-900">2. Simulate Danger Sign</div>
                  <div class="text-[11px] text-red-700">Triggers eclampsia alert via USSD</div>
                </div>
                <mat-icon class="text-red-600">warning</mat-icon>
              </button>

              <button
                type="button"
                (click)="simulateScenario('emergency_sos')"
                class="touch-target p-3 rounded-xl border border-amber-200 bg-amber-50 hover:bg-amber-100 text-left font-medium text-amber-900 flex items-center justify-between transition-colors"
              >
                <div>
                  <div class="font-bold text-amber-900">3. Simulate USSD Panic SOS</div>
                  <div class="text-[11px] text-amber-800">Triggers immediate SMS & Keke dispatch</div>
                </div>
                <mat-icon class="text-amber-600">crisis_alert</mat-icon>
              </button>

              <button
                type="button"
                (click)="simulateScenario('nurse_callback')"
                class="touch-target p-3 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-left font-medium text-stone-800 flex items-center justify-between transition-colors"
              >
                <div>
                  <div class="font-bold text-stone-900">4. Request Nurse Callback</div>
                  <div class="text-[11px] text-stone-600">CHEW voice outreach request</div>
                </div>
                <mat-icon class="text-blue-600">phone_callback</mat-icon>
              </button>
            </div>
          </div>

          <!-- USSD Architecture Specification -->
          <div class="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-3">
            <h3 class="text-sm font-bold text-stone-900">Technical Specs (Africa's Talking / Telco Gateway)</h3>
            <ul class="text-xs text-stone-700 space-y-2">
              <li class="flex items-start gap-2">
                <span class="font-bold text-stone-900 w-24 shrink-0">Protocol:</span>
                <span>Standard GSM MAP USSD Phase 2 (Unstructured Supplementary Service Data).</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="font-bold text-stone-900 w-24 shrink-0">Session Time:</span>
                <span>Under 180 seconds timeout with automatic retry fallback via SMS.</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="font-bold text-stone-900 w-24 shrink-0">Cost:</span>
                <span>Reverse-billed to Primary Healthcare Fund (0 Naira cost to mother).</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="font-bold text-stone-900 w-24 shrink-0">Language:</span>
                <span>Interactive language selection (English, Pidgin, Hausa, Yoruba, Igbo).</span>
              </li>
            </ul>
          </div>

        </div>

      </div>

    </div>
  `
})
export class UssdSimulator {
  readonly state = inject(MaternalStateService);

  readonly currentStep = signal<UssdStep>('idle');
  readonly dialedNumber = signal<string>('*384*26#');
  readonly currentInput = signal<string>('');

  readonly keypadKeys = [
    { num: '1', sub: '.,' },
    { num: '2', sub: 'ABC' },
    { num: '3', sub: 'DEF' },
    { num: '4', sub: 'GHI' },
    { num: '5', sub: 'JKL' },
    { num: '6', sub: 'MNO' },
    { num: '7', sub: 'PQRS' },
    { num: '8', sub: 'TUV' },
    { num: '9', sub: 'WXYZ' },
    { num: '*', sub: 'VIBR' },
    { num: '0', sub: 'SPACE' },
    { num: '#', sub: 'LOCK' }
  ];

  dialCode(code: string): void {
    this.dialedNumber.set(code);
    this.currentStep.set('dialing');
    this.currentInput.set('');

    setTimeout(() => {
      this.currentStep.set('main_menu');
    }, 900);
  }

  pressKey(num: string): void {
    if (this.currentStep() === 'idle') {
      this.dialedNumber.update(v => v + num);
      return;
    }

    this.currentInput.update(v => v + num);
  }

  handleSoftLeft(): void {
    this.submitInput();
  }

  handleSoftRight(): void {
    if (this.currentInput().length > 0) {
      this.currentInput.update(v => v.slice(0, -1));
    } else {
      this.currentStep.set('main_menu');
    }
  }

  handleCallKey(): void {
    if (this.currentStep() === 'idle') {
      this.dialCode(this.dialedNumber() || '*384*26#');
    } else {
      this.submitInput();
    }
  }

  handleEndKey(): void {
    this.currentStep.set('idle');
    this.currentInput.set('');
    this.dialedNumber.set('*384*26#');
  }

  submitInput(): void {
    const input = this.currentInput().trim();
    const step = this.currentStep();
    this.currentInput.set('');

    if (step === 'main_menu') {
      if (input === '1') {
        this.currentStep.set('checkin_q1_headache');
      } else if (input === '2') {
        this.currentStep.set('emergency_confirm');
      } else if (input === '3') {
        this.currentStep.set('status_view');
      } else if (input === '5') {
        this.currentStep.set('callback_sent');
        this.state.acknowledgeAlert(
          this.state.alerts()[0]?.id || 'ALT-USSD',
          'Nurse Callback Request',
          'Mother requested callback via USSD *384*26#'
        );
      } else if (input === '0') {
        this.handleEndKey();
      }
    } else if (step === 'checkin_q1_headache') {
      if (input === '1') {
        this.currentStep.set('checkin_complete_danger');
        this.state.submitDailyCheckIn(
          this.state.currentMother().id,
          ['severe_headache_vision'],
          undefined,
          'ussd'
        );
      } else {
        this.currentStep.set('checkin_q2_bleeding');
      }
    } else if (step === 'checkin_q2_bleeding') {
      if (input === '1') {
        this.currentStep.set('checkin_complete_danger');
        this.state.submitDailyCheckIn(
          this.state.currentMother().id,
          ['vaginal_bleeding'],
          undefined,
          'ussd'
        );
      } else {
        this.currentStep.set('checkin_q3_baby');
      }
    } else if (step === 'checkin_q3_baby') {
      if (input === '1') {
        this.currentStep.set('checkin_complete_danger');
        this.state.submitDailyCheckIn(
          this.state.currentMother().id,
          ['baby_not_feeding'],
          undefined,
          'ussd'
        );
      } else {
        this.currentStep.set('checkin_complete_safe');
        this.state.submitDailyCheckIn(
          this.state.currentMother().id,
          [],
          undefined,
          'ussd'
        );
      }
    } else if (step === 'emergency_confirm') {
      if (input === '1') {
        this.currentStep.set('emergency_sent');
        this.state.triggerEmergencySOS(
          this.state.currentMother().id,
          'USSD Emergency Menu Selection (*384*26#)'
        );
      } else {
        this.currentStep.set('main_menu');
      }
    } else {
      // 0 or other exits to main menu
      this.currentStep.set('main_menu');
    }
  }

  simulateScenario(scenario: 'safe_checkin' | 'danger_checkin' | 'emergency_sos' | 'nurse_callback'): void {
    this.dialCode('*384*26#');
    
    setTimeout(() => {
      if (scenario === 'safe_checkin') {
        this.currentStep.set('checkin_complete_safe');
        this.state.submitDailyCheckIn(this.state.currentMother().id, [], undefined, 'ussd');
      } else if (scenario === 'danger_checkin') {
        this.currentStep.set('checkin_complete_danger');
        this.state.submitDailyCheckIn(this.state.currentMother().id, ['severe_headache_vision'], undefined, 'ussd');
      } else if (scenario === 'emergency_sos') {
        this.currentStep.set('emergency_sent');
        this.state.triggerEmergencySOS(this.state.currentMother().id, 'USSD Fast Scenario Trigger');
      } else if (scenario === 'nurse_callback') {
        this.currentStep.set('callback_sent');
      }
    }, 1200);
  }
}
