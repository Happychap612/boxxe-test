$(document).ready(function () {
    $("#js-fetch").click(function () {
        $(this).addClass('d-none');
        jsRawFetch();

        $('#javascript-data').removeClass('d-none');
    });
});

/**
 * Fetch data from the fakestoreapi.com and display it in a table.
 * This is done using jquery because it is simply our raw fetch
 */
function jsRawFetch() {
    var data

    // do the fetch with raw javascript
    fetch('https://fakestoreapi.com/products')
        .then(res => res.json())
        .then(json => data = json);

    // push the data to the table using jquery and data tables
    $('#js-raw').DataTable({
        info: false,
        ordering: false,
        searching: false,
        scrollY: "300px",
        lengthChange: false,
        data: json,
        columns: [
            { title: 'ID', data: 'id' },
            { title: 'Title', data: 'title' },
            { title: 'Price', data: 'price' },
            { title: 'Description', data: 'description' },
            { title: 'Category', data: 'category' },
            { title: 'Image', data: 'image' },
            { title: 'Rating (Count)', data: function (row) { return `${row.rating.rate} (${row.rating.count})` } },
        ],
    });
}