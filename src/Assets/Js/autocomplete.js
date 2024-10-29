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
        let image = (config.autocomplete && config.autocomplete.image) ?? false;
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

        let multipleData = {};

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

        if (config.autocomplete && config.autocomplete.multiple === true) {
            let boxMultiple = document.createElement('div');
            boxMultiple.setAttribute('class', 'box-autocomplete-multiple');
            boxMultiple.setAttribute('id', 'box-autocomplete-multiple');
            boxAutocomplete.append(boxMultiple);
        }

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
                if(image && image.show === true) {
                    dataParams = Object.assign(dataParams, {imageField:(image.field??'image')});
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

                if(config.autocomplete && config.autocomplete.multiple === true) {

                    if(ui.item.id in multipleData) {

                    } else {
                        multipleData = Object.assign(multipleData, {id: ui.item.id, label: ui.item.label});
                        let div = document.createElement('div');
                        div.setAttribute('class', 'box-multiple');
                        div.append(ui.item.label);
                        let a = document.createElement('a');
                        a.setAttribute('href', '#');
                        a.setAttribute('style', 'float:right;')
                        a.setAttribute('class', 'remove-multiple');
                        a.setAttribute('data-id', ui.item.id);
                        a.onclick = function () {
                            delete multipleData[ui.item.id];
                            div.remove();
                            $(inputSearch).val('');
                            $(inputID).val(Object.values(multipleData).map(item => item.id).join(','));
                        };
                        a.append('X');
                        div.append(a);
                        $("#box-autocomplete-multiple").append(div);
                        $(inputSearch).val('');
                        $(inputID).val(Object.values(multipleData).map(item => item.id).join(','));
                    }
                }
                return false;
            },
            change: function( event, ui ) {
                if (!ui.item) {
                    $(inputID).val('');
                    $(inputSearch).val('');
                }
            },
            create: function() {
                $(this).data('ui-autocomplete')._renderItem  = function (ul, item) {
                    let li = document.createElement('li');
                    li.setAttribute('style', 'padding: 2px;');
                    li.setAttribute('data-item.autocomplete', item);
                    let div = document.createElement('div');

                    if (image && image.show === true) {
                        let img = $(this).noImage()
                        if(item.image) {
                            img = document.createElement('img');
                            img.setAttribute('style', 'width: '+(image.width??24)+'px;');
                            img.setAttribute('height', (image.height??24)+'px');
                            img.setAttribute('src', item.image);
                        }
                        div.append(img);
                        div.append(item.label)

                    } else {
                        div.append(item.label);
                    }

                    li.append(div);
                    return $(li).appendTo( ul );
                };
            },
            minLength: 2
        })
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

    $.fn.noImage = function (){
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("width", "24px");
        svg.setAttribute("height", "24px");
        svg.setAttribute("viewBox", "0 0 24 24");
        svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");

        const path1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path1.setAttribute("d", "M7.828 5l-1-1H22v15.172l-1-1v-.69l-3.116-3.117-.395.296-.714-.714.854-.64a.503.503 0 0 1 .657.046L21 16.067V5zM3 20v-.519l2.947-2.947a1.506 1.506 0 0 0 .677.163 1.403 1.403 0 0 0 .997-.415l2.916-2.916-.706-.707-2.916 2.916a.474.474 0 0 1-.678-.048.503.503 0 0 0-.704.007L3 18.067V5.828l-1-1V21h16.172l-1-1zM17 8.5A1.5 1.5 0 1 1 15.5 7 1.5 1.5 0 0 1 17 8.5zm-1 0a.5.5 0 1 0-.5.5.5.5 0 0 0 .5-.5zm5.646 13.854l.707-.707-20-20-.707.707z");

        const path2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path2.setAttribute("fill", "none");
        path2.setAttribute("d", "M0 0h24v24H0z");

        svg.appendChild(path1);
        svg.appendChild(path2);

        return svg;
    };
})(jQuery);

