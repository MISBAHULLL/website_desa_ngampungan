<?php

namespace App;

enum ContactMessageStatus: string
{
    case Unread = 'unread';
    case Read = 'read';
    case Resolved = 'resolved';

    public function label(): string
    {
        return match ($this) {
            self::Unread => 'Belum dibaca',
            self::Read => 'Sudah dibaca',
            self::Resolved => 'Selesai',
        };
    }
}
