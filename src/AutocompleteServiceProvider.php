<?php

namespace LuizFabianoNogueira\Autocomplete;

use Illuminate\Support\ServiceProvider;

class AutocompleteServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        $this->loadRoutesFrom(__DIR__ . '/Routes/autocomplete.php');

//        $this->publishes([
//            __DIR__.'/Config/autocomplete.php' => config_path(),
//        ], 'autocomplete-laravel-config');
    }
}
