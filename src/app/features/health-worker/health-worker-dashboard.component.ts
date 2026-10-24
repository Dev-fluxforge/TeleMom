import { ChangeDetectionStrategy, Component, inject, signal, computed } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UpperCasePipe } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MaternalStateService } from '../../core/services/maternal-state.service';

@Component({
  selector: 'app-health-worker-dashboard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, UpperCasePipe, ReactiveFormsModule, MatIconModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      <!-- Facility Header & Intake Action -->
      <div class="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-lg shrink-0">
            <mat-icon class="!text-[28px] !w-[28px] !h-[28px]">medical_services</mat-icon>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h1 class="text-xl font-bold text-stone-900">Primary Healthcare Facility Dashboard</h1>
              <span class="text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200">
                Alimosho / Lagos PHC Cluster
              </span>
            </div>
            <p class="text-xs text-stone-600 mt-0.5">
              Continuous maternal risk monitoring, danger-sign triage queue, and CHEW dispatch log
            </p>
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <a
            routerLink="/mother/enrol"
            class="touch-target px-4 py-2.5 bg-[#C2410C] hover:bg-[#9A3412] text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-2"
          >
            <mat-icon class="!text-[16px] !w-[16px] !h-[16px]">person_add</mat-icon>
            <span>Register New Mother</span>
          </a>

          <button
            type="button"
            (click)="state.triggerPresetScenario('preeclampsia')"
            class="touch-target px-3.5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5"
          >
            <mat-icon class="!text-[16px] !w-[16px] !h-[16px] text-red-600">bolt</mat-icon>
            <span>Simulate Incoming Alert</span>
          </button>
        </div>
      </div>

      <!-- KPI Summary Cards Strip -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div class="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-sm space-y-1">
          <span class="text-xs font-semibold text-stone-500 uppercase tracking-wider block">Total Monitored</span>
          <div class="text-3xl font-extrabold text-stone-900 tabular-nums">
            {{ state.mothers().length }}
          </div>
          <span class="text-[11px] text-stone-500 block">Across 6 LGAs</span>
        </div>

        <div class="bg-red-50 p-4 sm:p-5 rounded-2xl border border-red-200 shadow-sm space-y-1">
          <span class="text-xs font-semibold text-red-700 uppercase tracking-wider block">Critical Red Alerts</span>
          <div class="text-3xl font-extrabold text-red-700 tabular-nums">
            {{ state.redAlertsCount() }}
          </div>
          <span class="text-[11px] text-red-600 font-medium block">Urgent intervention required</span>
        </div>

        <div class="bg-amber-50 p-4 sm:p-5 rounded-2xl border border-amber-200 shadow-sm space-y-1">
          <span class="text-xs font-semibold text-amber-800 uppercase tracking-wider block">Amber Warnings</span>
          <div class="text-3xl font-extrabold text-amber-800 tabular-nums">
            {{ state.amberAlertsCount() }}
          </div>
          <span class="text-[11px] text-amber-700 font-medium block">Watch within 4-6 hours</span>
        </div>

        <div class="bg-emerald-50 p-4 sm:p-5 rounded-2xl border border-emerald-200 shadow-sm space-y-1">
          <span class="text-xs font-semibold text-emerald-800 uppercase tracking-wider block">Routine Safe</span>
          <div class="text-3xl font-extrabold text-emerald-800 tabular-nums">
            {{ state.safeMothers().length }}
          </div>
          <span class="text-[11px] text-emerald-700 font-medium block">Normal check-in parameters</span>
        </div>

      </div>

      <!-- OPEN ALERTS TRIAGE INBOX (Top Priority Section) -->
      <div class="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
          <div>
            <div class="flex items-center gap-2">
              <h2 class="text-lg font-bold text-stone-900">Active Emergency & Danger-Sign Triage Queue</h2>
              @if (state.activeAlerts().length > 0) {
                <span class="text-xs font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-800">
                  {{ state.activeAlerts().length }} Active
                </span>
              }
            </div>
            <p class="text-xs text-stone-600">Prioritized cases requiring immediate clinical outreach or emergency triage</p>
          </div>
          <span class="text-xs text-stone-500 font-mono">WHO / Nigeria FMOH Protocol Grounding</span>
        </div>

        @if (state.activeAlerts().length === 0) {
          <div class="p-8 text-center bg-stone-50 rounded-xl border border-stone-200 text-stone-600 text-xs">
            <mat-icon class="text-emerald-600 !text-[32px] !w-[32px] !h-[32px] mb-2">task_alt</mat-icon>
            <p class="font-bold text-stone-800">Triage Queue Clear</p>
            <p>No unaddressed emergency alerts in this cluster right now.</p>
          </div>
        } @else {
          <div class="space-y-4">
            @for (alert of state.activeAlerts(); track alert.id) {
              <div 
                class="rounded-xl border p-5 transition-all space-y-4"
                [class.bg-red-50/70]="alert.riskLevel === 'red'"
                [class.border-red-300]="alert.riskLevel === 'red'"
                [class.bg-amber-50/70]="alert.riskLevel === 'amber'"
                [class.border-amber-300]="alert.riskLevel === 'amber'"
              >
                <!-- Card Header -->
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div class="flex items-center gap-2.5">
                    <span 
                      class="px-2 py-0.5 rounded text-[11px] font-black uppercase tracking-wider text-white"
                      [class.bg-red-600]="alert.riskLevel === 'red'"
                      [class.bg-amber-600]="alert.riskLevel === 'amber'"
                    >
                      {{ alert.riskLevel }} ALERT
                    </span>
                    <h3 class="text-base font-bold text-stone-900">
                      {{ alert.motherName }} ({{ alert.motherPhone }})
                    </h3>
                    <span class="text-xs text-stone-500 font-mono">ID: {{ alert.id }}</span>
                  </div>

                  <div class="flex items-center gap-2 text-xs text-stone-600">
                    <span>{{ alert.timestamp }}</span>
                    <span>·</span>
                    <span class="font-semibold text-stone-800">Status: {{ alert.status | uppercase }}</span>
                  </div>
                </div>

                <!-- Location & Symptoms -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div class="bg-white/80 p-3 rounded-lg border border-stone-200/80 space-y-1">
                    <span class="font-bold text-stone-800">Location Details:</span>
                    <p class="text-stone-700">{{ alert.locationDetails }} ({{ alert.lga }})</p>
                    <span class="font-bold text-stone-800 pt-1 block">Reported Danger Signs:</span>
                    <div class="flex flex-wrap gap-1.5 pt-0.5">
                      @for (s of alert.symptoms; track s) {
                        <span class="font-semibold text-red-800 bg-red-100 px-2 py-0.5 rounded text-[11px]">
                          {{ s }}
                        </span>
                      }
                    </div>
                  </div>

                  <!-- Recommended Clinical Action Protocol -->
                  <div class="bg-white/90 p-3 rounded-lg border border-stone-200/80 space-y-1">
                    <span class="font-bold text-[#C2410C] flex items-center gap-1">
                      <mat-icon class="!text-[14px] !w-[14px] !h-[14px]">local_pharmacy</mat-icon>
                      <span>Recommended Clinical Protocol:</span>
                    </span>
                    <p class="text-stone-800 font-medium leading-relaxed">
                      {{ alert.clinicalProtocolRecommendation }}
                    </p>
                  </div>
                </div>

                <!-- Response History -->
                @if (alert.responseLogs.length > 0) {
                  <div class="bg-stone-100/80 p-2.5 rounded-lg text-[11px] font-mono text-stone-700 space-y-1">
                    <span class="font-bold uppercase tracking-wider text-stone-500">Activity Log:</span>
                    @for (log of alert.responseLogs; track log.timestamp) {
                      <div>
                        [{{ log.timestamp }}] <strong class="text-stone-900">{{ log.actor }}</strong>: {{ log.action }} - {{ log.notes }}
                      </div>
                    }
                  </div>
                }

                <!-- Action Toolbar for Health Worker -->
                <div class="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-stone-200/60">
                  <div class="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      (click)="logAction(alert.id, 'Nurse Folake (PHC)', 'Phone outreach performed. Mother instructions given.')"
                      class="touch-target px-3 py-1.5 bg-stone-900 hover:bg-black text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                    >
                      <mat-icon class="!text-[14px] !w-[14px] !h-[14px]">call</mat-icon>
                      <span>Log Call to Mother</span>
                    </button>

                    <button
                      type="button"
                      (click)="dispatchChew(alert.id)"
                      class="touch-target px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                    >
                      <mat-icon class="!text-[14px] !w-[14px] !h-[14px]">home_health</mat-icon>
                      <span>Dispatch CHEW Home Visit</span>
                    </button>

                    <button
                      type="button"
                      (click)="dispatchAmbulance(alert.id)"
                      class="touch-target px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                    >
                      <mat-icon class="!text-[14px] !w-[14px] !h-[14px]">electric_rickshaw</mat-icon>
                      <span>Dispatch Tricycle Ambulance</span>
                    </button>
                  </div>

                  <div class="flex items-center gap-2">
                    <button
                      type="button"
                      (click)="openResolvePrompt(alert.id)"
                      class="touch-target px-4 py-1.5 bg-white border border-stone-300 hover:border-emerald-600 text-stone-800 hover:text-emerald-800 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                    >
                      <mat-icon class="!text-[14px] !w-[14px] !h-[14px] text-emerald-600">check_circle</mat-icon>
                      <span>Mark Case Resolved</span>
                    </button>
                  </div>
                </div>

              </div>
            }
          </div>
        }
      </div>

      <!-- MOTHERS REGISTRY TABLE -->
      <div class="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-4">
        
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
          <div>
            <h2 class="text-base font-bold text-stone-900">Enrolled Mothers Directory</h2>
            <p class="text-xs text-stone-600">Real-time surveillance of pregnant and postpartum women</p>
          </div>

          <!-- Filters -->
          <div class="flex flex-wrap items-center gap-2">
            <!-- Search -->
            <input
              type="text"
              [value]="searchQuery()"
              (input)="onSearchInput($event)"
              placeholder="Search name or LGA..."
              class="touch-target text-xs p-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#C2410C]"
            />

            <!-- Risk Filter -->
            <select
              [value]="selectedRiskFilter()"
              (change)="onRiskFilterChange($event)"
              class="touch-target text-xs p-2 rounded-xl border border-stone-300 bg-white font-medium"
            >
              <option value="all">All Risks</option>
              <option value="red">Red Alerts Only</option>
              <option value="amber">Amber Warnings Only</option>
              <option value="green">Green Safe Only</option>
            </select>
          </div>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-stone-50 text-stone-600 font-semibold border-b border-stone-200">
              <tr>
                <th class="py-3 px-4">Status</th>
                <th class="py-3 px-4">Mother Name</th>
                <th class="py-3 px-4">Stage</th>
                <th class="py-3 px-4">LGA & Ward</th>
                <th class="py-3 px-4">Nominated Family</th>
                <th class="py-3 px-4">Last Check-in</th>
                <th class="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-stone-100 text-stone-800">
              @for (mom of filteredMothers(); track mom.id) {
                <tr class="hover:bg-stone-50/80 transition-colors">
                  
                  <!-- Status Column -->
                  <td class="py-3 px-4 whitespace-nowrap">
                    @if (mom.riskLevel === 'red') {
                      <span class="inline-flex items-center gap-1 font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded text-[11px]">
                        <mat-icon class="!text-[12px] !w-[12px] !h-[12px]">warning</mat-icon>
                        RED ALERT
                      </span>
                    } @else if (mom.riskLevel === 'amber') {
                      <span class="inline-flex items-center gap-1 font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded text-[11px]">
                        <mat-icon class="!text-[12px] !w-[12px] !h-[12px]">info</mat-icon>
                        AMBER
                      </span>
                    } @else {
                      <span class="inline-flex items-center gap-1 font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded text-[11px]">
                        <mat-icon class="!text-[12px] !w-[12px] !h-[12px]">check</mat-icon>
                        SAFE
                      </span>
                    }
                  </td>

                  <!-- Name -->
                  <td class="py-3 px-4 font-bold text-stone-900 whitespace-nowrap">
                    <div>{{ mom.fullName }}</div>
                    <div class="text-[11px] font-mono text-stone-500">{{ mom.phoneNumber }}</div>
                  </td>

                  <!-- Stage -->
                  <td class="py-3 px-4 whitespace-nowrap">
                    @if (mom.isPostpartum) {
                      <span class="text-blue-800 font-medium">Postpartum Day {{ mom.postpartumDays }}</span>
                    } @else {
                      <span class="text-stone-700">Pregnant: Week {{ mom.gestationalWeeks }}</span>
                    }
                    <div class="text-[11px] text-stone-500">{{ mom.parity }}</div>
                  </td>

                  <!-- LGA & Location -->
                  <td class="py-3 px-4">
                    <div class="font-medium">{{ mom.lga }}, {{ mom.state }}</div>
                    <div class="text-[11px] text-stone-500 truncate max-w-[180px]">{{ mom.wardOrCommunity }}</div>
                  </td>

                  <!-- Family Support -->
                  <td class="py-3 px-4">
                    <div class="font-medium">{{ mom.nominatedSupportPerson.name }}</div>
                    <div class="text-[11px] text-stone-500">
                      {{ mom.nominatedSupportPerson.relationship }} ({{ mom.nominatedSupportPerson.phone }})
                    </div>
                  </td>

                  <!-- Last Check-in -->
                  <td class="py-3 px-4 whitespace-nowrap text-stone-600">
                    {{ mom.lastCheckInDate || 'Never' }}
                  </td>

                  <!-- Actions -->
                  <td class="py-3 px-4 text-right whitespace-nowrap">
                    <button
                      type="button"
                      (click)="viewMother(mom.id)"
                      class="touch-target px-3 py-1.5 text-xs font-semibold text-[#C2410C] hover:bg-orange-50 rounded-lg transition-colors"
                    >
                      Open Case
                    </button>
                  </td>

                </tr>
              }
            </tbody>
          </table>
        </div>

      </div>

    </div>
  `
})
export class HealthWorkerDashboard {
  readonly state = inject(MaternalStateService);
  
  readonly searchQuery = signal('');
  readonly selectedRiskFilter = signal<'all' | 'green' | 'amber' | 'red'>('all');

  readonly filteredMothers = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const risk = this.selectedRiskFilter();

    return this.state.mothers().filter(m => {
      const matchesSearch = !query || 
        m.fullName.toLowerCase().includes(query) ||
        m.lga.toLowerCase().includes(query) ||
        m.state.toLowerCase().includes(query) ||
        m.phoneNumber.includes(query);

      const matchesRisk = risk === 'all' || m.riskLevel === risk;
      return matchesSearch && matchesRisk;
    });
  });

  readonly router = inject(Router);

  onSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
  }

  onRiskFilterChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedRiskFilter.set(select.value as 'all' | 'green' | 'amber' | 'red');
  }

  viewMother(motherId: string): void {
    this.state.setActiveMother(motherId);
    this.router.navigate(['/mother']);
  }

  logAction(alertId: string, actor: string, notes: string): void {
    this.state.acknowledgeAlert(alertId, actor, notes);
  }

  dispatchChew(alertId: string): void {
    this.state.acknowledgeAlert(alertId, 'PHC Midwife Coordinator', 'Dispatched Community Health Extension Worker (CHEW) for immediate home assessment with maternal blood pressure kit.');
  }

  dispatchAmbulance(alertId: string): void {
    this.state.dispatchTransport(alertId, 'tricycle_ambulance', 'PHC Dispatcher');
  }

  openResolvePrompt(alertId: string): void {
    const notes = prompt('Enter clinical resolution notes (e.g., Patient evaluated at PHC, BP stabilized with oral Nifedipine):', 'Mother arrived at PHC, stable vitals, baby feeding well.');
    if (notes) {
      this.state.resolveAlert(alertId, 'Dr. Adeleke (PHC Medical Officer)', notes);
    }
  }
}
