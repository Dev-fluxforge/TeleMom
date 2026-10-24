import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavHeader } from './shared/components/nav-header.component';
import { BroadcastToast } from './shared/components/broadcast-toast.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  imports: [RouterOutlet, NavHeader, BroadcastToast],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
