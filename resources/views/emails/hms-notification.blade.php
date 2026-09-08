<x-mail::message>
# {{ $heading }}

@foreach ($introLines as $line)
{{ $line }}

@endforeach
@if ($actionText && $actionUrl)
<x-mail::button :url="$actionUrl" color="primary">
{{ $actionText }}
</x-mail::button>
@endif
@foreach ($outroLines as $line)
{{ $line }}

@endforeach
Thanks,<br>
The {{ config('app.name') }} Team
</x-mail::message>
