import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MaternalStateService } from '../../core/services/maternal-state.service';

@Component({
  selector: 'app-pitch-guide-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule],
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div class="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200 p-6 md:p-8 space-y-6">
        
        <!-- Modal Header -->
        <div class="flex items-start justify-between gap-4 border-b border-stone-200 pb-4">
          <div>
            <div class="flex items-center gap-2 text-xs font-semibold text-[#C2410C] tracking-wide">
              <span>HACKATHON PITCH GUIDE</span>
              <span>·</span>
              <span>3-MINUTE DEMO PLAYBOOK</span>
            </div>
            <h2 class="text-2xl font-bold text-stone-900 mt-1">Telemama Pitch & Demo Flow</h2>
          </div>
          <button
            type="button"
            (click)="closeModal.emit()"
            class="touch-target p-2 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <mat-icon>close</mat-icon>
          </button>
        </div>

        <!-- The 3 Delays Context -->
        <div class="bg-[#F7F1E9] rounded-xl p-4 border border-[#E5DAC8] text-sm text-stone-800 space-y-2">
          <p class="font-semibold text-[#C2410C]">The Nigerian Maternal Health Reality:</p>
          <p class="text-xs text-stone-600 leading-relaxed">
            Nigeria accounts for nearly 20% of global maternal deaths. Women lose their lives due to the 
            <strong>Three Delays</strong>: (1) Delay in recognizing danger signs at home; (2) Delay in reaching health facilities; and (3) Delay in receiving appropriate clinical intervention.
          </p>
          <p class="text-xs text-stone-700 font-medium">
            Telemama bridges smartphones and basic feature phones via USSD to eliminate Delay #1 and #2 through automated danger-sign triaging and community tricycle ambulance dispatch.
          </p>
        </div>

        <!-- 3-Minute Demo Playbook -->
        <div class="space-y-3">
          <h3 class="text-sm font-bold text-stone-900">How to Walk Judges Through Telemama in 3 Minutes:</h3>

          <!-- Step 1 -->
          <div class="flex items-start gap-3 p-3 rounded-xl border border-stone-200 hover:bg-stone-50 transition-colors">
            <span class="w-6 h-6 rounded-full bg-[#C2410C] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
            <div class="text-xs text-stone-700 space-y-1">
              <p class="font-semibold text-stone-900">Step 1: The Mother's Daily Check-in & SOS</p>
              <p>Navigate to <strong>Mother Portal</strong>. Select symptoms like <em>Severe Headache / Blurred Vision</em> or press the <strong>Red Emergency SOS</strong>. Notice the low-literacy icons, Pidgin audio prompts, and instant triage feedback.</p>
              <button
                type="button"
                (click)="goTo('/mother'); closeModal.emit()"
                class="mt-1 text-xs font-semibold text-[#C2410C] hover:underline flex items-center gap-1"
              >
                <span>Jump to Mother Portal</span>
                <mat-icon class="!text-[14px] !w-[14px] !h-[14px]">arrow_forward</mat-icon>
              </button>
            </div>
          </div>

          <!-- Step 2 -->
          <div class="flex items-start gap-3 p-3 rounded-xl border border-stone-200 hover:bg-stone-50 transition-colors">
            <span class="w-6 h-6 rounded-full bg-[#C2410C] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
            <div class="text-xs text-stone-700 space-y-1">
              <p class="font-semibold text-stone-900">Step 2: The Family & Nominated Support Network</p>
              <p>Navigate to <strong>Family Support</strong>. See the incoming alert for Amina Bello with plain-English instructions ("What to do right now"), one-tap phone call, and <strong>Tricycle Ambulance Dispatch</strong>.</p>
              <button
                type="button"
                (click)="goTo('/family'); closeModal.emit()"
                class="mt-1 text-xs font-semibold text-[#C2410C] hover:underline flex items-center gap-1"
              >
                <span>Jump to Family Support</span>
                <mat-icon class="!text-[14px] !w-[14px] !h-[14px]">arrow_forward</mat-icon>
              </button>
            </div>
          </div>

          <!-- Step 3 -->
          <div class="flex items-start gap-3 p-3 rounded-xl border border-stone-200 hover:bg-stone-50 transition-colors">
            <span class="w-6 h-6 rounded-full bg-[#C2410C] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">3</span>
            <div class="text-xs text-stone-700 space-y-1">
              <p class="font-semibold text-stone-900">Step 3: Primary Healthcare Center (PHC) Clinical Dashboard</p>
              <p>Navigate to <strong>Facility Dashboard</strong>. Midwives and CHEWs monitor pregnant and postpartum mothers with color-coded risk flags (Green, Amber, Red) and receive WHO-aligned clinical protocols (e.g. Magnesium Sulfate loading dose guidelines).</p>
              <button
                type="button"
                (click)="goTo('/health-worker'); closeModal.emit()"
                class="mt-1 text-xs font-semibold text-[#C2410C] hover:underline flex items-center gap-1"
              >
                <span>Jump to Facility Dashboard</span>
                <mat-icon class="!text-[14px] !w-[14px] !h-[14px]">arrow_forward</mat-icon>
              </button>
            </div>
          </div>

          <!-- Step 4 -->
          <div class="flex items-start gap-3 p-3 rounded-xl border border-stone-200 hover:bg-stone-50 transition-colors">
            <span class="w-6 h-6 rounded-full bg-[#C2410C] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">4</span>
            <div class="text-xs text-stone-700 space-y-1">
              <p class="font-semibold text-stone-900">Step 4: The Offline Feature Phone USSD Engine (*384*26#)</p>
              <p>Navigate to <strong>USSD Demo</strong>. Use the interactive vintage phone keypad to dial through the live menu tree without internet or expensive smartphones.</p>
              <button
                type="button"
                (click)="goTo('/ussd'); closeModal.emit()"
                class="mt-1 text-xs font-semibold text-[#C2410C] hover:underline flex items-center gap-1"
              >
                <span>Test USSD Feature Phone</span>
                <mat-icon class="!text-[14px] !w-[14px] !h-[14px]">arrow_forward</mat-icon>
              </button>
            </div>
          </div>
        </div>

        <!-- 1-Click Fast Trigger Buttons for Live Pitch -->
        <div class="border-t border-stone-200 pt-4 space-y-2">
          <p class="text-xs font-bold text-stone-900">One-Click Live Pitch Triggers:</p>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              (click)="triggerScenario('preeclampsia')"
              class="touch-target p-2.5 rounded-xl border border-red-200 bg-red-50 text-red-800 hover:bg-red-100 text-left font-medium flex items-center justify-between"
            >
              <span>⚡ Trigger Preeclampsia Red Alert</span>
              <mat-icon class="!text-[16px] !w-[16px] !h-[16px]">bolt</mat-icon>
            </button>
            <button
              type="button"
              (click)="triggerScenario('neonatal_sepsis')"
              class="touch-target p-2.5 rounded-xl border border-orange-200 bg-orange-50 text-orange-800 hover:bg-orange-100 text-left font-medium flex items-center justify-between"
            >
              <span>⚡ Trigger Newborn Sepsis Alert</span>
              <mat-icon class="!text-[16px] !w-[16px] !h-[16px]">child_care</mat-icon>
            </button>
            <button
              type="button"
              (click)="triggerScenario('sos')"
              class="touch-target p-2.5 rounded-xl border border-stone-200 bg-stone-100 text-stone-800 hover:bg-stone-200 text-left font-medium flex items-center justify-between"
            >
              <span>🚨 Simulate Big SOS Panic Button</span>
              <mat-icon class="!text-[16px] !w-[16px] !h-[16px]">crisis_alert</mat-icon>
            </button>
            <button
              type="button"
              (click)="resetDemo()"
              class="touch-target p-2.5 rounded-xl border border-stone-200 bg-white text-stone-700 hover:bg-stone-50 text-left font-medium flex items-center justify-between"
            >
              <span>↺ Reset State to Clean Defaults</span>
              <mat-icon class="!text-[16px] !w-[16px] !h-[16px]">refresh</mat-icon>
            </button>
          </div>
        </div>

        <div class="pt-2 flex justify-end">
          <button
            type="button"
            (click)="closeModal.emit()"
            class="touch-target px-5 py-2.5 bg-stone-900 text-white rounded-xl text-xs font-semibold hover:bg-stone-800 transition-colors"
          >
            Start Exploring
          </button>
        </div>

      </div>
    </div>
  `
})
export class PitchGuideModal {
  readonly state = inject(MaternalStateService);
  readonly router = inject(Router);
  readonly closeModal = output<void>();

  goTo(route: string): void {
    this.router.navigate([route]);
  }

  triggerScenario(scenario: 'preeclampsia' | 'neonatal_sepsis' | 'sos'): void {
    this.state.triggerPresetScenario(scenario);
    this.closeModal.emit();
    if (scenario === 'sos') {
      this.router.navigate(['/mother']);
    } else {
      this.router.navigate(['/health-worker']);
    }
  }

  resetDemo(): void {
    this.state.resetDemoData();
    this.closeModal.emit();
  }
}
