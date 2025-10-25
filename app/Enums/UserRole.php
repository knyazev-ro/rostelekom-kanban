<?php

namespace App\Enums;

enum UserRole: string
{
    case ADMIN = 'admin';
    case ANALYST = 'analyst';
    case USER = 'user';

    public function label(): string {
        return match($this) {
            self::ADMIN => 'Администратор',
            self::ANALYST => 'Аналитик',
            self::USER => 'Пользователь',
        };
    }

}
