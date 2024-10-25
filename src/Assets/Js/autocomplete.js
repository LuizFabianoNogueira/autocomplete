if (typeof $ !== 'undefined') {
    console.log("jQuery is loaded!");
} else {
    let script = document.createElement('script');
    script.src = 'https://code.jquery.com/jquery-3.6.0.min.js';
    script.async = true;
    document.head.appendChild(script);
    script.onload = function() {
        console.log('jQuery foi carregado com sucesso!');
    };
}

(function($){
    $.fn.loadAutocompleteLaravel = function(config) {
        if(!config.autocomplete || !config.autocomplete.alias) {
            return alert('O alias do autocomplete deve ser informado!');
        }
        let alias = (config.autocomplete && config.autocomplete.alias) ?? null;
        let name = (config.autocomplete && config.autocomplete.name) ?? 'autocomplete';
        let dynamicModel = (config.request && config.request.dynamicModel) ?? null;
        let url = (config.request && config.request.url) ?? "/autocomplete/list";
        let valueText = (config.autocomplete && config.autocomplete.valueText) ?? null;
        let valueId = (config.autocomplete && config.autocomplete.valueId) ?? null;
        let loadingData = (config.autocomplete && config.autocomplete.loadingData) ?? 'https://cdnjs.cloudflare.com/ajax/libs/lightbox2/2.11.3/images/loading.gif';
        let params = (config.request && config.request.params) ?? null;
        let take = (config.request && config.request.take) ?? 10;

        let fieldDataSourceName = (config.autocomplete && config.autocomplete.dataSource && config.autocomplete.dataSource.fieldName) ?? 'name';
        let fieldDataSourceId = (config.autocomplete && config.autocomplete.dataSource && config.autocomplete.dataSource.fieldValue) ?? 'id';
        let checkImage = (config.fieldDataSourceImage ?? false);
        let afterEvent = (config.afterEvent ?? null);
        let divFormGroup = (config.divFormGroup ?? false);
        let required = (config.required === true ? 'required="true"' : '');
        let inputClass = (config.inputClass??'');

        let autocomplete = $(this);

        let styleLoading = $(this).styleLoading(loadingData);
        let label = $(this).label(alias, (config.texts && config.texts.label)??'');
        let inputSearch = $(this).inputSearch(alias, inputClass, valueText, (config.texts && config.texts.placeholder)??'');
        let inputID = $(this).inputID(alias, name, valueId);
        let inputInfo = $(this).inputInfo(alias);

        let boxAutocomplete = document.createElement('div');
        boxAutocomplete.setAttribute('class', 'form-group col-md');

        boxAutocomplete.append(styleLoading);
        if(config.autocomplete && config.autocomplete.label && config.autocomplete.label.hidden === true) {

        } else {
            boxAutocomplete.append(label);
        }

        boxAutocomplete.append(inputSearch);
        boxAutocomplete.append(inputID);
        boxAutocomplete.append(inputInfo);

        autocomplete.append(boxAutocomplete);

        $("#"+'autocomplete-'+alias).autocomplete({
            source: function( request, response ) {
                $(inputID).val('');

                let dataParamsDefault = {
                    search: request.term,
                    take: take,
                    fields: {name: fieldDataSourceName, id: fieldDataSourceId}
                };
                let dataParams = Object.assign(dataParamsDefault, params);
                if (dynamicModel) {
                    dataParams = Object.assign(dataParams, {dynamicModel:dynamicModel});
                }

                let method = 'GET';
                if(config.request && config.request.method && config.request.method === 'POST') {
                    method = config.request.method;
                }

                let headers = {};
                if (config.request && config.request.headers) {
                    headers = config.request.headers;
                }

                $.ajax({
                    url: url,
                    type: method,
                    dataType: "json",
                    headers: headers,
                    data: dataParams,
                    success: function(dataResult) {
                        $(inputInfo).fadeOut();
                        if (dataResult.length <=0) {
                            $(inputInfo).html((config.texts && config.texts.noResults) ?? 'No Results');
                            $(inputInfo).fadeIn();
                            //$(inputSearch).val('');
                            $(inputID).val('');
                        }
                        response(dataResult);
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        $(inputInfo).html(jqXHR.status+'-'+errorThrown);
                        $(inputInfo).fadeIn();
                        $(inputSearch).val('');
                        $(inputID).val('');
                    }
                });
            },
            select: function (event, ui) {
                $(inputSearch).val(ui.item.label);
                $(inputID).val(ui.item.id);
                if (afterEvent) {
                    eval(afterEvent + "(ui.item.id, ui.item.label);");
                }
                return false;
            },
            change: function( event, ui ) {
                if (!ui.item) {
                    $(inputID).val('');
                    $(inputSearch).val('');
                }
            },
            minLength: 2
        })._renderItem = function(ul, item) {
            if (checkImage) {
                let img = '<img style="width: 50px;" src="'+noImageData+'">';
                if(item.image) {
                    img = '<img style="width: 50px;" src="'+item.image.public_route+'" />'
                }
                return $("<li></li>")
                    .data("item.autocomplete", item)
                    .append('<div>'+img+' '+item.label+'</div>')
                    .appendTo(ul);
            }
            let li = document.createElement('li');
            li.setAttribute('style', 'padding: 2px;');
            li.setAttribute('data-item.autocomplete', item);

            let div = document.createElement('div');
            div.append(item.label);
            li.append(div);
            ul.append(li);

        };
    };

    $.fn.label = function (alias, labelText){
        let label = document.createElement('label');
        label.setAttribute('for', 'autocomplete-'+alias);
        label.append(labelText);
        return label;
    };

    $.fn.styleLoading = function (loadingData){
        let styleLoading = document.createElement('style');
        styleLoading.innerHTML = '.ui-autocomplete-loading { background: white url('+loadingData+') right center/30px no-repeat;}';
        return styleLoading;
    };

    $.fn.inputSearch = function (alias, inputClass, valueText, placeholder){
        let inputSearch = document.createElement('input');
        inputSearch.setAttribute('type', 'text');
        inputSearch.setAttribute('class', 'form-control mb-0 '+inputClass);
        inputSearch.setAttribute('maxlength', '225');
        inputSearch.setAttribute('id', 'autocomplete-'+alias);
        inputSearch.setAttribute('value', valueText);
        inputSearch.setAttribute('placeholder', placeholder);
        return inputSearch;
    };

    $.fn.inputInfo = function (alias){
        let inputInfo = document.createElement('span');
        inputInfo.setAttribute('class', 'autocomplete-info');
        inputInfo.setAttribute('id', 'autocomplete-'+alias+'-info');
        return inputInfo;
    };

    $.fn.inputID = function (alias, name, valueId){
        let inputID = document.createElement('input');
        inputID.setAttribute('type', 'hidden');
        inputID.setAttribute('class', 'form-control');
        inputID.setAttribute('maxlength', '225');
        inputID.setAttribute('id', 'autocomplete-'+alias+'-id');
        inputID.setAttribute('name', (name??'autocomplete-'+alias+'-id'));
        inputID.setAttribute('value', valueId);
        return inputID;
    };

    $.fn.error = function (name, txtError){
        let objInfo = $("#"+name+"_info");
        objInfo.html(txtError);
        objInfo.fadeIn();
        $('#'+name+'_name').val('');
        $('#'+name+'_id').val('');
    };
})(jQuery);

