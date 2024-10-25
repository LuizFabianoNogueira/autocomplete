<?php

namespace LuizFabianoNogueira\Autocomplete\Traits;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

trait AutocompleteTrait
{

    /**
     * AutocompleteTrait constructor.
     */
    public function __construct()
    {
        $this->verificaImplementacao();
    }

    /**
     * Generic scope to define fields to be returned
     *
     * @param $query
     * @return mixed
     */
    public function scopeAutocomplete($query)
    {
        $request = request();
        $data = $request->all();
        $table = $this->getTable();
        $hasTable = !empty($table);

        $id = $data['fields']['id'] ?? 'id';
        $name = $data['fields']['name'] ?? 'name';

        if ($hasTable) {
            $id = "$table.$id";
        }

        if ($hasTable && !str_contains($name, 'CONCAT(')) {
            $name = "$table.$name";
        }

        #define fields
        $fields = [
            DB::raw("$id as id"),
            DB::raw("$name as label")
        ];
        $query->select($fields);

        #define orderBy
        if ($request->has('orderByField')) {
            $query->orderBy($request->orderByField??'name', $request->orderByDirection??'asc');
        }

        #define take
        $query->take($request->take??10);

        #define search
        $search = $request->search??null;
        if(isset($this->autocomplete_search_fields) && is_array($this->autocomplete_search_fields)) {
            $autocomplete_search_fields = $this->autocomplete_search_fields;
            if (!empty($search)) {
                $query->where(function ($query) use ($search, $autocomplete_search_fields) {
                    foreach ($autocomplete_search_fields as $field) {
                        $query->orWhere($field, 'like', '%'.$search.'%');
                    }
                });
            }
        } else {
            $query->orWhere('name', 'like', '%'.$search.'%');
        }

        return $query;
    }


    /**
     * Verifica se a implementação foi feita corretamente
     *
     * @throws \Exception
     */
    public function verificaImplementacao() {
        if (!property_exists($this, 'autocomplete_search_fields')) {
            throw new \Exception("A variável 'autocomplete_search_fields' precisa ser definida. []");
        }
    }
}
