(function(window, $, wb) {
    'use strict';

    var timeout,
        root = window.ckan ? window.ckan.root : '',
        getAutocomplete = function(event) {
            var val = event.target.value,
                type;

            if (val) {
                type = wb.getData(event.delegateTarget, 'autocomplete').type;

                wb.doc.trigger({
                    type: 'ajax-fetch.wb',
                    element: event.delegateTarget,
                    fetch: {
                        url: root + '/api/3/action/GetAutocomplete?type=' + type + '&q=*' + val + '*',
                        dataType: 'jsonp',
                        jsonp: 'callback'
                    }
                });
            }
        };

    $('[data-autocomplete]').on('keydown', 'input[type="text"]', function() {
        var _this = this,
            args = arguments;

        clearTimeout(timeout);
        timeout = setTimeout(function() {
            getAutocomplete.apply(_this, args);
        }, 500);
    });

    $('[data-autocomplete]').on('ajax-fetched.wb', function(event) {
        var $select = $(event.delegateTarget).find('select'),
            terms = event.fetch.response.result.results,
            termsLength = terms.length,
            t, term, group, $append;

        $select.empty();

        if (terms.length !== 0) {
            for (t = 0; t < termsLength; t += 1) {
                term = terms[t];
                group = term.group;

                if (group) {
                    group = group[wb.lang];
                    $append = $select.find('optgroup[label="' + group + '"]');

                    if ($append.length === 0) {
                        $append = $('<optgroup label="' + group + '"></optgroup>').appendTo($select);
                    }
                } else {
                    $append = $select;
                }

                $append.append('<option value="' + term.code + '">' + term.title.en + ' | ' + term.title.fr + ' | ' + term.code);
            }
        } else {
            $select.append('<option value="">' + wb.i18n('no-match') + '</option>');
        }
    });

    $('[data-autocomplete]').on('click', 'button', function(event) {
        var $codes = $(event.delegateTarget).find('input[name!=""][name]'),
            codes = $codes.val(),
            code = $(event.delegateTarget).find('select option:selected').val();

        if (!codes) {
            $codes.val(code);
        } else if (codes.split(';').indexOf(code) === -1) {
            $codes.val(codes + ';' + code);
        }
    });

})(window, jQuery, wb);