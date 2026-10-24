import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { TelemamaApiService } from './core/services/telemama-api.service';
import { PatientPayload } from './core/models/telemama.models';

export interface AlertDetails {
  id?: number | string;
  name?: string;
  phone?: string;
  landmark?: string;
  weeks_pregnant?: number;
  recipient?: string;
  timeoutSeconds?: number;
  sessionId?: number | string;
  sessionStatus?: string;
  smsSimulated?: boolean;
}

export interface ActionAlert {
  type: 'success' | 'error';
  message: string;
  details?: AlertDetails | null;
  timestamp: string;
}

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, FormsModule, MatIconModule],
  templateUrl: './app.component.html',
  styleUrl: './app.css',
})
export class App {
  private readonly telemamaApi = inject(TelemamaApiService);

  // --- Registration Form State ---
  readonly isRegistering = signal(false);
  readonly registrationAlert = signal<ActionAlert | null>(null);

  readonly registrationForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    phone: new FormControl('', [Validators.required]),
    weeks_pregnant: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(1),
      Validators.max(42)
    ]),
    landmark: new FormControl('', [Validators.required]),
    ward_phone: new FormControl('+2348091112222', [Validators.required]),
    companion_name: new FormControl('', [Validators.required]),
    companion_phone: new FormControl('', [Validators.required]),
    family_phone: new FormControl('', [Validators.required]),
  });

  // --- Demo Actions Panel State ---
  readonly demoPhone = signal('');
  readonly isTriggeringCheckup = signal(false);
  readonly isTriggeringWeek36 = signal(false);
  readonly demoAlert = signal<ActionAlert | null>(null);

  // Clear form
  clearForm(): void {
    this.registrationForm.reset({
      name: '',
      phone: '',
      weeks_pregnant: null,
      landmark: '',
      ward_phone: '+2348091112222',
      companion_name: '',
      companion_phone: '',
      family_phone: ''
    });
    this.registrationAlert.set(null);
  }

  // --- Submit Registration ---
  onRegisterPatient(): void {
    if (this.registrationForm.invalid || this.isRegistering()) {
      this.registrationForm.markAllAsTouched();
      return;
    }

    const val = this.registrationForm.getRawValue();
    this.isRegistering.set(true);
    this.registrationAlert.set(null);

    const payload: PatientPayload = {
      name: val.name!.trim(),
      phone: val.phone!.trim(),
      landmark: val.landmark!.trim(),
      ward_phone: val.ward_phone!.trim(),
      companion_name: val.companion_name!.trim(),
      companion_phone: val.companion_phone!.trim(),
      family_phone: val.family_phone!.trim(),
      weeks_pregnant: Number(val.weeks_pregnant) || 0
    };

    this.telemamaApi.registerPatient(payload).subscribe({
      next: (response) => {
        this.isRegistering.set(false);
        const registeredName = response.data?.name || payload.name;
        const registeredPhone = response.data?.phone || payload.phone;

        this.registrationAlert.set({
          type: 'success',
          message: `${registeredName} registered successfully (${registeredPhone})`,
          details: {
            id: response.data?.id,
            name: registeredName,
            phone: registeredPhone,
            landmark: response.data?.landmark || payload.landmark,
            weeks_pregnant: response.data?.weeks_pregnant || payload.weeks_pregnant
          },
          timestamp: new Date().toLocaleTimeString()
        });

        // Automatically populate patient phone into Demo Panel
        this.demoPhone.set(registeredPhone);
      },
      error: (err: HttpErrorResponse | Error) => {
        this.isRegistering.set(false);
        const message = this.extractErrorMessage(err, 'Failed to save patient. Please check connection.');
        this.registrationAlert.set({
          type: 'error',
          message,
          timestamp: new Date().toLocaleTimeString()
        });
      }
    });
  }

  // --- Trigger Demo Checkup (POST /api/demo/checkup/:phone) ---
  onTriggerDailyCheckup(): void {
    const phone = this.demoPhone().trim();
    if (!phone) {
      this.demoAlert.set({
        type: 'error',
        message: 'Enter a registered patient phone number.',
        timestamp: new Date().toLocaleTimeString()
      });
      return;
    }

    this.isTriggeringCheckup.set(true);
    this.demoAlert.set(null);

    this.telemamaApi.triggerCheckup(phone).subscribe({
      next: (response) => {
        this.isTriggeringCheckup.set(false);
        const sessionObj = response.session as { id?: number; status?: string } | undefined;
        const isSmsFailed = response.sms?.success === false;
        this.demoAlert.set({
          type: isSmsFailed ? 'error' : 'success',
          message: response.warning || response.message || 'Daily checkup dispatched (20s escalation timer started).',
          details: {
            sessionId: sessionObj?.id,
            sessionStatus: sessionObj?.status,
            timeoutSeconds: response.timeoutSeconds ?? 20,
            smsSimulated: false
          },
          timestamp: new Date().toLocaleTimeString()
        });
      },
      error: (err: HttpErrorResponse | Error) => {
        this.isTriggeringCheckup.set(false);
        const message = this.extractErrorMessage(err, 'Checkup trigger failed.');
        this.demoAlert.set({
          type: 'error',
          message,
          timestamp: new Date().toLocaleTimeString()
        });
      }
    });
  }

  // --- Trigger Week 36 Companion Alert (POST /api/demo/week36/:phone) ---
  onTriggerWeek36Alert(): void {
    const phone = this.demoPhone().trim();
    if (!phone) {
      this.demoAlert.set({
        type: 'error',
        message: 'Enter a registered patient phone number.',
        timestamp: new Date().toLocaleTimeString()
      });
      return;
    }

    this.isTriggeringWeek36.set(true);
    this.demoAlert.set(null);

    this.telemamaApi.triggerWeek36Alert(phone).subscribe({
      next: (response) => {
        this.isTriggeringWeek36.set(false);
        const isFailed = response.success === false || response.sms?.success === false;
        this.demoAlert.set({
          type: isFailed ? 'error' : 'success',
          message: response.error || response.message || 'Week-36 companion alert sent.',
          details: {
            recipient: response.recipient,
            smsSimulated: false
          },
          timestamp: new Date().toLocaleTimeString()
        });
      },
      error: (err: HttpErrorResponse | Error) => {
        this.isTriggeringWeek36.set(false);
        const message = this.extractErrorMessage(err, 'Week-36 alert trigger failed.');
        this.demoAlert.set({
          type: 'error',
          message,
          timestamp: new Date().toLocaleTimeString()
        });
      }
    });
  }

  private extractErrorMessage(err: unknown, fallback: string): string {
    if (err && typeof err === 'object') {
      const httpErr = err as HttpErrorResponse;
      if (httpErr.error) {
        if (typeof httpErr.error === 'string') return httpErr.error;
        if (typeof httpErr.error === 'object') {
          const body = httpErr.error as { error?: string; message?: string };
          if (body.error) return body.error;
          if (body.message) return body.message;
        }
      }
      if (httpErr.message) return httpErr.message;
    }
    return fallback;
  }
}

export { App as AppComponent };
