// ── HELPERS ─────────────────────────────────

function fmt(n) {
    return 'Rs ' + parseFloat(n).toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function nowStr() {
    return new Date().toLocaleString('en-GB', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
}

function toast(msg, type = 'success') {
    const icons = { success: 'bi-check-circle-fill', error: 'bi-x-circle-fill', warn: 'bi-exclamation-triangle-fill' };
    const $t = $(`<div class="toast-msg toast-${type}"><i class="bi ${icons[type]}"></i><span>${msg}</span></div>`);
    $('#toast-wrap').append($t);
    setTimeout(() => { $t.addClass('hide'); setTimeout(() => $t.remove(), 300); }, 2800);
}

function clearInputs(...ids) {
    ids.forEach(id => $(`#${id}`).val('').removeClass('is-invalid'));
}

function navigate(page) {
    $('.page').hide();
    $('.nav-item').removeClass('active');
    $(`#page-${page}`).show();
    $(`.nav-item[data-page="${page}"]`).addClass('active');
    if (page === 'dashboard')  DashController.render();
    if (page === 'customers')  CustomerController.loadTable();
    if (page === 'items')      ItemController.loadTable();
    if (page === 'order')      OrderController.init();
    if (page === 'history')    HistoryController.render();
}

// Live clock
setInterval(() => {
    $('#live-time').text(new Date().toLocaleTimeString('en-GB'));
}, 1000);
