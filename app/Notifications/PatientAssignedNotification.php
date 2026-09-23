<?php

namespace App\Notifications;

use App\Models\Doctor;
use App\Models\Patient;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PatientAssignedNotification extends Notification
{
    use Queueable;

    public function __construct(
        public Patient $patient,
        public string $assignmentType,
        public string $reference,
        public ?string $when = null,
        public ?string $details = null,
    ) {}

    /** @return list<string> */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $when = $this->when ? " on {$this->when}" : '';

        $mail = (new MailMessage)
            ->subject("New {$this->assignmentType} assigned: {$this->patient->full_name}")
            ->greeting("Hello {$notifiable->name},")
            ->line("A patient has been assigned to you for a {$this->assignmentType}{$when}.")
            ->line("Patient: {$this->patient->full_name} ({$this->patient->patient_number})")
            ->line("Reference: {$this->reference}");

        if ($this->details) {
            $mail->line($this->details);
        }

        return $mail
            ->action('Open MediCare HMS', url('/dashboard'))
            ->line('Please review the patient record and prepare for the visit.');
    }

    public static function notifyDoctor(
        Doctor $doctor,
        Patient $patient,
        string $assignmentType,
        string $reference,
        ?string $when = null,
        ?string $details = null,
    ): void {
        $user = $doctor->user;

        if (! $user?->email) {
            return;
        }

        $user->notify(new self($patient, $assignmentType, $reference, $when, $details));
    }
}
