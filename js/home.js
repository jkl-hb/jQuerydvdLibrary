$(document).ready(function () {
    loadDvds();
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
    });
}

function search() {
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
    var title = $('#editTitle').val();
    var releaseYear = $('#editReleaseYear').val();
    var director = $('#editDirector').val();
    var rating = $('#editRating').val();
    var notes = $('#editNotes').val();

    var haveValidationErrors = checkAndDisplayValidationErrors($('#editForm').find('select,input'));

    if (haveValidationErrors) {
        return false;
    }

    $.ajax({
        type: 'PUT',
        url: 'http://dvd-library.us-east-1.elasticbeanstalk.com/dvd/' + dvdId,
        data: JSON.stringify({
            dvdId: dvdId,
            title: title,
            releaseYear: releaseYear,
            director: director,
            rating: rating,
            notes: notes
        }),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        'dataType': 'json',
        success: function () {
            console.log("Success");
            $('#errorMessages').empty();
            $('#editTitle').val('');
            $('#editReleaseYear').val('');
            $('#editDirector').val('');
            $('#editRating').val('');
            $('#editNotes').val('');
            hideEditForm();
            loadDvds();
        },
        error: function () {
            console.log("Error");
            $('#editErrorMessages')
                .append($('<li>')
                    .attr({ class: 'list-group-item list-group-item-danger' })
                    .text('Error calling web service. Please try again later.'));
        }
    });
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
            $('#editSaveButton').attr({ onclick: 'editDvd(' + dvdId + ')' });
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
    var title = $('#addTitle').val();
    var releaseYear = $('#addReleaseYear').val();
    var director = $('#addDirector').val();
    var rating = $('#addRating').val();
    var notes = $('#addNotes').val();

    var haveValidationErrors = checkAndDisplayValidationErrors($('#addForm').find('select,input'));

    if (haveValidationErrors) {
        return false;
    }

    $.ajax({
        type: 'POST',
        url: 'http://dvd-library.us-east-1.elasticbeanstalk.com/dvd',
        data: JSON.stringify({
            title: title,
            releaseYear: releaseYear,
            director: director,
            rating: rating,
            notes: notes
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
            hideAddForm();
            loadDvds();
        },
        error: function () {
            $('#addErrorMessages')
                .append($('<li>')
                    .attr({ class: 'list-group-item list-group-item-danger' })
                    .text('Error calling web service. Please try again later.'));
        }
    });
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