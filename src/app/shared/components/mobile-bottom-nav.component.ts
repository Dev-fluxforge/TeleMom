import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MaternalStateService } from '../../core/services/maternal-state.service';

@Component({
  selector: 'app-mobile-bottom-nav',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, MatIconModule],
  template: `
    <!-- Fixed Bottom Thumb-Zone Navigation for Mobile Viewports (Pattern 1 from 10_mobile_touch_apps.md) -->
    <nav class="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E8DEC8] shadow-lg px-2 pb-safe">
      <div class="grid grid-cols-5 items-center h-16">
        
        <!-- Tab 1: Home -->
        <a
          routerLink="/"
          routerLinkActive="text-[#C2410C]"
          [routerLinkActiveOptions]="{ exact: true }"
          class="flex flex-col items-center justify-center h-full text-stone-600 hover:text-[#C2410C] transition-colors relative"
        >
          <mat-icon class="!text-[22px] !w-[22px] !h-[22px]">home</mat-icon>
          <span class="text-[10px] font-semibold tracking-tight mt-0.5">Home</span>
        </a>

        <!-- Tab 2: Mother -->
        <a
          routerLink="/mother"
          routerLinkActive="text-[#C2410C]"
          class="flex flex-col items-center justify-center h-full text-stone-600 hover:text-[#C2410C] transition-colors relative"
        >
          <mat-icon class="!text-[22px] !w-[22px] !h-[22px]">pregnant_woman</mat-icon>
          <span class="text-[10px] font-semibold tracking-tight mt-0.5">Mother</span>
        </a>

        <!-- Tab 3: Family -->
        <a
          routerLink="/family"
          routerLinkActive="text-[#C2410C]"
          class="flex flex-col items-center justify-center h-full text-stone-600 hover:text-[#C2410C] transition-colors relative"
        >
          <mat-icon class="!text-[22px] !w-[22px] !h-[22px]">family_restroom</mat-icon>
          <span class="text-[10px] font-semibold tracking-tight mt-0.5">Family</span>
        </a>

        <!-- Tab 4: Health Worker / PHC -->
        <a
          routerLink="/health-worker"
          routerLinkActive="text-[#C2410C]"
          class="flex flex-col items-center justify-center h-full text-stone-600 hover:text-[#C2410C] transition-colors relative"
        >
          <div class="relative">
            <mat-icon class="!text-[22px] !w-[22px] !h-[22px]">medical_services</mat-icon>
            @if (state.redAlertsCount() > 0) {
              <span class="absolute -top-0.5 -right-1 w-2 h-2 rounded-full bg-red-600 ring-2 ring-white"></span>
            }
          </div>
          <span class="text-[10px] font-semibold tracking-tight mt-0.5">PHC Clinic</span>
        </a>

        <!-- Tab 5: USSD Feature Phone -->
        <a
          routerLink="/ussd"
          routerLinkActive="text-[#C2410C]"
          class="flex flex-col items-center justify-center h-full text-stone-600 hover:text-[#C2410C] transition-colors relative"
        >
          <mat-icon class="!text-[22px] !w-[22px] !h-[22px]">dialpad</mat-icon>
          <span class="text-[10px] font-semibold font-mono tracking-tight mt-0.5">*384#</span>
        </a>

      </div>
    </nav>
  `
})
export class MobileBottomNav {
  readonly state = inject(MaternalStateService);
}
