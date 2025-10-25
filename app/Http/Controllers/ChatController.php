<?php

namespace App\Http\Controllers;

use App\DTO\ChatDTO;
use App\DTO\ChatHistoryDTO;
use App\Enums\RoleType;
use App\Services\LLMChatService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ChatController extends Controller
{
    public function __construct(protected LLMChatService $chatService) {}

    public function getHistory(Request $request)
    {
        $validated = $request->validate([
            'uuid' => 'nullable|string|size:16'
        ]);
        $uuid = $validated['uuid'] ?? null;
        return response()->json([
            'messages' => $uuid ? $this->chatService->getHistory($uuid) : [],
        ]);
    }


    public function chat(Request $request)
    {
        return Inertia::render('Assistant/Chat');
    }

    public function sendMessage(Request $request)
    {
        $validated = $request->validate([
            'content_of_previous' => 'string|nullable', 
            'content' => 'string|required|max:512',
            'uuid' => 'nullable|string|size:16'
        ]);

        $chatDTOPrevious = ($validated['content_of_previous'] ?? false) ? new ChatDTO(RoleType::ASSISTANT, $validated['content_of_previous']) : null;
        $chatDTO = new ChatDTO(RoleType::USER, $validated['content']);
        $uuid = !($validated['uuid'] ?? false) ? $this->chatService->createTemporarUser() : $validated['uuid'];
        return $this->chatService->chat($uuid, $chatDTOPrevious, $chatDTO);
    }
}
