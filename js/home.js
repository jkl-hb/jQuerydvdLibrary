$(document).ready(function () {
    loadDvds();
    search();
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
                var notes = dvd.notes;
                var dvdId = dvd.dvdId;

                var row = '<tr>';
                row += '<input type="hidden" id="viewDvdId">' + dvdId;
                row += '<td><a href="" id="titleLink">' + title + '</a></td>';
                row += '<td>' + releaseYear + '</td>';
                row += '<td>' + director + '</td>';
                row += '<td>' + rating + '</td>';
                row += '<td><button type="button" class="btn btn-info" >Edit</button></td>';
                row += '<td><button type="button" class="btn btn-info" >Delete</button></td>';
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
        var pathVar = $('#searchfield').val();

        if (haveValidationErrors) {
            return false;
        }

        $.ajax({
            type: 'GET',
            url: 'http://dvd-library.us-east-1.elasticbeanstalk.com/dvds/' + searchCategory + '/' + pathVar,
            success: function (dvdArray) {
                $.each(dvdArray, function (index, dvd) {
                    var title = dvd.title;
                    var releaseYear = dvd.releaseYear;
                    var director = dvd.director;
                    var rating = dvd.rating;
                    var notes = dvd.notes;
                    var dvdId = dvd.dvdId;
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

function viewDetails() {
    $("#titleLink").click(function(){
        $('#mainPageDiv').hide();
        $('#dvdDetailsDiv').show();
        var pathVar = $('#viewDvdId').val()
        var detailsBody = $('#detailsBody');

        $.ajax({
            type: 'GET',
            url: 'http://dvd-library.us-east-1.elasticbeanstalk.com/dvd/' + pathVar,
            success: function (dvdArray) {
                $.each(dvdArray, function (index, dvd) {
                    var title = dvd.title;
                    var releaseYear = dvd.releaseYear;
                    var director = dvd.director;
                    var rating = dvd.rating;
                    var notes = dvd.notes;
                    var dvdId = dvd.dvdId;
    
                    $('#detailsTitle').text(title);
                    var detail = '<p>';
                    detail += '<p>' + releaseYear + '/<p>';
                    detail += '<p>' + director + '</p>';
                    detail += '<p>' + rating + '</p>';
                    detail += '<p>' + notes + '</p>';
                    detail += '<p>';
    
                    detailsBody.append(detail);
                })
            },
            error: function () {
                $('#errorMessages')
                    .append($('<li>')
                        .attr({ class: 'list-group-item list-group-item-danger' })
                        .text('Error calling web service. Please try again later.'));
            }
        });
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