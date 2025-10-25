<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminUserController extends Controller
{
    public function index(Request $request) {
        if($request->has('page')) {
            $users = User::paginate(10);
            return $users;
        }
        return Inertia::render('Users/Index');
    }

    public function create(User $user) {
        //
    }

    public function update(Request $request, int|null $id = null) {
        // 
    }

    public function edit(User $user) {
        // 
    }

    public function destroy(User $user) {
        $user->delete();
    }
}
