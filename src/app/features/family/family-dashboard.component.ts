import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { UpperCasePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MaternalStateService } from '../../core/services/maternal-state.service';
import { EmergencyAlert } from '../../core/models/maternal.models';

@Component({
  selector: 'app-family-dashboard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UpperCasePipe, MatIconModule],
  template: `
    <div class="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      <!-- Top Family Support Persona Header -->
      <div class="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-lg shrink-0">
            <mat-icon class="!text-[28px] !w-[28px] !h-[28px]">family_restroom</mat-icon>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h1 class="text-xl font-bold text-stone-900">Family & Support Person Portal</h1>
              <span class="text-[11px] font-bold px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 border border-stone-200">
                Active Guardian View
              </span>
            </div>
            <p class="text-xs text-stone-600 mt-0.5">
              Watching over: <strong class="text-stone-900">{{ currentMother().fullName }}</strong> ({{ currentMother().lga }}, {{ currentMother().state }})
              · Nominated: {{ currentMother().nominatedSupportPerson.name }} ({{ currentMother().nominatedSupportPerson.relationship }})
            </p>
          </div>
        </div>

        <!-- Quick Switch Mother to test different family scenarios -->
        <div class="w-full sm:w-auto flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2">
          <label for="family-mom-select" class="text-xs text-stone-600 font-medium whitespace-nowrap">Mother:</label>
          <select
            id="family-mom-select"
            [value]="currentMother().id"
            (change)="onMotherChange($event)"
            class="touch-target w-full sm:w-auto text-xs bg-stone-50 border border-stone-300 rounded-xl px-3 py-2.5 font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#C2410C]"
          >
            @for (mom of state.mothers(); track mom.id) {
              <option [value]="mom.id">
                {{ mom.fullName }} ({{ mom.nominatedSupportPerson.name }} - {{ mom.riskLevel | uppercase }})
              </option>
            }
          </select>
        </div>
      </div>

      <!-- Critical Active Alert Banner (If mother has active alert) -->
      @if (activeMotherAlert(); as alert) {
        <div 
          class="rounded-2xl p-6 border shadow-md space-y-5"
          [class.bg-red-50]="alert.riskLevel === 'red'"
          [class.border-red-300]="alert.riskLevel === 'red'"
          [class.bg-amber-50]="alert.riskLevel === 'amber'"
          [class.border-amber-300]="alert.riskLevel === 'amber'"
        >
          <!-- Alert Header Strip -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4" [class.border-red-200]="alert.riskLevel === 'red'" [class.border-amber-200]="alert.riskLevel === 'amber'">
            <div class="flex items-center gap-2.5">
              <span class="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white shrink-0" [class.bg-red-600]="alert.riskLevel === 'red'" [class.bg-amber-600]="alert.riskLevel === 'amber'">
                <mat-icon class="!text-[20px] !w-[20px] !h-[20px]">notification_important</mat-icon>
              </span>
              <div>
                <span class="text-xs font-bold uppercase tracking-wider" [class.text-red-800]="alert.riskLevel === 'red'" [class.text-amber-800]="alert.riskLevel === 'amber'">
                  {{ alert.riskLevel === 'red' ? 'CRITICAL EMERGENCY ALERT' : 'WARNING NOTIFICATION' }}
                </span>
                <h2 class="text-lg font-extrabold text-stone-900 leading-tight">
                  {{ alert.summary }}
                </h2>
              </div>
            </div>

            <div class="text-xs font-medium text-stone-600 sm:text-right">
              <div>Triggered: {{ alert.timestamp }}</div>
              <div class="font-semibold text-stone-800">Status: {{ alert.status | uppercase }}</div>
            </div>
          </div>

          <!-- Symptoms Reported -->
          <div class="space-y-1.5">
            <span class="text-xs font-bold text-stone-800 block">Reported Symptoms:</span>
            <div class="flex flex-wrap gap-2">
              @for (sym of alert.symptoms; track sym) {
                <span class="text-xs font-semibold px-2.5 py-1 rounded-lg bg-white border border-stone-200 text-stone-900 shadow-sm flex items-center gap-1.5">
                  <mat-icon class="!text-[14px] !w-[14px] !h-[14px] text-red-600">error_outline</mat-icon>
                  <span>{{ sym }}</span>
                </span>
              }
            </div>
          </div>

          <!-- Plain-Language "What to Do Now" Guidance -->
          <div class="bg-white rounded-xl p-4 border border-stone-200 space-y-2">
            <div class="flex items-center gap-2 text-xs font-bold text-[#C2410C]">
              <mat-icon class="!text-[18px] !w-[18px] !h-[18px]">health_and_safety</mat-icon>
              <span>WHAT YOU MUST DO RIGHT NOW (FIRST-AID GUIDANCE):</span>
            </div>
            <p class="text-xs sm:text-sm text-stone-800 font-medium leading-relaxed">
              {{ alert.familyGuidance }}
            </p>
          </div>

          <!-- One-Tap Emergency Action Buttons -->
          <div class="space-y-3 pt-1">
            <span class="text-xs font-bold text-stone-900 block">Take Immediate Action:</span>
            
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              
              <!-- Action 1: Call Mother -->
              <button
                type="button"
                (click)="simulateCall(currentMother().fullName, currentMother().phoneNumber)"
                class="touch-target p-3.5 bg-stone-900 hover:bg-black text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors"
              >
                <mat-icon class="!text-[18px] !w-[18px] !h-[18px] text-emerald-400">phone</mat-icon>
                <span>Call {{ currentMother().fullName }}</span>
              </button>

              <!-- Action 2: Call Primary Health Center -->
              <button
                type="button"
                (click)="simulateCall(currentMother().primaryHealthCenter, '0800-TELEMAMA-PHC')"
                class="touch-target p-3.5 bg-[#C2410C] hover:bg-[#9A3412] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors"
              >
                <mat-icon class="!text-[18px] !w-[18px] !h-[18px]">medical_services</mat-icon>
                <span>Call Facility Midwife</span>
              </button>

              <!-- Action 3: Notify "I Am On My Way" -->
              <button
                type="button"
                (click)="sendOnMyWay(alert.id)"
                class="touch-target p-3.5 bg-white hover:bg-stone-50 border-2 border-stone-300 text-stone-900 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors"
              >
                <mat-icon class="!text-[18px] !w-[18px] !h-[18px] text-blue-600">directions_run</mat-icon>
                <span>"I Am On My Way" (Ping)</span>
              </button>
            </div>
          </div>

          <!-- Community Transport / Tricycle Ambulance Dispatch Section -->
          <div class="bg-stone-900 text-white rounded-xl p-4 space-y-3">
            <div class="flex items-center justify-between text-xs">
              <span class="font-bold text-amber-400 uppercase tracking-wide flex items-center gap-1.5">
                <mat-icon class="!text-[16px] !w-[16px] !h-[16px]">electric_rickshaw</mat-icon>
                <span>Community Emergency Transport</span>
              </span>
              <span class="font-mono text-stone-400">
                {{ alert.transportStatus ? alert.transportStatus.toUpperCase() : 'PENDING' }}
              </span>
            </div>

            @if (alert.transportStatus === 'en_route') {
              <div class="bg-stone-800 p-3 rounded-lg border border-stone-700 space-y-1">
                <div class="flex items-center gap-2 text-xs font-bold text-emerald-400">
                  <mat-icon class="!text-[16px] !w-[16px] !h-[16px]">local_shipping</mat-icon>
                  <span>Tricycle Ambulance En-Route</span>
                </div>
                <p class="text-[11px] text-stone-300">
                  Driver Kabir dispatched from {{ currentMother().primaryHealthCenter }}. ETA: ~12 mins to {{ currentMother().wardOrCommunity }}.
                </p>
              </div>
            } @else if (alert.transportStatus === 'arrived') {
              <div class="bg-emerald-950/80 p-3 rounded-lg border border-emerald-800 text-xs font-semibold text-emerald-300 flex items-center gap-2">
                <mat-icon class="!text-[16px] !w-[16px] !h-[16px]">check_circle</mat-icon>
                <span>Transport has arrived at the location.</span>
              </div>
            } @else {
              <p class="text-xs text-stone-300">
                Need urgent community transport? Dispatch a certified maternal tricycle ambulance or Okada escort directly to {{ currentMother().wardOrCommunity }}.
              </p>
              <div class="flex flex-col sm:flex-row gap-2 pt-1">
                <button
                  type="button"
                  (click)="requestTransport(alert.id, 'tricycle_ambulance')"
                  class="touch-target w-full sm:w-auto px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <mat-icon class="!text-[16px] !w-[16px] !h-[16px]">electric_rickshaw</mat-icon>
                  <span>Dispatch Tricycle Ambulance (Keke)</span>
                </button>
                <button
                  type="button"
                  (click)="requestTransport(alert.id, 'okada_rapid')"
                  class="touch-target w-full sm:w-auto px-4 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <mat-icon class="!text-[16px] !w-[16px] !h-[16px]">two_wheeler</mat-icon>
                  <span>Dispatch Okada Rapid Escort</span>
                </button>
              </div>
            }
          </div>

        </div>
      } @else {
        <!-- No active alert for this mother -->
        <div class="bg-emerald-50 rounded-2xl p-6 border border-emerald-200 flex items-start gap-3">
          <mat-icon class="text-emerald-700 !text-[28px] !w-[28px] !h-[28px]">verified</mat-icon>
          <div class="space-y-1">
            <h2 class="text-base font-bold text-emerald-900">No active emergency alerts for {{ currentMother().fullName }}</h2>
            <p class="text-xs text-emerald-800 leading-relaxed">
              Her last check-in was safe and reported no danger signs. You will automatically receive an SMS and automated phone call if any danger signs or emergency SOS is reported.
            </p>
          </div>
        </div>
      }

      <!-- All Alerts Inbox for All Monitored Mothers -->
      <div class="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-4">
        <div class="flex items-center justify-between border-b border-stone-100 pb-3">
          <div>
            <h2 class="text-base font-bold text-stone-900">All Recent Community Alerts & Notifications</h2>
            <p class="text-xs text-stone-600">Historical log of warnings and responses across your monitored contacts</p>
          </div>
          <span class="text-xs text-stone-500 font-mono">{{ state.alerts().length }} alerts logged</span>
        </div>

        <div class="space-y-3">
          @for (alert of state.alerts(); track alert.id) {
            <div class="p-4 rounded-xl border border-stone-200 bg-stone-50 hover:bg-white transition-all space-y-2">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div class="flex items-center gap-2">
                  <span 
                    class="w-2.5 h-2.5 rounded-full"
                    [class.bg-red-600]="alert.riskLevel === 'red'"
                    [class.bg-amber-500]="alert.riskLevel === 'amber'"
                  ></span>
                  <span class="text-xs font-bold text-stone-900">{{ alert.motherName }}</span>
                  <span class="text-[11px] text-stone-500">· {{ alert.lga }}</span>
                </div>
                <div class="text-[11px] text-stone-500 font-mono">
                  {{ alert.timestamp }} · <span class="uppercase font-semibold">{{ alert.status }}</span>
                </div>
              </div>

              <p class="text-xs text-stone-700">
                {{ alert.summary }}
              </p>

              @if (alert.responseLogs.length > 0) {
                <div class="text-[11px] text-stone-600 bg-white p-2 rounded-lg border border-stone-200 font-mono">
                  Latest: {{ alert.responseLogs[alert.responseLogs.length - 1].actor }} - 
                  {{ alert.responseLogs[alert.responseLogs.length - 1].notes }}
                </div>
              }
            </div>
          }
        </div>
      </div>

    </div>
  `
})
export class FamilyDashboard {
  readonly state = inject(MaternalStateService);
  readonly currentMother = this.state.currentMother;

  activeMotherAlert = signal<EmergencyAlert | null>(null);

  constructor() {
    this.updateActiveMotherAlert();
  }

  onMotherChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.state.setActiveMother(select.value);
    this.updateActiveMotherAlert();
  }

  private updateActiveMotherAlert(): void {
    const momId = this.currentMother().id;
    const match = this.state.alerts().find(a => a.motherId === momId && a.status !== 'resolved');
    this.activeMotherAlert.set(match || null);
  }

  simulateCall(recipient: string, number: string): void {
    this.state.triggerPresetScenario('all_clear'); // gentle trigger
    alert(`Calling ${recipient} at ${number}... (Simulated GSM/VoIP dialer)`);
  }

  sendOnMyWay(alertId: string): void {
    const contactName = this.currentMother().nominatedSupportPerson.name;
    this.state.acknowledgeAlert(alertId, `${contactName} (Family)`, 'I am on my way to her location right now.');
    this.updateActiveMotherAlert();
  }

  requestTransport(alertId: string, type: 'tricycle_ambulance' | 'okada_rapid'): void {
    const contactName = this.currentMother().nominatedSupportPerson.name;
    this.state.dispatchTransport(alertId, type, `${contactName} (Family Request)`);
    this.updateActiveMotherAlert();
  }
}
