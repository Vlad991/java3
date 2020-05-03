$(document).ready(function() {
    bindRadioButtons();
    bindWarehousePriceButton();
    $(function () {
        $('.datepicker').datetimepicker({
            language: '#{_.lang()}',
            format: 'DD.MM.YYYY'
        });
    });
});

function bindWarehousePriceButton() {
    $('#importWarehouseItemPricesBtn').click(function() {
        $('#importWarehouseItemPricesFile').click();
    });

    $('#importWarehouseItemPricesFile').change(function() {
        uploadWarehouseItemPriceFile();
    });
}

function bindRadioButtons() {
    $('input[type=radio]').each(function () {
        $(this).iCheck({
            radioClass: 'icheckbox_square-blue'
        });

        if($(this).attr('name') === "itemCreate") {
            $(this).on('ifChecked', function () {
                if (this.value === 'true') {
                    $('#additionalInfo').show();
                    $('#warehouseAmount').parent().find('label').text(warehouseAmountText);
                } else {
                    $('#additionalInfo').hide();
                    $('#warehouseAmount').parent().find('label').text(addToWarehouseAmountText);
                }
            });
        }
    });
}

function uploadWarehouseItemPriceFile() {
    var btn = $("#importWarehouseItemPricesBtn");
    var spinner = $("#importWarehouseItemPricesBtnSpinner");
    var error = $("#importWarehouseItemPricesBtnError");

    btn.attr("disabled", "disabled");
    spinner.removeClass('hide');
    error.addClass('hide');

    var formData = new FormData(document.getElementById("importWarehouseItemPricesForm"));

    $.ajax({
        url: "/warehouse/prices/upload",
        type: 'POST',
        data: formData,
        contentType: false,
        processData: false,
        success: function () {
            spinner.addClass('hide');
            btn.removeAttr("disabled");
            $("#importWarehouseItemPricesFile").val("");
        },
        error: function () {
            error.removeClass('hide');
            spinner.addClass('hide');
            btn.removeAttr("disabled");
            $("#importWarehouseItemPricesFile").val("");
        }
    });
}

function uploadSupplierItemsFile() {
    if (!$("#importSupplierItemsFile").val()) {
        return true;
    }

    var btn = $("#importSupplierItemsBtn");
    var spinner = $("#importSupplierItemsBtnSpinner");
    var error = $("#importSupplierItemsBtnError");

    btn.attr("disabled", "disabled");
    spinner.removeClass('hide');
    error.addClass('hide');

    var formData = new FormData(document.getElementById("importSupplierItemsForm"));
    formData.append("supplier", $('#importSupplierItemsSelect').val());

    $.ajax({
        url: "/warehouse/supplier",
        type: 'POST',
        data: formData,
        contentType: false,
        processData: false,
        success: function (data) {
            spinner.addClass('hide');
            btn.removeAttr("disabled");
            $("#importSupplierItemsFile").val("");
            location.reload(true);
        },
        error: function () {
            error.removeClass('hide');
            spinner.addClass('hide');
            btn.removeAttr("disabled");
            $("#importSupplierItemsFile").val("");
        }
    });
}

function uploadWarehouseItemsFile() {
    if (!$("#importWarehouseItemsFile").val()) {
        return true;
    }

    var btn = $("#importWarehouseItemsBtn");
    var spinner = $("#importWarehouseItemsBtnSpinner");
    var error = $("#importWarehouseItemsBtnError");

    btn.attr("disabled", "disabled");
    spinner.removeClass('hide');
    error.addClass('hide');

    var formData = new FormData(document.getElementById("importWarehouseItemsForm"));

    $.ajax({
        url: "/warehouse/upload",
        type: 'POST',
        data: formData,
        contentType: false,
        processData: false,
        success: function (data) {
            spinner.addClass('hide');
            btn.removeAttr("disabled");
            $("#importWarehouseItemsFile").val("");
            var uploadModal = $('#uploadModal');
            var modalBody = uploadModal.find('.modal-body');

            $(modalBody).append('<div>');
            $(modalBody).append('<ul>');
            $(modalBody).append('<li>' + successfullyUploadedMessage + ': ' + data.successfulUpload + '</li>');
            $(modalBody).append('<li>' + duplicatesMessage + ': ' + data.duplicates + '</li>');
            $(modalBody).append('</ul>');

            if (data.invalidArticles.length > 0) {
                var list = '<h5>' + articlesNotFoundMessageHeader + '</h5><ul>';
                for (index in data.invalidArticles) {
                    list += '<li>' + data.invalidArticles[index] + '</li>';
                }
                list += '</ul>';
                $(modalBody).append(list);
            }

            $(modalBody).append('</div>');

            uploadModal.modal('show');
        },
        error: function () {
            error.removeClass('hide');
            spinner.addClass('hide');
            btn.removeAttr("disabled");
            $("#importWarehouseItemsFile").val("");
        }
    });
}

function uploadWarehouseItemsSizeFile() {
    if (!$("#importWarehouseItemsSizeFile").val()) {
        return true;
    }

    var btn = $("#importWarehouseItemsSizeBtn");
    var spinner = $("#importWarehouseItemsSizeBtnSpinner");
    var error = $("#importWarehouseItemsSizeBtnError");

    btn.attr("disabled", "disabled");
    spinner.removeClass('hide');
    error.addClass('hide');

    var formData = new FormData(document.getElementById("importWarehouseItemsSizeForm"));

    $.ajax({
        url: "/dimensions/",
        type: 'POST',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response) {
            spinner.addClass('hide');
            btn.removeAttr("disabled");
            $("#importWarehouseItemsSizeFile").val("");

            var uploadModal = $('#dimensionsUploadModal');
            var modalBody = uploadModal.find('.modal-body');
            $(modalBody).empty();

            if (response.isEmpty) {
                $(modalBody).append('<h5>' + emptyFileMessage + '</h5>');
            } else {
                var list = '<ul><li>' + dimensionTotalUpload + ': ' + response.totalUploaded + '</li>';
                list += '<li>' + dimensionTotalUpdated + ': ' + response.updated + '</li></ul>';

                $(modalBody).append(list);
            }

            uploadModal.modal('show');
        },
        error: function () {
            error.removeClass('hide');
            spinner.addClass('hide');
            btn.removeAttr("disabled");
            $("#importWarehouseItemsFile").val("");
        }
    });
}

function submitCreateWarehouseItem() {
    var data = {};
    $('#warehouseItemEditForm').serializeArray().map(function(x) {
        data[x.name] = x.value;
    });

    if ($.parseJSON(data.itemCreate)) {
        $('#warehouseItemEditForm').attr('action', '/warehouse/create').submit();
    } else {
        window.location.href = '/warehouse/update?articleNumber=' + data.articleNumber + '&amount=' + data.warehouseAmount;
    }
}

function submitEditWarehouseItem() {
    $('#warehouseItemEditForm').attr('action', '/warehouse/edit').submit();
}
