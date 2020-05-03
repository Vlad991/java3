$(document).ready(function () {
    $.getJSON("/labels", function (data) {
        if (data.warehouseItemsWithoutRack > 0) {
            $('a[href="/warehouse"]').append('<small class="badge pull-right bg-red">' + data.warehouseItemsWithoutRack + '</small>')
        }

        if (data.deficitItems > 0) {
            $('a[href="/deficit"]').append('<small class="badge pull-right bg-red">' + data.deficitItems + '</small>')
        }
    });
});