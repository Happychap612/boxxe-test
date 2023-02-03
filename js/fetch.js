$(document).ready(function () {
    $("#js-fetch").click(function () {
        $(this).addClass('d-none');

        fetchAndProcess();
    });
});

function displayData(data) {
    $('#javascript-data').removeClass('d-none');

    var jsonViewerSettings = { collapsed: true };

    $('#js-raw').jsonViewer(data.raw, jsonViewerSettings);
    $('#js-incStock').jsonViewer(data.incStock, jsonViewerSettings);
    $('#js-noRating').jsonViewer(data.noRating, jsonViewerSettings);
    $('#js-grouped').jsonViewer(data.grouped, jsonViewerSettings);
    $('#js-jewelleryMargin').jsonViewer(data.jewelleryMargin, jsonViewerSettings);
    $('#js-electronicsMargin').jsonViewer(data.electronicsMargin, jsonViewerSettings);
    $('#js-finalMargin').jsonViewer(data.finalMargin, jsonViewerSettings);
}

/**
 * Fetch data from the fakestoreapi.com and process it
 */
function fetchAndProcess() {
    var data = { // cumulative data array. at each step the data should be a little closer to the final result
        raw: [], // unfiltered untouched product data
        incStock: [], // product data with rating count as stock
        noRating: [], // product data with no rating
        grouped: [], // product data grouped by category
        jewelleryMargin: [], // product data with 10% gross margin for jewellery
        electronicsMargin: [], // product data with 25% gross margin anjd 10% markdown for electronics
        finalMargin: [], // product data with 10% gross margin for all other categories
    }

    // do the fetch with raw javascript
    fetch('https://fakestoreapi.com/products')
        .then(res => res.json())
        .then(json => {
            data.raw = json

            // get categories ready for later

            // now call process functions
            data.incStock = incStock(copyData(data.raw));
            data.noRating = noRating(copyData(data.incStock));
            data.grouped = grouped(copyData(data.noRating));
            data.jewelleryMargin = jewelleryMargin(copyData(data.grouped));
            data.electronicsMargin = electronicsMargin(copyData(data.jewelleryMargin));
            data.finalMargin = finalMargin(copyData(data.electronicsMargin));

            // display the data
            displayData(data);
        });
}

function copyData(data) {
    return JSON.parse(JSON.stringify(data));
}

// ---- Individual processing functions ----
// In theory these functions can be called in any order apart fromt incStock which must be called first
// This is because noRating will remove the rating object from the data and incStock relies on it

/**
 * Uses the rating count as the stock value, if there is no rating then stock is 0
 * 
 * @param {object} data 
 * @returns {object}
 */
function incStock(data) {
    data.forEach(product => {
        if (product.rating) {
            product.stock = product.rating.count;
        } else {
            product.stock = 0;
        }
    });
    return data;
}

/**
 * Removes the rating object from the data
 * 
 * @param {object} data 
 * @returns {object}
 */
function noRating(data) {
    data.forEach(product => {
        if (product.rating) {
            delete product.rating;
        }
    });
    return data;
}

/**
 * Groups the data by product category
 * 
 * @param {object} data 
 * @returns {object}
 */
function grouped(data) {
    var toReturn = {};

    data.forEach(product => {
        if (!toReturn[product.category]) {
            toReturn[product.category] = [];
        }
        toReturn[product.category].push(product);
    });
    return toReturn;
}

/**
 * Adds 10% gross margin to jewellery products
 * 
 * @param {object} data 
 * @returns {object}
 */
function jewelleryMargin(data) {
    data.jewelery.forEach(product => {
        product.price = (product.price * 1.1).toFixed(2);
    });
    return data;
}

/**
 * Adds 25% gross margin and 10% markdown to electronics products
 * 
 * @param {object} data 
 * @returns {object}
 */
function electronicsMargin(data) {
    data.electronics.forEach(product => {
        product.price = (product.price * 1.25 * 0.9).toFixed(2);
    });
    return data;
}

/**
 * Adds 10% fixed markup to all other products
 * 
 * @param {object} data 
 * @returns {object}
 */
function finalMargin(data) {
    var categories = Object.keys(data);
    categories.forEach(category => {
        if (category === 'jewelery' || category === 'electronics') {
            return;
        }
        data[category].forEach(product => {
            product.price = (product.price * 1.1).toFixed(2);
        });
    });
    return data;
}