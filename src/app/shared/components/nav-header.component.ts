import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MaternalStateService } from '../../core/services/maternal-state.service';
import { PitchGuideModal } from './pitch-guide-modal.component';

@Component({
  selector: 'app-nav-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, MatIconModule, PitchGuideModal],
  template: `
    <header class="sticky top-0 z-40 bg-[#F7F1E9]/95 backdrop-blur-md border-b border-[#E8DEC8]">
      <div class="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 py-3.5">
        <!-- Zone 1: Single Text Wordmark -->
        <a routerLink="/" class="flex items-center gap-2.5 whitespace-nowrap shrink-0 text-[#18181B] group">
          <div class="w-8 h-8 rounded-lg bg-[#C2410C] text-white flex items-center justify-center font-bold shadow-sm group-hover:bg-[#9A3412] transition-colors">
            <mat-icon class="!text-[20px] !w-[20px] !h-[20px]">pregnant_woman</mat-icon>
          </div>
          <span class="text-xl font-bold tracking-tight text-[#18181B]">Telemama</span>
        </a>

        <!-- Zone 2: 4-5 single-line clean nav links -->
        <nav class="hidden md:flex items-center gap-6 text-sm font-medium text-stone-700">
          <a
            routerLink="/"
            routerLinkActive="text-[#C2410C] font-semibold"
            [routerLinkActiveOptions]="{ exact: true }"
            class="hover:text-[#C2410C] transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <mat-icon class="!text-[18px] !w-[18px] !h-[18px]">home</mat-icon>
            Home
          </a>
          <a
            routerLink="/mother"
            routerLinkActive="text-[#C2410C] font-semibold"
            class="hover:text-[#C2410C] transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <mat-icon class="!text-[18px] !w-[18px] !h-[18px]">favorite</mat-icon>
            Mother Portal
          </a>
          <a
            routerLink="/family"
            routerLinkActive="text-[#C2410C] font-semibold"
            class="hover:text-[#C2410C] transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <mat-icon class="!text-[18px] !w-[18px] !h-[18px]">family_restroom</mat-icon>
            Family Support
          </a>
          <a
            routerLink="/health-worker"
            routerLinkActive="text-[#C2410C] font-semibold"
            class="hover:text-[#C2410C] transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 relative"
          >
            <mat-icon class="!text-[18px] !w-[18px] !h-[18px]">medical_services</mat-icon>
            Facility Dashboard
            @if (state.redAlertsCount() > 0) {
              <span class="w-2 h-2 rounded-full bg-red-600"></span>
            }
          </a>
          <a
            routerLink="/ussd"
            routerLinkActive="text-[#C2410C] font-semibold"
            class="hover:text-[#C2410C] transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 text-stone-600"
          >
            <mat-icon class="!text-[18px] !w-[18px] !h-[18px]">dialpad</mat-icon>
            USSD (*384*26#)
          </a>
        </nav>

        <!-- Zone 3: 1 primary action -->
        <div class="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            (click)="showPitchGuide.set(true)"
            class="touch-target px-3.5 py-2 text-xs font-semibold text-white bg-[#C2410C] hover:bg-[#9A3412] active:scale-[0.98] rounded-xl transition-all shadow-sm flex items-center gap-1.5 whitespace-nowrap shrink-0"
            aria-label="Open 3-Minute Hackathon Pitch Guide"
          >
            <mat-icon class="!text-[16px] !w-[16px] !h-[16px]">play_circle</mat-icon>
            <span>3-Min Demo Guide</span>
          </button>
        </div>
      </div>

      <!-- Mobile Navigation Secondary Strip (Horizontal single-row for small screens) -->
      <div class="md:hidden flex items-center justify-between px-3 py-2 border-t border-[#E8DEC8] bg-[#F3ECE1] text-xs font-medium overflow-x-auto gap-4">
        <a routerLink="/" routerLinkActive="text-[#C2410C] font-bold" [routerLinkActiveOptions]="{ exact: true }" class="whitespace-nowrap px-2 py-1">Home</a>
        <a routerLink="/mother" routerLinkActive="text-[#C2410C] font-bold" class="whitespace-nowrap px-2 py-1">Mother</a>
        <a routerLink="/family" routerLinkActive="text-[#C2410C] font-bold" class="whitespace-nowrap px-2 py-1">Family</a>
        <a routerLink="/health-worker" routerLinkActive="text-[#C2410C] font-bold" class="whitespace-nowrap px-2 py-1">PHC Clinic</a>
        <a routerLink="/ussd" routerLinkActive="text-[#C2410C] font-bold" class="whitespace-nowrap px-2 py-1 font-mono">*384*26#</a>
      </div>
    </header>

    @if (showPitchGuide()) {
      <app-pitch-guide-modal (closeModal)="showPitchGuide.set(false)" />
    }
  `
})
export class NavHeader {
  readonly state = inject(MaternalStateService);
  readonly router = inject(Router);
  readonly showPitchGuide = signal(false);
}
