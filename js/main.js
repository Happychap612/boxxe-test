$(document).ready(function () {
    $(".nav-link").click(function () {
        var page = $(this).attr('id');

        $('.nav-link').removeClass('active');
        $(this).addClass('active');

        $(`.content-holders`).addClass('d-none');
        $(`#${page}-content`).removeClass('d-none');
    });
});