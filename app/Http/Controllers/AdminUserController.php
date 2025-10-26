<?php

namespace App\Http\Controllers;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminUserController extends Controller
{
    public function index(Request $request)
    {
        if ($request->has('page')) {
            $users = User::paginate(10);
            return $users;
        }
        return Inertia::render('Users/Index');
    }

    public function create(User $user)
    {
        //
    }

    public function update(Request $request, int|null $id = null)
    {
        // 
    }

    public function edit(User $user)
    {
        // 
    }

    public function destroy(User $user)
    {
        $user->delete();
    }

    public function paginatedUsers(Request $request)
    {
        $search = $request->has('search') ? '%' . $request->search . '%' : null;
        $column = $request->has('column') ? $request->column : null;
        $selected = $request->has('selected') ? json_decode($request->selected) : null;

        $users = User::where('role', UserRole::USER->value)
        ->when(
            $search,
            function ($query) use ($search, $column) {
                return $query->where('name', 'like', $search)->orWhere('last_name', 'like', $search);
            }
        )
            ->when(
                $selected,
                function ($query) use ($selected) {
                    return $query->whereNotIn('id', $selected);
                }
            )
            ->paginate(10);
        return $users;
    }
}
