<?php

$url = "https://fakestoreapi.com/products";
$data = file_get_contents($url);
$json = json_decode($data, true);

$products = array_map(function($product) {
    $product['stock'] = $product['rating']['count'] ?? 0;
    unset($product['rating']);

    if ($product['category'] === 'electronics') {
        $product['price'] = round(
            $product['price'] * 1.25 * 0.9
        , 2);
    } else {
        $product['price'] = round(
            $product['price'] * 1.1
        , 2);
    }

    return $product;
}, $json);


$toReturn = [];
foreach ($products as $product) {
    $toReturn[$product['category']][] = $product;
}

echo json_encode($toReturn);
