$(function() {
    $('.datepicker').datetimepicker({
                                        language: tplVarLang,
                                        format:   'DD.MM.YYYY'
                                    });

    $('#status').multiselect({
                                 buttonWidth: "100%",
                                 nonSelectedText: "-",
                                 numberDisplayed: 4,
                                 nSelectedText: tplVarSelectedText,
                                 allSelectedText: tplVarAllSelectedText
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

    var table = $('#ordersList');

    table.dataTable({
                        'serverSide': true,
                        'ajax': {
                            'url': '/orders/list',
                            'error': function () {
                                $(
                                    '<div class="alert alert-danger alert-dismissable" style="margin-top: 20px;">' +
                                    '  <i class="fa fa-ban"></i>' +
                                    '  <button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>' +
                                    tableErrorData +
                                    '</div>'
                                ).insertBefore($('div.table-responsive'));
                            }
                        },
                        'dom':          '<<"row"<"col-xs-6"><"col-xs-6"p>><"row"<"col-xs-12"t>><"row"<"col-xs-6"i><"col-xs-6"p>>>',
                        'lengthChange': false,
                        'scrollX':      true,
                        'displayStart': start,
                        'pageLength':   30,
                        'language': tplVarTableText,
                        'order': [[ 1, 'desc' ]],
                        'columns': [
                            {
                                'data': null,
                                'defaultContent': ''
                            },
                            { 'data': 'orderedOn'},
                            { 'data': 'maxDispatchDate'},
                            { 'data': 'itemName'},
                            { 'data': 'itemArticleNumber'},
                            {
                                'data': null,
                                'defaultContent': ''
                            },
                            { 'data': 'saleRecordNumber'},
                            { 'data': 'source'},
                            { 'data': 'orderedFrom'},
                            { 'data': 'eta'},
                            { 'data': 'sentOutOn'},
                            { 'data': 'paymentStatus'},
                            { 'data': 'deliveryService'},
                            { 'data': 'invoiceNumber'},
                            { 'data': 'creditNoteNumber'},
                            { 'data': 'assignee'},
                            { 'data': 'id'},
                            { 'data': 'status'},
                            { 'data': 'commentsCount'},
                            { 'data': 'processToday'}
                        ],
                        'columnDefs': [
                            {
                                'targets': 0,
                                'searchable':false,
                                'orderable':false,
                                'width': '1%',
                                'className': 'text-center',
                                'render': function (data, type){
                                   return '<input class="check-line" type="checkbox" value="'+ data.id + '">';
                                }
                            },
                            {
                                'targets': 5,
                                'render': function(data) {
                                    if (data.warehouseRack) {
                                        return data.itemsAmount + " / " + data.warehouseRack;
                                    } else {
                                        return data.itemsAmount;
                                    }
                                }
                            },
                            { 'type': 'de_datetime', 'targets': 1 },
                            { 'type': 'de_datetime', 'targets': 2 },
                            { 'type': 'de_date', 'targets': 9 },
                            { 'type': 'de_date', 'targets': 10 },
                            { 'visible': false, 'targets': 16 },
                            { 'visible': false, 'targets': 17 },
                            { 'visible': false, 'targets': 18 },
                            { 'visible': false, 'targets': 19 }
                        ],
                        'createdRow': function(row, data) {
                            $(row).addClass(data['status']);
                            if (data['commentsCount'] > 0) {
                                try {
                                    var commentCell = $($(row).find('td').get(14));
                                    commentCell.append('<p><i class="icon fa fa-comments"></i> ' + data['commentsCount'] + '</p>');
                                    commentCell.click(function () {
                                        loadComments(data['id']);
                                    });
                                } catch (e) {
                                }
                            }

                            if (data['processToday']) {
                                try {
                                    $($(row).find('td').get(2)).html(
                                        '<span style="font-weight: bold; color:red;">' + tplTodayString + '</span>');
                                } catch (e) {
                                }
                            }

                            $('td:not(:first-child):not(:nth-child(15))', row).click(function () {
                                window.location = "/orders/edit?id=" + data['id'];
                            });
                        }
                    });

    table.on('page.dt', function () {
        try {
            history.pushState({}, "", "/orders?page=" + table.DataTable().page());
        } catch (e) {
        }
    });

    table.on('draw.dt', function () {
        $('th input:checkbox, td input:checkbox').iCheck({
            checkboxClass: 'icheckbox_minimal',
            increaseArea: '20%' // optional
        });

        $('#orders-select-all').on('ifChanged', function(){
            var isChecked = this.checked;
            var rows = table.dataTable().api().rows().nodes();
            $('input[type="checkbox"]', rows).each(function(index, element) {
                $(element).iCheck(isChecked ? 'check' : 'uncheck');
            });
        });

        $('.check-line').on('ifChanged', function(){
            checkTableRow(this);
        });
    });

    var checkTableRow = function (element) {
        if (element.checked) {
            selectedOrders.add(element.value);
        } else {
            $('#orders-select-all').prop('checked', false);
            $('#orders-select-all').iCheck('update');
            selectedOrders.remove(element.value);
        }

        var batchCommandMenu = $('#batchCommandMenu');
        if (selectedOrders.size() == 0 && batchCommandMenu.css('display') != 'none') {
            batchCommandMenu.css("display", "none");
        } else if (selectedOrders.size() > 0 && batchCommandMenu.css('display') == 'none') {
            batchCommandMenu.css("display", "block");
        }
    };

    var preDefinedFilterSelect = $('#preDefinedFilter');
    var configPane = $('#filter_config');
    var hideOrShowFilterConfig = function () {
        if (preDefinedFilterSelect.val() !== 'OTHER') {
            configPane.hide();
        } else {
            configPane.show();
        }
    };

    preDefinedFilterSelect.change(hideOrShowFilterConfig);

    var selectedOrders = function() {
        var orderIds = [];

        var push = function(value) {
            var numberValue = parseInt(value);
            var index = orderIds.indexOf(numberValue);
            if (index == -1) {
                orderIds.push(numberValue);
            }
        };

        var splice = function (value) {
            var numberValue = parseInt(value);
            var index = orderIds.indexOf(numberValue);
            if (index > -1) {
                orderIds.splice(index, 1);
            }
        };

        var size = function() {
            return orderIds.length;
        };

        var parameters = function () {
          return $.param({'orderIds' : sortedElements()}, true);
        };

        var sortedElements = function () {
            return orderIds.sort(function(a, b) {
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

    function loadComments(id) {
        var url = "/orders/comments?orderId=" + id;
        $.get(url, function(comments) {
            var content = '<ul>';
            for (comment in comments) {
                content += '<li>' + comments[comment].text + '</li>';
            }
            content += '</ul>';

            var modal = $('#commentModal');
            modal.find('#commentModalContent').html(content);
            modal.modal('show');
        });
    };

    $('#submitGenerateBatchInvoicesPdf').on('click', function() {
        window.location.href = '/orders/download_merged_invoice?' + selectedOrders.requestParameters();
    });

    $('#submitGenerateBatchInvoicesZip').on('click', function() {
        window.location.href = '/orders/download_archived_invoices?' + selectedOrders.requestParameters();
    });
});

