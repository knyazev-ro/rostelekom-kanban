<?php

namespace App\Services;

use App\DTO\ChatDTO;
use App\DTO\ChatHistoryDTO;
use Cloudstudio\Ollama\Facades\Ollama;
use Illuminate\Console\BufferedConsoleOutput;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Str;

class LLMChatService
{

    public function getHistory(string $uuid): array
    {
        return Session::get('tmpusers:' . $uuid) ?? [];
    }

    public function setHistory(string $uuid, array $history)
    {
        Session::put('tmpusers:' . $uuid, $history);
    }

    public function createTemporarUser(): string
    {
        $uuid = Str::random(16);
        Session::put('tmpusers:' . $uuid, []);
        return $uuid;
    }

    public function chat(string $uuid, ChatDTO|null $chatDTOPrevious = null, ChatDTO $chatDTO): \Symfony\Component\HttpFoundation\StreamedResponse
    {

        $history = $this->getHistory($uuid);
        $history = collect($history);

        if ($chatDTOPrevious) {
            $history->add([
                'role' => $chatDTOPrevious->role->value,
                'content' => $chatDTOPrevious->content,
            ]);
        }

        $history->add([
            'role' => $chatDTO->role->value,
            'content' => $chatDTO->content,
        ]);

        $history = $history->toArray();

        $this->setHistory($uuid, $history);

        set_time_limit(0); // бесконечно
        
        $response = Ollama::model('gemma3:12b')
            ->stream(true)
            ->options([
                'temperature' => 0.1
            ])
            ->chat($history);

        return response()->stream(function () use ($response) {
            Ollama::processStream($response->getBody(), function ($data) {
                echo json_encode($data) . "\n\n";
                ob_flush();
                flush();
            });
        }, 200, [
            'Content-Type' => 'text/plain',
            'Cache-Control' => 'no-cache',
            'X-Accel-Buffering' => 'no'
        ]);
    }
}
