$(document).ready(function () {
    loadDvds();
    search();
    $('#dvdDetailsDiv').hide();
    $('#editDiv').hide();
    $('#addDiv').hide();
});

function loadDvds() {
    clearDvdTable();
    var contentRows = $('#contentRows');

    $.ajax({
        type: 'GET',
        url: 'http://dvd-library.us-east-1.elasticbeanstalk.com/dvds',
        success: function (dvdArray) {
            $.each(dvdArray, function (index, dvd) {
                var title = dvd.title;
                var releaseYear = dvd.releaseYear;
                var director = dvd.director;
                var rating = dvd.rating;
                var dvdId = dvd.id;

                var row = '<tr>';
                row += '<td><a href="#" onclick="viewDetails(' + dvdId + ')">' + title + '</td>';
                row += '<td>' + releaseYear + '</td>';
                row += '<td>' + director + '</td>';
                row += '<td>' + rating + '</td>';
                row += '<td><button type="button" class="btn btn-info" onclick="showEditForm(' + dvdId + ')>Edit</button></td>';
                row += '<td><button type="button" class="btn btn-info" onclick="deleteDvd(' + dvdId + ')">Delete</button></td>';
                row += '</tr>';

                contentRows.append(row);
            })
        },
        error: function () {
            $('#errorMessages')
                .append($('<li>')
                    .attr({ class: 'list-group-item list-group-item-danger' })
                    .text('Error calling web service. Please try again later.'));
        }
    });
}

function search() {
    $('#searchButton').click(function (event) {
        var haveValidationErrors = checkAndDisplayValidationErrors($('#searchMenu').find('select,input'));
        var searchCategory = $('#searchCategory').val();
        var searchField = $('#searchfield').val();
        var contentRows = $('#contentRows');
        contentRows.empty();

        if (haveValidationErrors) {
            return false;
        }

        $.ajax({
            type: 'GET',
            url: 'http://dvd-library.us-east-1.elasticbeanstalk.com/dvds/' + searchCategory + '/' + searchField,
            success: function (dvdArray) {
                $.each(dvdArray, function (index, dvd) {
                    var title = dvd.title;
                    var releaseYear = dvd.releaseYear;
                    var director = dvd.director;
                    var rating = dvd.rating;
                    var dvdId = dvd.id;

                    var row = '<tr>';
                    row += '<td><a href="#" onclick="viewDetails(' + dvdId + ')">' + title + '</td>';
                    row += '<td>' + releaseYear + '</td>';
                    row += '<td>' + director + '</td>';
                    row += '<td>' + rating + '</td>';
                    row += '<td><button type="button" class="btn btn-info" onclick="showEditForm(' + dvdId + ')">Edit</button></td>';
                    row += '<td><button type="button" class="btn btn-info" onclick="deleteDvd(' + dvdId + ')">Delete</button></td>';
                    row += '</tr>';

                    contentRows.append(row);
                })
            },
            error: function () {
                $('#errorMessages')
                    .append($('<li>')
                        .attr({ class: 'list-group-item list-group-item-danger' })
                        .text('Error calling web service. Please try again later.'));
            }
        })
    });
}

function viewDetails(dvdId) {
    var detailsBody = $('#detailsBody');
    $('#mainPageDiv').hide();
    $('#dvdDetailsDiv').show();

    $.ajax({
        type: 'GET',
        url: 'http://dvd-library.us-east-1.elasticbeanstalk.com/dvd/' + dvdId,
        success: function (dvd) {
            var title = dvd.title;
            var releaseYear = dvd.releaseYear;
            var director = dvd.director;
            var rating = dvd.rating;
            var notes = dvd.notes;

            $('#detailsTitle').text(title);
            var body = '<p>';
            body += '<p>Release Year: ' + releaseYear + '</p>';
            body += '<p>Director: ' + director + '</p>';
            body += '<p>Rating: ' + rating + '</p>';
            body += '<p>Notes: ' + notes + '</p>';
            body += '</p>';

            detailsBody.append(body);
        },
        error: function () {
            $('#errorMessages')
                .append($('<li>')
                    .attr({ class: 'list-group-item list-group-item-danger' })
                    .text('Error calling web service. Please try again later.'));
        }
    });
}

function hideDetails() {
    $('#detailsTitle').empty();
    $('#detailsBody').empty();
    $('#dvdDetailsDiv').hide();
    $('#mainPageDiv').show();
}

function deleteDvd(dvdId) {
    $.confirm({
        title: 'Confirmation',
        content: 'Are you sure you want to delete this DVD from your collection?',
        buttons: {
            confirm: function () {
                $.ajax({
                    type: 'DELETE',
                    url: 'http://dvd-library.us-east-1.elasticbeanstalk.com/dvd/' + dvdId,
                    success: function () {
                        loadDvds();
                    },
                    error: function () {
                        $('#errorMessages')
                            .append($('<li>')
                                .attr({ class: 'list-group-item list-group-item-danger' })
                                .text('Error calling web service. Please try again later.'));
                    }
                });
            },
            cancel: function () {
            }
        }
    });
}

function editDvd(dvdId) {
    $.ajax({
        type: 'PUT',
        url: 'http://dvd-library.us-east-1.elasticbeanstalk.com/dvd/' + dvdId,
        data: JSON.stringify({
            title: $('#editTitle').val(),
            releaseYear: $('#editReleaseYear').val(),
            director: $('#editDirector').val(),
            rating: $('#editRating').val(),
            notes: $('#editNotes').val()
        }),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        'dataType': 'json',
        success: function () {
            $('#errorMessages').empty();
            $('#editTitle').val('');
            $('#editReleaseYear').val('');
            $('#editDirector').val('');
            $('#editRating').val('');
            $('#editNotes').val('');
            loadDvds();
        },
        error: function () {
            $('#errorMessages')
                .append($('<li>')
                    .attr({ class: 'list-group-item list-group-item-danger' })
                    .text('Error calling web service. Please try again later.'));
        }
    });
    hideEditForm();
}

function showEditForm(dvdId) {
    $('#errorMessages').empty();

    $.ajax({
        type: 'GET',
        url: 'http://dvd-library.us-east-1.elasticbeanstalk.com/dvd/' + dvdId,
        success: function (dvd, status) {
            $('#editHeader').text("Edit DVD: " + dvd.title);
            $('#editTitle').val(dvd.title);
            $('#editReleaseYear').val(dvd.releaseYear);
            $('#editDirector').val(dvd.director);
            $('#editRating').val(dvd.rating);
            $('#editNotes').val(dvd.notes);
            $('#editSaveButton').attr({class: 'onclick="editDvd()"' });
        },
        error: function () {
            $('#errorMessages')
                .append($('<li>')
                    .attr({ class: 'list-group-item list-group-item-danger' })
                    .text('Error calling web service. Please try again later.'));
        }
    })

    $('#mainPageDiv').hide();
    $('#editDiv').show();
}

function hideEditForm() {
    $('#editTitle').empty();
    $('#editForm').empty();
    $('#editDiv').hide();
    $('#mainPageDiv').show();
}

function addDvd() {
    $.ajax({
        type: 'GET',
        url: 'http://dvd-library.us-east-1.elasticbeanstalk.com/dvd',
        data: JSON.stringify({
            title: $('#addTitle').val(),
            releaseYear: $('#addReleaseYear').val(),
            director: $('#addDirector').val(),
            rating: $('#addRating').val(),
            notes: $('#addNotes').val()
        }),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        'dataType': 'json',
        success: function () {
            $('#errorMessages').empty();
            $('#addTitle').val('');
            $('#addReleaseYear').val('');
            $('#addDirector').val('');
            $('#addRating').val('');
            $('#addNotes').val('');
            loadDvds();
        },
        error: function () {
            $('#errorMessages')
                .append($('<li>')
                    .attr({ class: 'list-group-item list-group-item-danger' })
                    .text('Error calling web service. Please try again later.'));
        }
    })
    hideAddForm();
}

function showAddForm() {
    $('#errorMessages').empty();
    $('#mainPageDiv').hide();
    $('#addDiv').show();
}

function hideAddForm() {
    $('#addTitle').empty();
    $('#addForm').empty();
    $('#addDiv').hide();
    $('#mainPageDiv').show();
}

function clearDvdTable() {
    $('#contentRows').empty();
}

function checkAndDisplayValidationErrors(input) {
    $('#errorMessages').empty();

    var errorMessages = [];

    input.each(function () {
        if (!this.validity.valid) {
            var errorField = $('label[for=' + this.id + ']').text();
            errorMessages.push(errorField + ' ' + 'Both Search Category and Search Term are required.');
        }
    });

    if (errorMessages.length > 0) {
        $.each(errorMessages, function (index, message) {
            $('#errorMessages').append($('<li>').attr({ class: 'list-group-item list-group-item-danger' }).text(message));
        });
        // return true, indicating that there were errors
        return true;
    } else {
        // return false, indicating that there were no errors
        return false;
    }
}