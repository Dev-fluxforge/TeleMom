import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MaternalStateService } from '../../core/services/maternal-state.service';

@Component({
  selector: 'app-broadcast-toast',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule],
  template: `
    @if (state.recentBroadcast(); as broadcast) {
      <div class="fixed bottom-4 right-4 z-50 max-w-sm w-full animate-slide-up">
        <div class="bg-stone-900 text-white rounded-2xl p-4 shadow-2xl border border-stone-700/80 space-y-2">
          
          <div class="flex items-center justify-between text-xs text-stone-400">
            <div class="flex items-center gap-1.5 font-semibold tracking-wider text-amber-400">
              @if (broadcast.type === 'sms') {
                <mat-icon class="!text-[16px] !w-[16px] !h-[16px]">sms</mat-icon>
              } @else if (broadcast.type === 'call') {
                <mat-icon class="!text-[16px] !w-[16px] !h-[16px]">ring_volume</mat-icon>
              } @else if (broadcast.type === 'dispatch') {
                <mat-icon class="!text-[16px] !w-[16px] !h-[16px]">local_shipping</mat-icon>
              } @else {
                <mat-icon class="!text-[16px] !w-[16px] !h-[16px]">info</mat-icon>
              }
              <span>{{ broadcast.title }}</span>
            </div>
            <span>{{ broadcast.timestamp }}</span>
          </div>

          <div class="text-xs text-stone-300 font-medium">
            <span class="text-stone-400">Recipient:</span> {{ broadcast.recipient }}
          </div>

          <p class="text-xs text-white leading-relaxed bg-stone-800/80 p-2.5 rounded-xl border border-stone-700/50">
            {{ broadcast.message }}
          </p>

          <div class="flex justify-end pt-1">
            <button
              type="button"
              (click)="state.dismissBroadcast()"
              class="text-[11px] font-semibold text-stone-400 hover:text-white px-2 py-1 rounded"
            >
              Dismiss
            </button>
          </div>

        </div>
      </div>
    }
  `
})
export class BroadcastToast {
  readonly state = inject(MaternalStateService);
}
