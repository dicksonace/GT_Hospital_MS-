<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class HmsNotification extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     *
     * @param  string[]  $introLines   Paragraphs shown above the action button.
     * @param  string[]  $outroLines   Paragraphs shown below the action button.
     */
    public function __construct(
        public string $subjectLine,
        public string $heading,
        public array $introLines = [],
        public ?string $actionText = null,
        public ?string $actionUrl = null,
        public array $outroLines = [],
    ) {
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: $this->subjectLine,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            markdown: 'emails.hms-notification',
        );
    }
}
