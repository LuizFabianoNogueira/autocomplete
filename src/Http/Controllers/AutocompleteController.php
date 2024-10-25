<?php

namespace LuizFabianoNogueira\Autocomplete\Http\Controllers;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AutocompleteController extends BaseController
{
    /**
     * List all data from a model
     *
     * @param Request $request
     * @return JsonResponse|null
     */
    public function list(Request $request): ?JsonResponse
    {
        if (!$request->has('dynamicModel')) {
            return response()->json([
                'error' => 'Model not found'
            ]);
        }

        $model = $request->dynamicModel;

        if (!class_exists($model)) {
            return response()->json([
                'error' => 'Class not found'
            ]);
        }

        try {
            $objModel = new $model();
            $query = $objModel::query()->autocomplete()->get();
            return response()->json($query);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ]);
        }
    }
}
