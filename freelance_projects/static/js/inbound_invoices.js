$(document).ready(function () {
    $(function () {
        $('.datepicker').datetimepicker({
            language: '#{_.lang()}',
            format: 'DD.MM.YYYY'
        });
    });

    $('.deleteLineBtn').click(function () {
        if ($('#itemsTable tbody>tr').length > 1) {
            $(this).parentsUntil('tbody', 'tr').remove();
        }
        return false;
    });

    initFormUpdates();
    initSupplierDropDown();
    initCheckboxes();
});

var addNewItemsLine = function () {

    var orig = $('#itemsTable tbody>tr:last');

    var clone = orig.clone(true);

    clone.insertAfter('#itemsTable tbody>tr:last');

    $('#itemsTable tbody>tr:last .form-control').each(function () {
        $(this).val('');
    });
};

function submitCreateInboundInvoice() {
    prependItemLineNames();

    var formData = new FormData(document.getElementById("invoiceForm"));

    $.ajax({
        url: "/accounting/inbound/invoice/",
        type: 'POST',
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        success: function () {
            suggestModal(successfullyUpdatedInvoice, false, function () {
                window.location.href = '/accounting/inbound';
            });
        },
        error: function (error) {
            suggestModal(prepareExceptionContent(error.responseJSON.messages), true);
        }
    });
}

function submitUpdateInboundInvoice() {
    prependItemLineNames();
    var formData = new FormData(document.getElementById("invoiceForm"));

    $.ajax({
        url: "/accounting/inbound/invoice/" + $('#invoiceId').val(),
        type: 'POST',
        data: formData,
        contentType: false,
        processData: false,
        success: function () {
            suggestModal(successfullyUpdatedInvoice, false, function () {
                window.location.href = '/accounting/inbound';
            });
        },
        error: function (error) {
            suggestModal(prepareExceptionContent(error.responseJSON.messages), true);
        }
    });
}

function showInboundInvoiceDeleteModal() {
    $('#successDeleteModal').modal('show');
}

function submitDeleteInboundInvoice() {
    $.ajax({
        url: '/accounting/inbound/invoice/' + $('#invoiceId').val(),
        type: 'DELETE',
        headers: {
            'X-CSRF-TOKEN': $('#inputCsrfToken').val()
        }
    }).done(function () {
        window.location.href = '/accounting/inbound';
    });
}

var prependItemLineNames = function () {
    var counter = 0;
    $('#itemsTable tbody>tr').each(function () {
        $(this).find('.form-control').each(function () {
            var name = $(this).attr('name');
            if (!name.startsWith('items')) {
                $(this).attr('name', 'items[' + counter + '].' + name);
            }
        });
        counter++;
    });
};

var prepareExceptionContent = function (exceptions) {
    var content = exceptions.map(function (ex) {
        return '<li>' + ex + '</li>';
    }).reduce(function (previous, current) {
        return previous + current;
    })

    return '<ul>' + content + '</ul>';
}

function uploadInboundInvoiceFile() {
    if (!$("#importInboundInvoiceFile").val()) {
        return true;
    }

    var btn = $("#importInboundInvoiceBtn");
    var spinner = $("#importInboundInvoiceBtnSpinner");
    var error = $("#importInboundInvoiceBtnError");

    btn.attr("disabled", "disabled");
    spinner.removeClass('hide');
    error.addClass('hide');

    var formData = new FormData(document.getElementById("importInboundInvoiceForm"));
    formData.append("supplier", $("#upload-supplier").val());

    $.ajax({
        url: "/accounting/inbound/invoice/upload",
        type: 'POST',
        data: formData,
        contentType: false,
        processData: false,
        success: function (data) {
            populateForm(data);
            spinner.addClass('hide');
            btn.removeAttr("disabled");
            $('#upload-supplier').addClass('hide');
            $('#importInboundInvoiceBtn').addClass('hide');
            $("#importInboundInvoiceFile").val("");
        },
        error: function () {
            error.removeClass('hide');
            spinner.addClass('hide');
            btn.removeAttr("disabled");
            $("#importInboundInvoiceFile").val("");
        }
    });
}

function populateForm(data) {
    $('#invoiceNumber').val(data.invoiceNumber);
    $('#totalAmount').val(data.totalAmount);
    $('#payTill').val(data.payTill);
    $('#currency').val(data.currency);
    $('#invoiceDate').val(data.invoiceDate);
    $('#supplier').val(data.supplier);

    if (data.items) {
        var initialSize = $('#itemsTable tbody>tr').length;
        data.items.forEach(function (item) {
            addNewItemsLineWithData(item);
        });

        $('#itemsTable tbody > tr').slice(0, initialSize).remove();
    }
}

function addNewItemsLineWithData(item) {

    var clone = cloneLastItemsLine();

    clone.find('input').val('');

    clone.find('input[name="articleNumber"]').val(item.articleNumber);
    clone.find('input[name="description"]').val(item.description);
    clone.find('input[name="amount"]').val(item.amount);
    clone.find('input[name="quantity"]').val(item.quantity);
    clone.find('input[name="totalAmount"]').val(item.totalAmount);
}

var cloneLastItemsLine = function () {

    var orig = $('#itemsTable tbody>tr:last');

    var clone = orig.clone(true);

    clone.insertAfter('#itemsTable tbody>tr:last');

    return clone;
};

function initSupplierDropDown() {
    $.getJSON("/accounting/inbound/invoice/suppliers")
        .done(function (response) {
            $('#supplier').autocomplete({
                source: response
            });
        });
}
function initFormUpdates() {
    var isDirty = false;
    $('.form-control').change(function () {
        if ($(this).hasClass('ignore-change')) return;

        $(this).addClass('changed');
        isDirty = true;
    });

    $(window).bind('beforeunload', function (e) {
        if (isDirty) {
            return "#{_.i18n('orders.edit.warning.unsaved')}";
        } else {
            return undefined;
        }
    });

    window.resetDirty = function () {
        isDirty = false;
    };
}

function initCheckboxes() {
    $('#upload-to-warehouse').iCheck({
       checkboxClass: 'icheckbox_square-blue'
    });

    var $serviceSupplier = $('#service-supplier-checkbox');

    $serviceSupplier.iCheck({
        checkboxClass: 'icheckbox_square-blue'
    });

    $serviceSupplier.on('ifChecked', function () {
        $('#inboundInvoiceItems').hide();
        $('#upload-supplier').prop("disabled", true);
        $('#importInboundInvoiceBtn').prop("disabled", true);
        $('#itemsTable tbody').find('tr:gt(0)').remove();
        $('#itemsTable tbody > tr').find('td').each(function () {
            $(this).find('input').val('');
        });

        $('#itemsTable').hide();
    });

    $serviceSupplier.on('ifUnchecked', function () {
        $('#inboundInvoiceItems').show();
        $('#upload-supplier').prop("disabled", false);
        $('#importInboundInvoiceBtn').prop("disabled", false);
        $('#itemsTable').show();
    });
}
