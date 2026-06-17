<?php

namespace App\Support;

use Illuminate\Support\Str;

class NumberGenerator
{
    public static function next(string $prefix, string $modelClass, string $column): string
    {
        $latest = $modelClass::query()
            ->where($column, 'like', $prefix.'%')
            ->orderByDesc('id')
            ->value($column);

        if (! $latest) {
            return $prefix.'00001';
        }

        $number = (int) Str::after($latest, $prefix);

        return $prefix.str_pad((string) ($number + 1), 5, '0', STR_PAD_LEFT);
    }
}
