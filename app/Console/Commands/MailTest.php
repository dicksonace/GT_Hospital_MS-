<?php

namespace App\Console\Commands;

use App\Mail\HmsNotification;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class MailTest extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'mail:test {email : The recipient email address}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send a branded MediCare HMS test email to verify SMTP is working';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $email = $this->argument('email');

        $this->info("Sending test email to {$email} ...");

        try {
            Mail::to($email)->send(new HmsNotification(
                subjectLine: 'MediCare HMS — Test Email',
                heading: 'Your email is working!',
                introLines: [
                    'This is a test message from MediCare HMS confirming that outgoing email (SMTP) is configured correctly.',
                    'Your hospital system can now send appointment confirmations, password resets, and staff notifications from this address.',
                ],
                actionText: 'Open MediCare HMS',
                actionUrl: 'https://medicarehms.tech',
                outroLines: [
                    'Sent at '.now()->toDayDateTimeString().'.',
                ],
            ));
        } catch (\Throwable $e) {
            $this->error('Failed to send: '.$e->getMessage());

            return self::FAILURE;
        }

        $this->info('Test email sent successfully.');

        return self::SUCCESS;
    }
}
