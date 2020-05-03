$(function () {
    $('.datepicker').datetimepicker({
        language: tplVarLang,
        format: 'DD.MM.YYYY'
    });

    var getParameter = function (theParameter) {
        var params = window.location.search.substr(1).split('&');
        for (var i = 0; i < params.length; i++) {
            var p = params[i].split('=');
            if (p[0] == theParameter) {
                return decodeURIComponent(p[1]);
            }
        }
        return false;
    };

    var start = 0;
    try {
        var pageParam = parseInt(getParameter('page'));
        if (!isNaN(pageParam)) {
            if (pageParam) start = pageParam * 30;
        }
    } catch (e) {
    }


    var table = $('#deficitItemList');

    table.dataTable({
        'serverSide': true,
        'ajax': {
            'url': '/deficit/list',
            'error': function () {
                $(
                    '<div class="alert alert-danger alert-dismissable" style="margin-top: 20px;">' +
                    '  <i class="fa fa-ban"></i>' +
                    '  <button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>' +
                    tableLoadErrorMessage +
                    '</div>'
                ).insertBefore($('div.table-responsive'));
            }
        },
        'dom': '<<"row"<"col-xs-6"><"col-xs-6"p>><"row"<"col-xs-12"t>><"row"<"col-xs-6"i><"col-xs-6"p>>>',
        'lengthChange': false,
        'scrollX': true,
        'displayStart': start,
        'pageLength': 30,
        'language': tplVarTableText,
        'order': [[1, 'desc']],
        'columns': [
            {'data': null, 'defaultContent': ''},
            {'data': 'orderId'},
            {'data': 'id'},
            {'data': 'orderDate'},
            {'data': 'amount'},
            {'data': 'orderSource'},
            {'data': 'dispatchDate'},
            {'data': null, 'defaultContent': ''},
            {'data': null, 'defaultContent': ''},
            {'data': null, 'defaultContent': ''},
            {'data': null, 'defaultContent': ''}
        ],
        'columnDefs': [
            {
                'targets': 0,
                'searchable': false,
                'orderable': false,
                'width': '1%',
                'className': 'text-center',
                'render': function (data, type) {
                    return '<input class="check-line" type="checkbox" value="' + data.itemId + '">';
                }
            },
            {
                'targets': 7,
                'searchable': false,
                'orderable': false,
                'render': function (data, type) {
                    return '<input class="form-control" name="articleNumber" value="' + data.articleNumber + '" size="15">';
                }
            },
            {
                'targets': 8,
                'searchable': false,
                'orderable': false,
                'render': function (data, type) {
                    return '<input class="form-control" name="orderedFrom" size="5">';
                }
            },
            {
                'targets': 9,
                'searchable': false,
                'orderable': false,
                'render': function (data, type) {
                    return '<input class="form-control datepickerform" name="orderedOn" data-date-format="DD.MM.YYYY" type="text" size="15">';
                }
            },
            {
                'targets': 10,
                'searchable': false,
                'orderable': false,
                'className': 'text-center',
                'render': function (data, type) {
                    return '<input class="form-control" name="deliveryDays" size="5">';
                }
            },
            {'type': 'de_date_time', 'targets': [3, 6, 9]}
        ],
        'createdRow': function(row, data) {
            $('td:not(:first-child):not(td:gt(5))', row).click(function () {
                window.location = "/orders/edit?id=" + data['orderId'];
            });
        }
    });

    table.on('page.dt', function () {
        try {
            history.pushState({}, "", "/deficit?page=" + table.DataTable().page());
        } catch (e) {
        }
    });

    table.on('draw.dt', function () {
        $('.datepickerform').datetimepicker({
            language: tplVarLang,
            format: 'DD.MM.YYYY'
        });

        $('th input:checkbox, td input:checkbox').iCheck({
            checkboxClass: 'icheckbox_minimal',
            increaseArea: '20%'
        });

        $('#deficit-item-select-all').on('ifChanged', function () {
            var checked = this.checked;
            $('.check-line').each(function () {
                $(this).iCheck(checked ? 'check' : 'uncheck');
            });
        });

        $('.check-line').on('ifChanged', function () {
            var result = $('.check-line')
                .map(function () {
                    return {
                        isAtLeastOneChecked: this.checked,
                        isAllChecked: this.checked
                    }
                })
                .get()
                .reduce(function (prev, item) {
                    return {
                        isAtLeastOneChecked: prev.isAtLeastOneChecked || item.isAtLeastOneChecked,
                        isAllChecked: prev.isAllChecked && item.isAllChecked
                    }
                });

            $('#deficit-item-select-all').prop('checked', result.isAllChecked ? 'checked' : false).iCheck('update');
            $('#submitOrderedItems').prop('disabled', !result.isAtLeastOneChecked);
        });
    });
});

$('#submitOrderedItems').on('click', function () {
    var payload = $('tr').filter(':has(.check-line:checked)').map(function (id, row) {
        var element = {};
        element.orderId = $(row).find('td:eq(1)')[0].innerText;
        element.id = $(row).find('td:eq(2)')[0].innerText;
        element.articleNumber = $(row).find('td input[name=articleNumber]').val();
        element.orderedFrom = $(row).find('td input[name=orderedFrom]').val();
        element.deliveryDays = $(row).find('td input[name=deliveryDays]').val();
        element.orderedOn = $(row).find('td input[name=orderedOn]').val();
        return element;
    }).get();

    var requestData = {
        items: payload
    };

    submitOrdered(requestData);
});

function submitOrdered(requestData) {
    var btn = $("#submitOrderedItems");
    var spinner = $("#submitOrderedItemsSpinner");
    var header = "X-CSRF-TOKEN";
    var token = $("input[name='_csrf']").val();

    btn.attr("disabled", "disabled");
    spinner.removeClass('hide');

    $.ajax({
        url: "/deficit",
        type: 'POST',
        data: JSON.stringify(requestData),
        contentType: 'application/json',
        beforeSend: function (xhr) {
            xhr.setRequestHeader(header, token);
        },
        processData: false,
        success: function () {
            window.location.href = '/deficit';
        },
        error: function (error) {
            showModal(modalErrorHeader, prepareExceptionContent(error.responseJSON));
            btn.attr("disabled", false);
            spinner.addClass('hide');
        }
    });
}

var prepareExceptionContent = function (exception) {
    if (exception.message) {
        return '<ul>' + exception.message + '</ul>';
    }

    var content = exception.messages.map(function (ex) {
        return '<li>' + ex + '</li>';
    }).reduce(function (previous, current) {
        return previous + current;
    });

    return '<ul>' + content + '</ul>';
};

var showModal = function (header, content) {
    var modal = $('#messagesModal');
    modal.find('#modalHeader').html(header);
    modal.find('#modalContent').html(content);
    modal.modal('show');
};