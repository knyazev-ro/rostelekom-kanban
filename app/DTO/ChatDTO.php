<?php

namespace App\DTO;

use App\Enums\RoleType;

class ChatDTO
{
    public function __construct(public RoleType $role, public string $content) {}
}
