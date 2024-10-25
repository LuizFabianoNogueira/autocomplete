<p align="center"><img src="src/Assets/img/laravel.png" alt="Laravel Logo"></p>


# Autocompete [Select]

[![Latest Stable Version](https://poser.pugx.org/luizfabianonogueira/autocomplete/v)](//packagist.org/packages/luizfabianonogueira/autocomplete)
[![Total Downloads](https://poser.pugx.org/luizfabianonogueira/autocomplete/downloads)](//packagist.org/packages/luizfabianonogueira/autocomplete)
[![Latest Unstable Version](https://poser.pugx.org/luizfabianonogueira/autocomplete/v/unstable)](//packagist.org/packages/luizfabianonogueira/autocomplete)
[![License](https://poser.pugx.org/luizfabianonogueira/autocomplete/license)](//packagist.org/packages/luizfabianonogueira/autocomplete)


![Badge em Desenvolvimento](http://img.shields.io/static/v1?label=STATUS&message=IN%20DEVELOPMENT&color=GREEN&style=for-the-badge)

## Description
Ferramenta de seleção (select) com buscar de dados em tempo real por preenchimento.
Com essa gerrementa você pode buscar os dados aos poucos confome vai digitando no campo de busca.
Isso agiliza a busca de dados em listas muito grandes.
A busca é feita no banco de dados, então você pode buscar por qualquer campo da tabela podento ate mesmo utilizar dois ou mais campos de referencia.

## Installation

Baixe o pacote via composer:
```bash
composer require luizfabianonogueira/autocomplete
```

Adicone o provider em bootstrap/providers.php:
```php
'providers' => [
    ...
    LuizFabianoNogueira\Autocomplete\AutocompleteServiceProvider::class,
    ...
]
```

## Usage

Na sua model adicione o trait `AutocompleteTrait`:
```php
use LuizFabianoNogueira\Autocomplete\AutocompleteTrait;

class User extends Model
{
    use AutocompleteTrait;
    ...
}
```

No eu layout adicione o css e o js utilizando as rotas a baixo:
```html
<script src="https://code.jquery.com/ui/1.14.0/jquery-ui.js"></script>
<link rel="stylesheet" href="{{ route('autocomplete.css') }}">
<script src="{{ route('autocomplete.js') }}"></script>
```


Pronto com apenas isso você já pode utilizar o recurso de busca em tempo real no modo dinamico

veja abaixa um exemplo de como utilizar o recurso:

No local onde deseja adicionar um id de identificação
```html
<div id="autocomplete"></div>
```

Logo em seguida adicione o script de configuração do recurso
```javascript
$(document).ready(function(){
    $("#box-autocomplete-um").loadAutocompleteLaravel({
        autocomplete: {
            alias:'userDynamic',
            loadingData: '/assets/img/loading.gif',
        },
        request: {
            dynamicModel: 'App\\Models\\User',
            take: 10,
        },
        texts:{
            placeholder: 'Pesquise aqui...',
            noResults: 'Nenhum resultado encontrado',
            label: 'Usuário',
        }
    });
});
```
![basic1.png](src%2FAssets%2Fimg%2Fbasic1.png)

Agora vamos ver todos os detalhes de como configurar o recurso e ver todo seu potencial.

No exemplo acima podemos ver uma chamada de jquery que monta o compnente 
```javascript
$("#box-autocomplete-um").loadAutocompleteLaravel();
```
Para isso devemos identificar como seletor quem vai receber o componente "#box-autocomplete-um" no exemplo que é o id de uma div.
Não precisa criar inputs pois o componente ja faz isso para você.

Para que o componente funcione corretamente você deve passar um objeto de configuração. Vamos ver o que cada parametro faz.
```javascript
{
    autocomplete: {
        alias:'userDynamic',
        loadingData: '/assets/img/loading.gif',
    },
}
```
-**autocomplete:** é o objeto que contem as configurações do componente.
- **alias:** é o nome do componente que você esta criando, ele é obrigatório e deve ser unico para cada componente.
- **loadingData:** é a imagem que vai aparecer enquanto o componente esta carregando os dados. vc pode indicar uma url interna ou externa de um gif.

```javascript
{
    request: {
        dynamicModel: 'App\\Models\\User',
        take: 10,
    },
}
```
- **request:** é o objeto que contem as configurações de busca dos dados.
- **dynamicModel:** é o nome do model que você deseja buscar os dados. (Não esqueça de adicionar o trait `AutocompleteTrait` no model).
por padrão a busca é feita no campo `name` e `id` do model, mas você pode alterar isso como nos exeplos abaixo.
- **take:** é a quantidade de dados que você deseja buscar por vez.

Outra forma de fazer a busca é ou url aonde devemos fazer a rora e o metodo do controller.
```javascript
{
    request: {
        url: '/search/user' ou '{{ route('search.user') }}',
        take: 10,
    },
}
```
Para que a busca funcione você deve criar um controller com o metodo de busca e retornar um json com os dados.
```php
public function autocompleteUsers(Request $request): JsonResponse
{
    return response()->json(Users::autocomplete()->get());
}
```
Perceba que a consulta da controler tem um metodo `autocomplete()` que é um scope que deve ser adicionado no model.
A consulta é simples e limpa, você pode adicionar mais filtros e ordenações conforme sua necessidade.





```javascript
{
    texts:{
        placeholder: 'Pesquise aqui...',
        noResults: 'Nenhum resultado encontrado',
        label: 'Usuário',
    }
}
```
- **texts:** é o objeto que contem as configurações de texto do componente.
- **placeholder:** é o texto que vai aparecer no campo de busca.
- **noResults:** é o texto que vai aparecer quando não houver resultados.
- **label:** é o texto que vai aparecer no label do campo de busca.


### License: LGPL-3.0-or-later

___
___

## Contact & Support

[![LinkedIn](https://img.shields.io/badge/LinkedIn-000?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/luiz-fabiano-nogueira-b20875170/)
[![WhatsApp](https://img.shields.io/badge/WhatsApp-000?style=for-the-badge&logo=whatsapp&logoColor=white)](https://api.whatsapp.com/send?phone=5548991779088)
[![GitHub](https://img.shields.io/badge/GitHub-000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/LuizFabianoNogueira)
[![Packagist](https://img.shields.io/badge/Packagist-000?style=for-the-badge&logo=packagist&logoColor=white)](https://packagist.org/packages/luizfabianonogueira/)

📞 **Phone:** [+5548991779088](tel:+5548991779088)  
✉️ **Email:** [luizfabianonogueira@gmail.com](mailto:luizfabianonogueira@gmail.com)

---

### Support My Work

If you enjoyed this project and would like to support my work, any donation via Pix is greatly appreciated!  
Feel free to donate using one of the following Pix keys:

💳 **Email Pix Key:** `luizfabianonogueira@gmail.com`  
📱 **Phone Pix Key:** `48991779088`

Thank you for your support!
