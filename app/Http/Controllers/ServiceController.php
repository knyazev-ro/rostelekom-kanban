<?php

namespace App\Http\Controllers;

use App\Models\Service;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ServiceController extends Controller
{
    public function index(Request $request)
    {
        if ($request->has('page')) {
            $service = Service::paginate(10);
        }

        return Inertia::render('Services/Index');
    }

    public function paginatedService(Request $request)
    {
        $search = $request->has('search') ? '%' . $request->search . '%' : null;
        $selected = $request->has('selected') ? json_decode($request->selected) : null;

        $search = $request->get('search', null);
        return Service::query()->when(
            $search,
            function ($query) use ($search) {
                return $query->where('name', 'like', $search)->orWhere('last_name', 'like', $search);
            }
        )
            ->when(
                $selected,
                function ($query) use ($selected) {
                    return $query->whereNotIn('id', $selected);
                }
            )->paginate(10);
    }
}
