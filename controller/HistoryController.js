

const HistoryController = {

    render() {
        const q    = $('#hist-search').val().toLowerCase();
        const list = [...DB.orders].reverse().filter(o =>
            !q || o.id.toLowerCase().includes(q) || o.customerName.toLowerCase().includes(q)
        );

        if (!list.length) {
            $('#history-list').html('<p class="empty-cell">No orders recorded yet</p>');
            return;
        }

        $('#history-list').html(list.map(o => `
            <div class="hist-card">
                <div class="hist-header" onclick="HistoryController.toggle('${o.id}')">
                    <div>
                        <code>${o.id}</code>
                        <span class="hist-cust">${o.customerName}</span>
                    </div>
                    <div class="hist-right">
                        <span class="hist-total">${fmt(o.grand)}</span>
                        <span class="hist-date">${o.date}</span>
                        <i class="bi bi-chevron-down" id="chev-${o.id}"></i>
                    </div>
                </div>
                <div class="hist-body" id="hbody-${o.id}">
                    <table class="tbl w-100">
                        <thead><tr><th>CODE</th><th>PART</th><th>QTY</th><th>UNIT</th><th>TOTAL</th></tr></thead>
                        <tbody>${o.items.map(it => `
                            <tr>
                                <td><code>${it.id}</code></td>
                                <td>${it.name}</td>
                                <td>${it.qty}</td>
                                <td>${fmt(it.price)}</td>
                                <td>${fmt(it.price * it.qty)}</td>
                            </tr>`).join('')}
                        </tbody>
                    </table>
                    <div class="hist-footer">
                        Subtotal: <strong>${fmt(o.subtotal)}</strong>
                        ${o.discount ? ` &nbsp;|&nbsp; Discount: <strong>${o.discount}%</strong>` : ''}
                        &nbsp;|&nbsp; Grand Total: <strong class="amber">${fmt(o.grand)}</strong>
                    </div>
                </div>
            </div>`).join(''));
    },

    toggle(id) {
        $(`#hbody-${id}`).toggleClass('open');
        $(`#chev-${id}`).toggleClass('bi-chevron-down bi-chevron-up');
    }
};
