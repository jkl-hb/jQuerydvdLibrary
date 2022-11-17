$(document).ready(function () {
    loadDvds();
    addDvd();
    search();
    $('#dvdDetailsDiv').hide();
});

function loadDvds() {
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
                row += '<td><button type="button" class="btn btn-info" >Edit</button></td>';
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
                    var notes = dvd.notes;
                    var dvdId = dvd.id;
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
            var detail = '<p>';
            detail += '<p>Release Year: ' + releaseYear + '</p>';
            detail += '<p>Director: ' + director + '</p>';
            detail += '<p>Rating: ' + rating + '</p>';
            detail += '<p>Notes: ' + notes + '</p>';
            detail += '</p>';

            detailsBody.append(detail);
        },
        error: function () {
            $('#errorMessages')
                .append($('<li>')
                    .attr({ class: 'list-group-item list-group-item-danger' })
                    .text('Error calling web service. Please try again later.'));
        }
    });
}

function back() {
    $('#detailsBody').empty();
    $('#dvdDetailsDiv').hide();
    $('#mainPageDiv').show();
}

function deleteDvd(dvdId) {
    $.confirm({
        title: 'Delete DVD',
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

function clearDVDMenu() {
    $('#createButton').on("click", function(){

        $('#dvdTable').hide();
        $('#createButton').hide();

        })

    };

    function addDvd() {
        $('#createButton').click(function (event) {
            $.ajax({
               type: 'POST',
               url: 'http://dvd-library.us-east-1.elasticbeanstalk.com/dvds',
               data: JSON.stringify({
                    title: $('#addDVDTitle').val(),
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
               success: function() {
                   $('#errorMessages').empty();
                   $('#addDVDTitle').val('');
                   $('#addReleaseYear').val('');
                   $('#addDirector').val('');
                   $('#addRating').val('');
                   $('#addNotes').val('');
                   loadDvds();
               },
               error: function () {
                   $('#errorMessages')
                    .append($('<li>')
                    .attr({class: 'list-group-item list-group-item-danger'})
                    .text('Error calling web service. Please try again later.')); 
               }
            })
        });
    }