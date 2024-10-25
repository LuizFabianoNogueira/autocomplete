<?php

use Illuminate\Support\Facades\Route;
use LuizFabianoNogueira\Autocomplete\Http\Controllers\AutocompleteController;

Route::controller(AutocompleteController::class)->prefix('autocomplete')->group(function () {
    Route::get('list', 'list')->name('autocomplete.dynamic.list');
});

Route::get('/autocomplete/js', static function () {
    $path = __DIR__ . '../../Assets/Js/autocomplete.js';
    return response()->file($path, ['Content-Type' => 'application/javascript']);
})->name('autocomplete.js');

Route::get('/autocomplete/css', static function () {
    $path = __DIR__ . '../../Assets/Css/autocomplete.css';
    return response()->file($path, ['Content-Type' => 'text/css']);
})->name('autocomplete.css');
