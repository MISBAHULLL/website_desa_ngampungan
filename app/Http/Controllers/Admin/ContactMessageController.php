<?php

namespace App\Http\Controllers\Admin;

use App\ContactMessageStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateContactMessageStatusRequest;
use App\Models\ContactMessage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ContactMessageController extends Controller
{
    public function index(Request $request): Response
    {
        $requestedStatus = $request->string('status')->toString();
        $availableStatuses = array_column(ContactMessageStatus::cases(), 'value');
        $activeStatus = in_array($requestedStatus, $availableStatuses, true)
            ? $requestedStatus
            : 'all';

        $messages = ContactMessage::query()
            ->select([
                'id',
                'name',
                'contact',
                'category',
                'message',
                'status',
                'read_at',
                'resolved_at',
                'created_at',
            ])
            ->when(
                $activeStatus !== 'all',
                fn ($query) => $query->where('status', $activeStatus),
            )
            ->latest()
            ->paginate(10)
            ->withQueryString()
            ->through(fn (ContactMessage $message): array => [
                'id' => $message->id,
                'name' => $message->name,
                'contact' => $message->contact,
                'category' => $message->category,
                'message' => $message->message,
                'status' => $message->status->value,
                'readAt' => $message->read_at?->toIso8601String(),
                'resolvedAt' => $message->resolved_at?->toIso8601String(),
                'createdAt' => $message->created_at?->toIso8601String(),
            ]);

        return Inertia::render('admin/contact-messages/index', [
            'messages' => $messages,
            'activeStatus' => $activeStatus,
            'statuses' => array_map(
                fn (ContactMessageStatus $status): array => [
                    'value' => $status->value,
                    'label' => $status->label(),
                ],
                ContactMessageStatus::cases(),
            ),
            'statistics' => [
                'total' => ContactMessage::query()->count(),
                'unread' => ContactMessage::query()
                    ->where('status', ContactMessageStatus::Unread)
                    ->count(),
                'resolved' => ContactMessage::query()
                    ->where('status', ContactMessageStatus::Resolved)
                    ->count(),
            ],
        ]);
    }

    public function updateStatus(
        UpdateContactMessageStatusRequest $request,
        ContactMessage $contactMessage,
    ): RedirectResponse {
        $status = $request->enum('status', ContactMessageStatus::class);

        $contactMessage->update([
            'status' => $status,
            'read_at' => $status === ContactMessageStatus::Unread
                ? null
                : ($contactMessage->read_at ?? now()),
            'resolved_at' => $status === ContactMessageStatus::Resolved
                ? ($contactMessage->resolved_at ?? now())
                : null,
        ]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Status pesan berhasil diperbarui.',
        ]);

        return back();
    }
}
