import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MaternalStateService, NIGERIAN_LOCATIONS } from '../../core/services/maternal-state.service';

@Component({
  selector: 'app-mother-enrolment',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, ReactiveFormsModule, MatIconModule],
  template: `
    <div class="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      
      <div class="flex items-center gap-3">
        <a routerLink="/mother" class="touch-target p-2 rounded-xl border border-stone-200 hover:bg-stone-100 text-stone-700 transition-colors">
          <mat-icon>arrow_back</mat-icon>
        </a>
        <div>
          <h1 class="text-2xl font-extrabold text-stone-900">Enrol New Mother in Telemama</h1>
          <p class="text-xs text-stone-600">Takes under 2 minutes. Enables 24/7 continuous health tracking and rapid emergency alerts.</p>
        </div>
      </div>

      <div class="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-sm">
        
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-6">
          
          <!-- Section 1: Mother Details -->
          <div class="space-y-4">
            <h2 class="text-sm font-bold text-[#C2410C] tracking-wide uppercase flex items-center gap-2">
              <mat-icon class="!text-[18px] !w-[18px] !h-[18px]">person</mat-icon>
              <span>1. Mother's Personal Details</span>
            </h2>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label for="fullName" class="block text-xs font-semibold text-stone-800">Full Name *</label>
                <input
                  id="fullName"
                  type="text"
                  formControlName="fullName"
                  placeholder="e.g. Maryam Yakubu"
                  class="touch-target mt-1 w-full text-xs p-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#C2410C]"
                />
              </div>

              <div>
                <label for="phoneNumber" class="block text-xs font-semibold text-stone-800">Phone Number (MTN / Airtel / Glo) *</label>
                <input
                  id="phoneNumber"
                  type="tel"
                  formControlName="phoneNumber"
                  placeholder="e.g. 0803 123 4567"
                  class="touch-target mt-1 w-full text-xs p-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#C2410C]"
                />
              </div>

              <div>
                <label for="age" class="block text-xs font-semibold text-stone-800">Age *</label>
                <input
                  id="age"
                  type="number"
                  formControlName="age"
                  placeholder="e.g. 25"
                  class="touch-target mt-1 w-full text-xs p-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#C2410C]"
                />
              </div>

              <div>
                <label for="parity" class="block text-xs font-semibold text-stone-800">Pregnancy History (Parity)</label>
                <input
                  id="parity"
                  type="text"
                  formControlName="parity"
                  placeholder="e.g. G2 P1 (2nd pregnancy)"
                  class="touch-target mt-1 w-full text-xs p-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#C2410C]"
                />
              </div>
            </div>
          </div>

          <!-- Section 2: Pregnancy or Postpartum Status -->
          <div class="space-y-4 border-t border-stone-200 pt-5">
            <h2 class="text-sm font-bold text-[#C2410C] tracking-wide uppercase flex items-center gap-2">
              <mat-icon class="!text-[18px] !w-[18px] !h-[18px]">child_care</mat-icon>
              <span>2. Maternal Stage</span>
            </h2>

            <div class="flex items-center gap-4">
              <label class="flex items-center gap-2 text-xs font-medium text-stone-800 cursor-pointer">
                <input
                  type="radio"
                  [value]="false"
                  formControlName="isPostpartum"
                  class="text-[#C2410C] focus:ring-[#C2410C]"
                />
                <span>Currently Pregnant</span>
              </label>

              <label class="flex items-center gap-2 text-xs font-medium text-stone-800 cursor-pointer">
                <input
                  type="radio"
                  [value]="true"
                  formControlName="isPostpartum"
                  class="text-[#C2410C] focus:ring-[#C2410C]"
                />
                <span>Postpartum (Baby Born)</span>
              </label>
            </div>

            @if (form.get('isPostpartum')?.value === false) {
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label for="gestationalWeeks" class="block text-xs font-semibold text-stone-800">Gestational Weeks (e.g. 32) *</label>
                  <input
                    id="gestationalWeeks"
                    type="number"
                    formControlName="gestationalWeeks"
                    placeholder="e.g. 30"
                    class="touch-target mt-1 w-full text-xs p-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#C2410C]"
                  />
                </div>
                <div>
                  <label for="edd" class="block text-xs font-semibold text-stone-800">Expected Delivery Date (EDD) *</label>
                  <input
                    id="edd"
                    type="date"
                    formControlName="eddOrDeliveryDate"
                    class="touch-target mt-1 w-full text-xs p-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#C2410C]"
                  />
                </div>
              </div>
            } @else {
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label for="deliveryDate" class="block text-xs font-semibold text-stone-800">Baby Delivery Date *</label>
                  <input
                    id="deliveryDate"
                    type="date"
                    formControlName="eddOrDeliveryDate"
                    class="touch-target mt-1 w-full text-xs p-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#C2410C]"
                  />
                </div>
                <div>
                  <label for="babyName" class="block text-xs font-semibold text-stone-800">Baby's Name</label>
                  <input
                    id="babyName"
                    type="text"
                    formControlName="babyName"
                    placeholder="e.g. Baby Kemi"
                    class="touch-target mt-1 w-full text-xs p-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#C2410C]"
                  />
                </div>
              </div>
            }
          </div>

          <!-- Section 3: Location & Healthcare Center -->
          <div class="space-y-4 border-t border-stone-200 pt-5">
            <h2 class="text-sm font-bold text-[#C2410C] tracking-wide uppercase flex items-center gap-2">
              <mat-icon class="!text-[18px] !w-[18px] !h-[18px]">location_on</mat-icon>
              <span>3. Location & Primary Health Center</span>
            </h2>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label for="state" class="block text-xs font-semibold text-stone-800">State *</label>
                <select
                  id="state"
                  formControlName="state"
                  (change)="onStateChange()"
                  class="touch-target mt-1 w-full text-xs p-3 rounded-xl border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#C2410C]"
                >
                  @for (loc of locations; track loc.state) {
                    <option [value]="loc.state">{{ loc.state }} State</option>
                  }
                </select>
              </div>

              <div>
                <label for="lga" class="block text-xs font-semibold text-stone-800">Local Government Area (LGA) *</label>
                <select
                  id="lga"
                  formControlName="lga"
                  class="touch-target mt-1 w-full text-xs p-3 rounded-xl border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#C2410C]"
                >
                  @for (lga of currentLgas(); track lga) {
                    <option [value]="lga">{{ lga }} LGA</option>
                  }
                </select>
              </div>

              <div class="sm:col-span-2">
                <label for="wardOrCommunity" class="block text-xs font-semibold text-stone-800">Ward / Community / Landmark Address *</label>
                <input
                  id="wardOrCommunity"
                  type="text"
                  formControlName="wardOrCommunity"
                  placeholder="e.g. Egbeda Market / Near Central Mosque"
                  class="touch-target mt-1 w-full text-xs p-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#C2410C]"
                />
              </div>

              <div class="sm:col-span-2">
                <label for="primaryHealthCenter" class="block text-xs font-semibold text-stone-800">Assigned Primary Health Center (PHC) *</label>
                <select
                  id="primaryHealthCenter"
                  formControlName="primaryHealthCenter"
                  class="touch-target mt-1 w-full text-xs p-3 rounded-xl border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#C2410C]"
                >
                  @for (fac of currentFacilities(); track fac) {
                    <option [value]="fac">{{ fac }}</option>
                  }
                </select>
              </div>
            </div>
          </div>

          <!-- Section 4: Nominated Family Support Person -->
          <div class="space-y-4 border-t border-stone-200 pt-5">
            <div class="flex items-center justify-between">
              <h2 class="text-sm font-bold text-[#C2410C] tracking-wide uppercase flex items-center gap-2">
                <mat-icon class="!text-[18px] !w-[18px] !h-[18px]">family_restroom</mat-icon>
                <span>4. Nominated Family Support Person</span>
              </h2>
            </div>
            <p class="text-xs text-stone-600">
              This person receives immediate SMS and automated phone calls when danger signs are reported or emergency SOS is triggered.
            </p>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label for="supportName" class="block text-xs font-semibold text-stone-800">Full Name *</label>
                <input
                  id="supportName"
                  type="text"
                  formControlName="supportName"
                  placeholder="e.g. Ibrahim Yakubu"
                  class="touch-target mt-1 w-full text-xs p-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#C2410C]"
                />
              </div>

              <div>
                <label for="supportPhone" class="block text-xs font-semibold text-stone-800">Phone Number *</label>
                <input
                  id="supportPhone"
                  type="tel"
                  formControlName="supportPhone"
                  placeholder="e.g. 0802 987 6543"
                  class="touch-target mt-1 w-full text-xs p-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#C2410C]"
                />
              </div>

              <div>
                <label for="supportRelation" class="block text-xs font-semibold text-stone-800">Relationship *</label>
                <select
                  id="supportRelation"
                  formControlName="supportRelation"
                  class="touch-target mt-1 w-full text-xs p-3 rounded-xl border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#C2410C]"
                >
                  <option value="Husband">Husband</option>
                  <option value="Mother">Mother</option>
                  <option value="Mother-in-law">Mother-in-law</option>
                  <option value="Sister">Sister</option>
                  <option value="Neighbor">Neighbor</option>
                  <option value="Other">Other Family</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Submit Button -->
          <div class="pt-4 border-t border-stone-200 flex items-center justify-end gap-3">
            <a
              routerLink="/mother"
              class="touch-target px-5 py-3 text-xs font-semibold text-stone-600 hover:text-stone-900"
            >
              Cancel
            </a>
            <button
              type="submit"
              [disabled]="form.invalid"
              class="touch-target px-8 py-3.5 bg-[#C2410C] hover:bg-[#9A3412] active:scale-[0.98] disabled:opacity-50 text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-2"
            >
              <mat-icon class="!text-[18px] !w-[18px] !h-[18px]">how_to_reg</mat-icon>
              <span>Complete Enrolment</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  `
})
export class MotherEnrolmentComponent {
  readonly state = inject(MaternalStateService);
  readonly router = inject(Router);
  readonly locations = NIGERIAN_LOCATIONS;

  readonly currentLgas = signal<string[]>(NIGERIAN_LOCATIONS[0].lgas);
  readonly currentFacilities = signal<string[]>(NIGERIAN_LOCATIONS[0].facilities);

  readonly form = new FormGroup({
    fullName: new FormControl('', [Validators.required]),
    phoneNumber: new FormControl('', [Validators.required]),
    age: new FormControl<number>(24, [Validators.required, Validators.min(14), Validators.max(55)]),
    parity: new FormControl('G1 P0'),
    isPostpartum: new FormControl(false),
    gestationalWeeks: new FormControl<number>(30),
    eddOrDeliveryDate: new FormControl('2026-12-15', [Validators.required]),
    babyName: new FormControl(''),
    state: new FormControl(NIGERIAN_LOCATIONS[0].state, [Validators.required]),
    lga: new FormControl(NIGERIAN_LOCATIONS[0].lgas[0], [Validators.required]),
    wardOrCommunity: new FormControl('', [Validators.required]),
    primaryHealthCenter: new FormControl(NIGERIAN_LOCATIONS[0].facilities[0], [Validators.required]),
    supportName: new FormControl('', [Validators.required]),
    supportPhone: new FormControl('', [Validators.required]),
    supportRelation: new FormControl<'Husband' | 'Mother' | 'Mother-in-law' | 'Sister' | 'Neighbor' | 'Other'>('Husband', [Validators.required])
  });

  onStateChange(): void {
    const selectedState = this.form.get('state')?.value;
    const match = this.locations.find(l => l.state === selectedState);
    if (match) {
      this.currentLgas.set(match.lgas);
      this.currentFacilities.set(match.facilities);
      this.form.patchValue({
        lga: match.lgas[0],
        primaryHealthCenter: match.facilities[0]
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const val = this.form.value;
    this.state.registerMother({
      fullName: val.fullName!,
      phoneNumber: val.phoneNumber!,
      age: Number(val.age) || 24,
      state: val.state!,
      lga: val.lga!,
      wardOrCommunity: val.wardOrCommunity!,
      parity: val.parity || 'G1 P0',
      isPostpartum: !!val.isPostpartum,
      gestationalWeeks: val.isPostpartum ? undefined : Number(val.gestationalWeeks) || 30,
      postpartumDays: val.isPostpartum ? 1 : undefined,
      eddOrDeliveryDate: val.eddOrDeliveryDate!,
      babyName: val.babyName || undefined,
      nominatedSupportPerson: {
        name: val.supportName!,
        phone: val.supportPhone!,
        relationship: val.supportRelation!
      },
      primaryHealthCenter: val.primaryHealthCenter!
    });

    this.router.navigate(['/mother']);
  }
}
