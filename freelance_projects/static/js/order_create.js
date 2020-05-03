var fieldsWithAutocomplete = ['name', 'articleNumber', 'referenceNumberOE', 'referenceNumberOEM', 'referenceNumberOther'];

var bindAutocomplete = function (row) {
  for (var i = 0; i < fieldsWithAutocomplete.length; i++) {
    bindFieldAutocomplete(row, fieldsWithAutocomplete[i]);
  }
};

var bindFieldAutocomplete = function (row, fieldName) {
  var fieldQuery = "input[name='" + fieldName + "']";
  try {
    $(row).find(fieldQuery).autocomplete({source: "/items?field=" + fieldName, minLength: 3});
  } catch (e) {
  }
};

var unbindAutocomplete = function (elem) {
  for (var i = 0; i < fieldsWithAutocomplete.length; i++) {
    try {
      $(elem).find("input[name='" + fieldsWithAutocomplete[i] + "']").autocomplete("destroy");
    } catch (e) {
    }
  }
};

var cloneLastItemsLine = function () {

  var orig = $('#itemsTable tbody>tr:last');

  unbindAutocomplete(orig);

  var clone = orig.clone(true);

  bindAutocomplete(orig);
  bindAutocomplete(clone);

  clone.insertAfter('#itemsTable tbody>tr:last');

  return clone;

};

var addNewItemsLine = function () {

  cloneLastItemsLine();

  $('#itemsTable tbody>tr:last .form-control').each(function () {
    var fieldName = $(this).attr('name');
    if (fieldName !== 'name' && fieldName !== 'priceCurrency') {
      $(this).val('');
    }
  });

};

var addNewItemsLineWithData = function (data) {

  var clone = cloneLastItemsLine();

  clone.find('input').val('');

  clone.find('input[name="name"]').val(data.name);
  clone.find('input[name="articleNumber"]').val(data.articleNumber);
  clone.find('input[name="amount"]').val(data.amount);
  clone.find('input[name="priceNettoAmount"]').val(data.priceNettoAmount);
  clone.find('input[name="discountPercentage"]').val(data.discountPercentage);
  clone.find('input[name="referenceNumberOE"]').val(data.referenceNumberOE);
  clone.find('input[name="referenceNumberOEM"]').val(data.referenceNumberOEM);
  clone.find('input[name="referenceNumberOther"]').val(data.referenceNumberOther);

};

var prependItemLineNames = function () {
  var counter = 0;
  $('#itemsTable tbody>tr').each(function () {
    $(this).find('.form-control').each(function () {
      $(this).attr('name', 'items[' + counter + '].' + $(this).attr('name'));
    });
    counter++;
  });
};

$('.deleteLineBtn').click(function () {
  if ($('#itemsTable tbody>tr').length > 1) {
    $(this).parentsUntil('tbody', 'tr').remove();
  }
  return false;
});

var fillIfEmptyFn = function (elementId, otherElementId) {
  return function () {
    var otherElement = $('#' + otherElementId);
    if (!otherElement.val()) {
      otherElement.val($('#' + elementId).val());
    }
  };
};

var addListener = function (elements) {
  for (var i = 0; i < elements.length; i++) {
    for (var j = 0; j < elements.length; j++) {
      if (i !== j) {
        $('#' + elements[i]).change(fillIfEmptyFn(elements[i], elements[j]));
      }
    }
  }
};

addListener(['customerName', 'deliveryName', 'billingName']);
addListener(['customerPhone', 'deliveryPhone', 'billingPhone']);
addListener(['deliveryCompany', 'billingCompany']);
addListener(['deliveryStreet1', 'billingStreet1']);
addListener(['deliveryStreet2', 'billingStreet2']);
addListener(['deliveryPostalCode', 'billingPostalCode']);
addListener(['deliveryCity', 'billingCity']);
addListener(['deliveryCountry', 'billingCountry']);

bindAutocomplete($("#itemsTable tbody>tr:first"));

function submitCreateOrder() {
  prependItemLineNames();
  $('#orderEditForm').attr('action', '/orders/create').submit();
}

function submitSaveDraft() {
  prependItemLineNames();
  $('#orderEditForm').attr('action', '/orders/save_draft').submit();
}

function submitAdvancedEditOrder() {
  prependItemLineNames();
  $('#orderEditForm').attr('action', '/orders/advanced_edit').submit();
}

function itemsSuggestionModalCallback(data) {
  addNewItemsLine();
  $('#itemsTable tbody>tr:last .form-control').each(function () {
    var fieldName = $(this).attr('name');
    switch (fieldName) {
      case "name" :
        $(this).val(data['itemName']);
        break;
      case "articleNumber" :
        $(this).val(data['itemArticleNumber']);
        break;
      case "amount" :
        $(this).val(1);
        break;
      case "priceNettoAmount" :
        $(this).val(data['itemPriceNetto']);
        break;
      case "referenceNumberOE" :
        $(this).val(data['itemReferenceOe']);
        break;
      case "referenceNumberOEM" :
        $(this).val(data['itemReferenceOem']);
        break;
      case "referenceNumberOther" :
        $(this).val(data['itemReferenceOther']);
        break;
      case "discountAmount" :
        $(this).val('0,00');
        break;
      case "discountPercentage" :
        $(this).val('0');
        break;
    }
  });
}

function uploadItemsFile() {

  if (!$("#importItemsFile").val()) {
    return true;
  }

  var btn = $("#importItemsBtn");
  var spinner = $("#importItemsBtnSpinner");
  var error = $("#importItemsBtnError");

  btn.attr("disabled", "disabled");
  spinner.removeClass('hide');
  error.addClass('hide');

  var formData = new FormData(document.getElementById("importItemsForm"));

  $.ajax({
    url: "/items/parse_csv",
    type: 'POST',
    data: formData,
    contentType: false,
    processData: false,
    success: function (data) {
      data.forEach(function (e) {
        addNewItemsLineWithData(e);
      });
      spinner.addClass('hide');
      btn.removeAttr("disabled");
      $("#importItemsFile").val("");
    },
    error: function () {
      error.removeClass('hide');
      spinner.addClass('hide');
      btn.removeAttr("disabled");
      $("#importItemsFile").val("");
    }
  });

}