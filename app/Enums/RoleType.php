<?php

namespace App\Enums;

enum RoleType: string
{
    case SYSTEM = 'system';
    case USER = 'user';
    case ASSISTANT = 'assistant';
    
}
