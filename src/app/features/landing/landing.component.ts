import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MaternalStateService } from '../../core/services/maternal-state.service';

@Component({
  selector: 'app-landing',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, MatIconModule],
  template: `
    <div class="space-y-12 pb-16">
      
      <!-- Hero Section -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div class="lg:col-span-7 space-y-6">
            <div class="inline-flex items-center gap-2 text-xs font-semibold text-[#C2410C] tracking-wide">
              <span>AFRICA-FIRST MATERNAL & NEWBORN MONITORING</span>
              <span>·</span>
              <span>NIGERIA</span>
            </div>

            <h1 class="text-3xl sm:text-4xl md:text-5xl font-extrabold text-stone-900 tracking-tight leading-[1.15]" style="text-wrap: balance;">
              Continuous watchful care for every mother and baby across Nigeria.
            </h1>

            <p class="text-base sm:text-lg text-stone-700 leading-relaxed max-w-2xl">
              Telemama bridges smartphones and basic feature phones via USSD to detect maternal danger signs early, alert nominated family members, and dispatch community emergency transport before complications turn fatal.
            </p>

            <!-- Quick Action CTA Group -->
            <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-2">
              <a
                routerLink="/mother"
                class="touch-target w-full sm:w-auto px-6 py-3.5 bg-[#C2410C] hover:bg-[#9A3412] active:scale-[0.98] text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <mat-icon class="!text-[20px] !w-[20px] !h-[20px]">pregnant_woman</mat-icon>
                <span>Enter as Mother</span>
              </a>

              <a
                routerLink="/health-worker"
                class="touch-target w-full sm:w-auto px-6 py-3.5 bg-stone-900 hover:bg-stone-800 active:scale-[0.98] text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <mat-icon class="!text-[20px] !w-[20px] !h-[20px]">medical_services</mat-icon>
                <span>Health Facility Dashboard</span>
              </a>

              <a
                routerLink="/ussd"
                class="touch-target w-full sm:w-auto px-5 py-3.5 border-2 border-stone-800 hover:bg-stone-100 active:scale-[0.98] text-stone-900 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 font-mono"
              >
                <mat-icon class="!text-[20px] !w-[20px] !h-[20px]">phone_android</mat-icon>
                <span>Dial *384*26#</span>
              </a>
            </div>

            <!-- Trust Markers (Clean unboxed text metadata) -->
            <div class="pt-4 flex flex-wrap items-center gap-3 text-xs text-stone-600 font-medium">
              <span>Works offline & on 2G</span>
              <span aria-hidden="true">·</span>
              <span>Zero-cost USSD for basic phones</span>
              <span aria-hidden="true">·</span>
              <span>FMOH & WHO Triage Protocol</span>
              <span aria-hidden="true">·</span>
              <span>Community Tricycle Ambulance Dispatch</span>
            </div>
          </div>

          <!-- Hero Right: Live Status & Simulation Anchor -->
          <div class="lg:col-span-5">
            <div class="bg-white rounded-2xl p-6 shadow-sm border border-stone-200 space-y-5">
              
              <div class="flex items-center justify-between border-b border-stone-100 pb-3">
                <span class="text-xs font-bold text-stone-700 tracking-wider">LIVE SYSTEM OVERVIEW</span>
                <span class="text-xs text-stone-600 font-mono">Nigeria PHC Network</span>
              </div>

              <!-- Key Metrics Grid -->
              <div class="grid grid-cols-2 gap-3">
                <div class="bg-[#F7F1E9] p-4 rounded-xl border border-[#EADBCA]">
                  <div class="text-2xl font-extrabold text-stone-900 tabular-nums">
                    {{ state.mothers().length }}
                  </div>
                  <div class="text-xs text-stone-600 font-medium mt-0.5">Mothers Monitored</div>
                </div>

                <div class="bg-red-50 p-4 rounded-xl border border-red-200">
                  <div class="text-2xl font-extrabold text-red-700 tabular-nums">
                    {{ state.redAlertsCount() }}
                  </div>
                  <div class="text-xs text-red-700 font-medium mt-0.5">Critical Red Alerts</div>
                </div>

                <div class="bg-amber-50 p-4 rounded-xl border border-amber-200">
                  <div class="text-2xl font-extrabold text-amber-700 tabular-nums">
                    {{ state.amberAlertsCount() }}
                  </div>
                  <div class="text-xs text-amber-700 font-medium mt-0.5">Amber Warnings</div>
                </div>

                <div class="bg-emerald-50 p-4 rounded-xl border border-emerald-200">
                  <div class="text-2xl font-extrabold text-emerald-800 tabular-nums">
                    {{ state.safeMothers().length }}
                  </div>
                  <div class="text-xs text-emerald-800 font-medium mt-0.5">Safe & Routine</div>
                </div>
              </div>

              <!-- Active Alert Preview -->
              @if (state.activeAlerts().length > 0) {
                <div class="bg-stone-50 rounded-xl p-3.5 border border-stone-200 space-y-2">
                  <div class="flex items-center justify-between text-xs font-semibold">
                    <span class="text-red-700 flex items-center gap-1">
                      <mat-icon class="!text-[16px] !w-[16px] !h-[16px]">warning</mat-icon>
                      Latest High-Priority Alert
                    </span>
                    <span class="text-stone-600">{{ state.activeAlerts()[0].timestamp }}</span>
                  </div>
                  <p class="text-xs font-semibold text-stone-900">
                    {{ state.activeAlerts()[0].motherName }} ({{ state.activeAlerts()[0].lga }})
                  </p>
                  <p class="text-xs text-stone-600 line-clamp-2">
                    {{ state.activeAlerts()[0].summary }}
                  </p>
                  <div class="pt-1 flex items-center justify-between">
                    <span class="text-[11px] font-semibold text-[#C2410C]">
                      {{ state.activeAlerts()[0].transportStatus === 'en_route' ? 'Tricycle En-Route' : 'Response Pending' }}
                    </span>
                    <a routerLink="/health-worker" class="text-xs font-bold text-stone-900 hover:text-[#C2410C]">
                      View in PHC Dashboard →
                    </a>
                  </div>
                </div>
              }

              <!-- Preset Trigger Strip -->
              <div class="pt-1 space-y-2">
                <span class="text-xs font-bold text-stone-700 block">Try a Live Simulation for Judges:</span>
                <div class="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    (click)="state.triggerPresetScenario('preeclampsia')"
                    class="touch-target p-2 rounded-lg border border-red-200 bg-red-50 text-red-800 hover:bg-red-100 font-medium text-left"
                  >
                    ⚡ Test Pre-eclampsia
                  </button>
                  <button
                    type="button"
                    (click)="state.triggerPresetScenario('neonatal_sepsis')"
                    class="touch-target p-2 rounded-lg border border-orange-200 bg-orange-50 text-orange-800 hover:bg-orange-100 font-medium text-left"
                  >
                    ⚡ Test Newborn Sepsis
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      <!-- Three Core Entry Points Section -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6">
        <div class="text-center max-w-2xl mx-auto mb-8 space-y-2">
          <h2 class="text-2xl sm:text-3xl font-extrabold text-stone-900">Choose Your Entry Point</h2>
          <p class="text-sm text-stone-600">
            Telemama connects the entire maternal care ecosystem: the expectant mother, her trusted family, and frontline healthcare providers.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <!-- Role 1: Mother -->
          <div class="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm flex flex-col justify-between space-y-6 hover:border-[#C2410C] transition-all group">
            <div class="space-y-4">
              <div class="w-12 h-12 rounded-xl bg-orange-100 text-[#C2410C] flex items-center justify-center">
                <mat-icon class="!text-[28px] !w-[28px] !h-[28px]">pregnant_woman</mat-icon>
              </div>
              <h3 class="text-xl font-bold text-stone-900 group-hover:text-[#C2410C] transition-colors">
                I'm a Mother
              </h3>
              <p class="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Simple daily check-ins with clear pictures and local language hints. One big red button for instant emergency help whenever you feel danger.
              </p>
              <ul class="text-xs text-stone-600 space-y-1.5 pt-2">
                <li class="flex items-center gap-2">
                  <mat-icon class="!text-[16px] !w-[16px] !h-[16px] text-emerald-600">check_circle</mat-icon>
                  <span>Daily danger-sign checklist</span>
                </li>
                <li class="flex items-center gap-2">
                  <mat-icon class="!text-[16px] !w-[16px] !h-[16px] text-emerald-600">check_circle</mat-icon>
                  <span>Voice notes in English & Pidgin</span>
                </li>
                <li class="flex items-center gap-2">
                  <mat-icon class="!text-[16px] !w-[16px] !h-[16px] text-emerald-600">check_circle</mat-icon>
                  <span>Big Red SOS Emergency Button</span>
                </li>
              </ul>
            </div>

            <div class="space-y-2 pt-2">
              <a
                routerLink="/mother"
                class="touch-target w-full py-3 bg-[#C2410C] hover:bg-[#9A3412] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <span>Open Mother Portal</span>
                <mat-icon class="!text-[16px] !w-[16px] !h-[16px]">arrow_forward</mat-icon>
              </a>
              <a
                routerLink="/mother/enrol"
                class="touch-target w-full py-2.5 text-stone-700 hover:text-stone-900 font-semibold text-xs flex items-center justify-center gap-1"
              >
                <span>Register as New Mother</span>
              </a>
            </div>
          </div>

          <!-- Role 2: Family / Support Person -->
          <div class="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm flex flex-col justify-between space-y-6 hover:border-[#C2410C] transition-all group">
            <div class="space-y-4">
              <div class="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                <mat-icon class="!text-[28px] !w-[28px] !h-[28px]">family_restroom</mat-icon>
              </div>
              <h3 class="text-xl font-bold text-stone-900 group-hover:text-[#C2410C] transition-colors">
                I'm Family / Support Person
              </h3>
              <p class="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Stay informed about your wife, daughter, or sister. When danger strikes, receive instant alerts with plain-language first-aid guidance and one-tap transport calls.
              </p>
              <ul class="text-xs text-stone-600 space-y-1.5 pt-2">
                <li class="flex items-center gap-2">
                  <mat-icon class="!text-[16px] !w-[16px] !h-[16px] text-emerald-600">check_circle</mat-icon>
                  <span>Instant SMS & automated call alerts</span>
                </li>
                <li class="flex items-center gap-2">
                  <mat-icon class="!text-[16px] !w-[16px] !h-[16px] text-emerald-600">check_circle</mat-icon>
                  <span>"What to do right now" first-aid instructions</span>
                </li>
                <li class="flex items-center gap-2">
                  <mat-icon class="!text-[16px] !w-[16px] !h-[16px] text-emerald-600">check_circle</mat-icon>
                  <span>One-tap community Tricycle ambulance call</span>
                </li>
              </ul>
            </div>

            <div class="space-y-2 pt-2">
              <a
                routerLink="/family"
                class="touch-target w-full py-3 bg-stone-900 hover:bg-stone-800 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <span>Open Family Portal</span>
                <mat-icon class="!text-[16px] !w-[16px] !h-[16px]">arrow_forward</mat-icon>
              </a>
              <span class="text-center text-[11px] text-stone-600 block">
                Nominated contact: Babatunde Bello (+234 802 331 4455)
              </span>
            </div>
          </div>

          <!-- Role 3: Health Worker / PHC -->
          <div class="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm flex flex-col justify-between space-y-6 hover:border-[#C2410C] transition-all group">
            <div class="space-y-4">
              <div class="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <mat-icon class="!text-[28px] !w-[28px] !h-[28px]">local_hospital</mat-icon>
              </div>
              <h3 class="text-xl font-bold text-stone-900 group-hover:text-[#C2410C] transition-colors">
                I'm a Health Worker
              </h3>
              <p class="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Monitor all registered pregnant and postpartum mothers across your LGA. Triage danger signs using Nigeria FMOH clinical protocols and dispatch Community Health Workers.
              </p>
              <ul class="text-xs text-stone-600 space-y-1.5 pt-2">
                <li class="flex items-center gap-2">
                  <mat-icon class="!text-[16px] !w-[16px] !h-[16px] text-emerald-600">check_circle</mat-icon>
                  <span>Color-coded risk triage queue</span>
                </li>
                <li class="flex items-center gap-2">
                  <mat-icon class="!text-[16px] !w-[16px] !h-[16px] text-emerald-600">check_circle</mat-icon>
                  <span>WHO Magnesium Sulfate & PPH clinical protocols</span>
                </li>
                <li class="flex items-center gap-2">
                  <mat-icon class="!text-[16px] !w-[16px] !h-[16px] text-emerald-600">check_circle</mat-icon>
                  <span>Quick clinical action and response logger</span>
                </li>
              </ul>
            </div>

            <div class="space-y-2 pt-2">
              <a
                routerLink="/health-worker"
                class="touch-target w-full py-3 bg-stone-900 hover:bg-stone-800 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <span>Open Clinical Dashboard</span>
                <mat-icon class="!text-[16px] !w-[16px] !h-[16px]">arrow_forward</mat-icon>
              </a>
              <span class="text-center text-[11px] text-stone-600 block">
                Primary Healthcare Center (PHC) & CHEWs
              </span>
            </div>
          </div>

        </div>
      </section>

      <!-- The Nigeria Maternal Crisis & The 3 Delays -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6">
        <div class="bg-[#EFE8DD] rounded-2xl p-6 sm:p-10 border border-[#DFD3C2] space-y-6">
          <div class="max-w-3xl space-y-2">
            <span class="text-xs font-bold text-[#C2410C] tracking-wider">THE CORE PROBLEM WE ARE SOLVING</span>
            <h2 class="text-2xl sm:text-3xl font-extrabold text-stone-900">
              How Telemama tackles Nigeria's "Three Delays"
            </h2>
            <p class="text-xs sm:text-sm text-stone-700 leading-relaxed">
              Every day in Nigeria, over 140 women die from preventable pregnancy and childbirth complications. Research demonstrates that fatal outcomes stem from three critical delays:
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            
            <div class="bg-white/80 backdrop-blur-sm p-5 rounded-xl border border-stone-200/80 space-y-3">
              <div class="text-xs font-bold text-[#C2410C]">DELAY #1</div>
              <h3 class="text-base font-bold text-stone-900">Delay in Recognizing Danger Signs</h3>
              <p class="text-xs text-stone-600 leading-relaxed">
                Mothers and families often normalize danger signs like severe swelling, blurred vision, or newborn fever until seizures or sepsis begin.
              </p>
              <div class="text-xs font-semibold text-emerald-800 bg-emerald-50 p-2.5 rounded-lg border border-emerald-200">
                ✓ Telemama Solution: Daily automated checklist in simple English & Pidgin audio flags preeclampsia and sepsis in hours.
              </div>
            </div>

            <div class="bg-white/80 backdrop-blur-sm p-5 rounded-xl border border-stone-200/80 space-y-3">
              <div class="text-xs font-bold text-[#C2410C]">DELAY #2</div>
              <h3 class="text-base font-bold text-stone-900">Delay in Reaching Health Facilities</h3>
              <p class="text-xs text-stone-600 leading-relaxed">
                Lack of transport at night, unpaved roads, and financial hesitation prevent families from reaching clinics before it is too late.
              </p>
              <div class="text-xs font-semibold text-emerald-800 bg-emerald-50 p-2.5 rounded-lg border border-emerald-200">
                ✓ Telemama Solution: Nominated family instant SMS + 1-tap dispatch of community Keke (tricycle) ambulances.
              </div>
            </div>

            <div class="bg-white/80 backdrop-blur-sm p-5 rounded-xl border border-stone-200/80 space-y-3">
              <div class="text-xs font-bold text-[#C2410C]">DELAY #3</div>
              <h3 class="text-base font-bold text-stone-900">Delay in Receiving Care at Clinic</h3>
              <p class="text-xs text-stone-600 leading-relaxed">
                Unprepared clinic staff lack triage info before the patient arrives, resulting in delayed Magnesium Sulfate or IV blood prep.
              </p>
              <div class="text-xs font-semibold text-emerald-800 bg-emerald-50 p-2.5 rounded-lg border border-emerald-200">
                ✓ Telemama Solution: Advance alerts to PHC dashboard with clinical protocols ready before mother arrives.
              </div>
            </div>

          </div>
        </div>
      </section>

      <!-- USSD Feature Phone Showcase Section -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6">
        <div class="bg-stone-900 text-white rounded-2xl p-6 sm:p-10 border border-stone-800 flex flex-col md:flex-row items-center justify-between gap-8">
          <div class="space-y-4 max-w-xl">
            <div class="inline-flex items-center gap-2 text-xs font-bold text-amber-400 font-mono">
              <span>ZERO INTERNET REQUIRED</span>
              <span>·</span>
              <span>*384*26#</span>
            </div>
            <h2 class="text-2xl sm:text-3xl font-extrabold text-white">
              Works on any $10 Nokia or itel phone via USSD
            </h2>
            <p class="text-xs sm:text-sm text-stone-300 leading-relaxed">
              In rural Nigerian communities, internet is scarce and smartphones are rare. Telemama operates fully over telco USSD protocols. Mothers dial <strong>*384*26#</strong> to report symptoms, trigger SOS help, or request a midwife call-back without spending mobile data.
            </p>
            <div class="pt-2">
              <a
                routerLink="/ussd"
                class="touch-target inline-flex items-center gap-2 px-5 py-3 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-xl font-bold text-xs transition-colors"
              >
                <mat-icon class="!text-[18px] !w-[18px] !h-[18px]">dialpad</mat-icon>
                <span>Launch Interactive USSD Simulator</span>
              </a>
            </div>
          </div>

          <div class="w-full md:w-auto shrink-0 flex justify-center">
            <div class="bg-stone-950 p-4 rounded-2xl border border-stone-700 shadow-2xl max-w-[280px] w-full text-center space-y-3">
              <div class="bg-[#8CA374] p-3 rounded-lg text-left text-xs font-mono text-stone-950 font-bold border-2 border-stone-700 leading-relaxed">
                <div>TELEMAMA NIGERIA</div>
                <div>1. Daily Check-in</div>
                <div>2. Emergency SOS</div>
                <div>3. My Care Status</div>
                <div class="pt-1">Input [1-3]: 1_</div>
              </div>
              <span class="text-[11px] text-stone-400 font-mono block">Simulated *384*26# session</span>
            </div>
          </div>
        </div>
      </section>

    </div>
  `
})
export class LandingComponent {
  readonly state = inject(MaternalStateService);
}
