$(document).ready(function () {
    $("#js-fetch").click(function () {
        $(this).addClass('d-none');

        fetchAndProcess();
    });

    $("#php-fetch").click(function () {
        $(this).addClass('d-none');

        fetch('php/main.php')
            .then(res => res.json())
            .then(json => {
                $('#php-raw').removeClass('d-none');
                $('#php-raw').text(JSON.stringify(json, null, 2));
            });
    });
});

/**
 * Fetch data from the fakestoreapi.com and process it
 */
function fetchAndProcess() {
    fetch('https://fakestoreapi.com/products')
        .then(res => res.json())
        .then(json => {
            var data = {};
            var products = json.map(product => {
                product.stock = product.rating.count ?? 0;

                delete product.rating;

                if (product.category === 'electronics') {
                    product.price = (product.price * 1.25 * 0.9).toFixed(2);
                } else {
                    product.price = (product.price * 1.1).toFixed(2);
                }

                return product;
            });

            products.forEach(product => {
                if (!data[product.category]) {
                    data[product.category] = [];
                }
                data[product.category].push(product);
            });

            // display the data
            $('#js-raw').removeClass('d-none');
            $('#js-raw').text(JSON.stringify(data, null, 2));(data);
        });
}