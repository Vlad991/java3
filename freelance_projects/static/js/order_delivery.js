$(function () {

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


    var table = $('#deliveryDataList');

    table.dataTable({
        'serverSide': true,
        'ajax': {
            'url': '/delivery/list',
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
            {
                'data': null,
                'defaultContent': ''
            },
            {'data': 'id'},
            {'data': 'saleRecordNumber'},
            {'data': 'shippedOn'},
            {'data': 'source'},
            {'data': 'deliveryService'},
            {'data': 'trackingNumber'},
        ],
        'columnDefs': [
            {
                'targets': 0,
                'searchable': false,
                'orderable': false,
                'width': '1%',
                'className': 'text-center',
                'render': function (data, type) {
                    return '<input class="check-line" type="checkbox" value="' + data.saleRecordNumber + '">';
                }
            },

            {'type': 'de_datetime', 'targets': 3},
        ],
        'createdRow': function (row, data) {
            $('td:not(:first-child)', row).click(function () {
                window.location = "/orders/edit?id=" + data['id'];
            });
        }
    });

    table.on('page.dt', function () {
        try {
            history.pushState({}, "", "/delivery?page=" + table.DataTable().page());
        } catch (e) {
        }
    });

    table.on('draw.dt', function () {
        $('th input:checkbox, td input:checkbox').iCheck({
            checkboxClass: 'icheckbox_minimal',
            increaseArea: '20%'
        });

        $('#delivery-data-select-all').on('ifChanged', function () {
            var isChecked = this.checked;
            var rows = table.dataTable().api().rows().nodes();
            $('input[type="checkbox"]', rows).each(function (index, element) {
                $(element).iCheck(isChecked ? 'check' : 'uncheck');
            });
        });

        $('.check-line').on('ifChanged', function () {
            checkTableRow(this);
        });
    });

    var checkTableRow = function (element) {
        if (element.checked) {
            selectedOrders.add(element.value);
        } else {
            $('#delivery-data-select-all').prop('checked', false);
            $('#delivery-data-select-all').iCheck('update');
            selectedOrders.remove(element.value);
        }

        var batchCommandMenu = $('#batchCommandMenu');
        if (selectedOrders.size() == 0) {
            $('#submitShipped').prop('disabled', true);
            $('#submitShipped').addClass('disabled');
        } else if (selectedOrders.size() > 0) {
            $('#submitShipped').prop('disabled', false);
            $('#submitShipped').removeClass('disabled');
        }
    };

    var selectedOrders = function () {
        var saleRecordNumbers = [];

        var push = function (value) {
            var numberValue = parseInt(value);
            var index = saleRecordNumbers.indexOf(numberValue);
            if (index == -1) {
                saleRecordNumbers.push(numberValue);
            }
        };

        var splice = function (value) {
            var numberValue = parseInt(value);
            var index = saleRecordNumbers.indexOf(numberValue);
            if (index > -1) {
                saleRecordNumbers.splice(index, 1);
            }
        };

        var size = function () {
            return saleRecordNumbers.length;
        };

        var parameters = function () {
            return sortedElements();
        };

        var sortedElements = function () {
            return saleRecordNumbers.sort(function (a, b) {
                return a - b;
            });
        };

        return {
            add: push,
            remove: splice,
            size: size,
            elements: sortedElements,
            requestParameters: parameters
        }
    }();

    $('#submitShipped').on('click', function () {
        markShipped(selectedOrders);
    });
});

function uploadDeliveryDataFile() {
    if (!$("#deliveryDataFile").val()) {
        return true;
    }

    var btn = $("#uploadDeliveryData");
    var spinner = $("#uploadDeliveryDataSpinner");
    var errorIcon = $("#uploadDeliveryDataError");

    btn.attr("disabled", "disabled");
    spinner.removeClass('hide');
    errorIcon.addClass('hide');

    var formData = new FormData(document.getElementById("deliveryDataForm"));

    $.ajax({
        url: "/delivery/upload",
        type: 'POST',
        data: formData,
        contentType: false,
        processData: false,
        success: function (uploadResult) {
            showModal(modalSuccessHeader, prepareContent(uploadResult), '/delivery');
        },
        error: function (error) {
            showModal(modalErrorHeader, prepareExceptionContent(error.responseJSON.messages), '/delivery');
        }
    });

    var prepareContent = function (uploadResult) {
        var content = '<ul>';
        content += '<li>' + modalSuccessTotal + ': ' + uploadResult.itemsUploaded + '</li>';
        content += '<li>' + modalSuccessUpdated + ': ' + uploadResult.itemsUpdated + '</li>';
        if (uploadResult.saleRecordNumbers.length > 0) {
            content += '<li>' + modalSuccessIds + ': ' + uploadResult.saleRecordNumbers + '</li>';
        }
        return content + '</ul>';
    };

}
function markShipped(orders) {
    var btn = $("#submitShipped");
    var spinner = $("#submitShippedSpinner");
    var errorIcon = $("#submitShippedError");
    var header = "X-CSRF-TOKEN";
    var token = $("input[name='_csrf']").val();

    btn.attr("disabled", "disabled");
    spinner.removeClass('hide');
    errorIcon.addClass('hide');

    $.ajax({
        url: "/delivery/shipped",
        type: 'POST',
        data: JSON.stringify(orders.requestParameters()),
        contentType: 'application/json',
        beforeSend: function(xhr) {
            xhr.setRequestHeader(header, token);
        },
        processData: false,
        success: function () {
            window.location.href = '/delivery';
        },
        error: function (error) {
            showModal(modalErrorHeader, prepareExceptionContent(error.responseJSON.messages), '/delivery');
        }
    });
}

var prepareExceptionContent = function (exceptions) {
    var content = exceptions.map(function (ex) {
        return '<li>' + ex + '</li>';
    }).reduce(function(previous, current) {
        return previous + current;
    })

    return '<ul>' + content + '</ul>';
}

var showModal = function (header, content, redirect) {
    var modal = $('#messagesModal');
    modal.find('#modalHeader').html(header);
    modal.find('#modalContent').html(content);
    modal.on('hidden.bs.modal', function () {
        window.location.href = redirect;
    });

    modal.modal('show');
};

