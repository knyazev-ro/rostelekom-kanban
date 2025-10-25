<?php

namespace App\DTO;

use Illuminate\Support\Facades\Session;

class ChatHistoryDTO
{
    public function __construct(public string $uuid, public array $history) {}

    public function toArray()
    {
        $chat = $this->messagesToArray();
        return [
            'uuid' => $this->uuid,
            'messages' => $chat->toArray(),
        ];
    }

    public function messagesToArray()
    {
    $chat = collect($this->history)->map(function($chatDTO){
            return [
                'role' => $chatDTO->role->value,
                'content' => $chatDTO->content,
            ];
        });
    return $chat;
    }

    public function addToSessionHistory(ChatDTO $chatDTO)
    {
        Session::put('tmpusers:' . $this->uuid, $this->messagesToArray());
    }
}
