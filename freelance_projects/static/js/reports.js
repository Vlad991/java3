$(document).ready(function () {
    $(function () {
        $('.datepicker').datetimepicker({
            language: language,
            format: 'DD.MM.YYYY'
        });
    });
});

function showGenerationModal() {
    $('#reportGenerationModal').modal('show');
}

function submitReportGeneration() {
    $('#reportGenerationModal').modal('hide');
    $('#generateReportForm').submit(function (e) {
        $.ajax({
            type: 'PUT',
            url: '/accounting/reports',
            data: $('#generateReportForm').serialize()
        }).done(function () {
            $('#successSentModal').modal('show');
        }).fail(function (error) {
            var modal = $('#errorModal');
            modal.find('.modal-body').html("<h5>" + prepareExceptionContent(error.responseJSON.messages) + "</h5>");
            modal.modal('show');
        });

        e.preventDefault();
    });
}

function deleteReport(id) {
    $('#deleteReportModal').modal('show');
    $('#delete-report-modal-btn').click(function () {
        $('#deleteReportModal').modal('hide');
        $.ajax({
            type: 'DELETE',
            headers: {'X-CSRF-TOKEN': $('#form-token').val()},
            url: '/accounting/reports/' + id
        }).done(function () {
            window.location = '/accounting/reports/';
        }).fail(function (error) {
            var modal = $('#errorModal');
            modal.find('.modal-body').html("<h5>" + prepareExceptionContent(error.responseJSON.messages) + "</h5>");
            modal.modal('show');
        })
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