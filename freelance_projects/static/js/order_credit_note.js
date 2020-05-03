function submitCreditNote() {
  $('#creditNoteEditForm').attr('action', '/orders/generate_credit_note').submit();
}

function onIncludeCheckboxChange(e) {
  var row = $(e.target).closest('tr');
  if (e.target.checked) {
    row.addClass("credit-note-include");
  } else {
    row.removeClass("credit-note-include");
  }
}

$('input[type="checkbox"]:not(#selectAllItems)').on('ifToggled', onIncludeCheckboxChange);

$('input[type="checkbox"]:not(#selectAllItems)').trigger('ifToggled');

$('#selectAllItems').on('ifToggled', function (e) {
  $('#itemsTable tbody input[type="checkbox"]:not(#selectAllItems)').iCheck(e.target.checked ? 'check' : 'uncheck');
});