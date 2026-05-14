// ── ORDER CONTROLLER ────────────────────────

const OrderController = {

    init() {
        // Refresh customer dropdown
        $('#order-customer').html('<option value="">— Select Customer —</option>' +
            DB.customers.map(c => `<option value="${c.id}">${c.name} (${c.phone})</option>`).join(''));
        this.renderGrid();
        this.renderCart();
        $('#order-discount').val(0);
        $('#order-cash').val('');
    },

    renderGrid() {
        const q = $('#order-search').val().toLowerCase();
        const list = DB.items.filter(i =>
            !q || i.name.toLowerCase().includes(q) || i.id.toLowerCase().includes(q)
        );

        if (!list.length) {
            $('#order-grid').html('<p class="empty-cell" style="grid-column:1/-1">No parts found</p>');
            return;
        }

        $('#order-grid').html(list.map(i => {
            const inCart = DB.cart.find(c => c.id === i.id);
            const out    = i.qty === 0;
            return `
            <div class="part-tile ${inCart ? 'selected' : ''} ${out ? 'disabled' : ''}"
                 onclick="${out ? '' : `OrderController.addToCart('${i.id}')`}">
                <div class="tile-code">${i.id}</div>
                <div class="tile-name">${i.name}</div>
                <div class="tile-price">${fmt(i.price)}</div>
                <div class="tile-stock ${i.qty === 0 ? 'badge-out' : i.qty <= 5 ? 'badge-low' : 'badge-ok'}">
                    ${out ? 'OUT' : i.qty + ' left'}
                </div>
                ${inCart ? '<div class="tile-check"><i class="bi bi-check-circle-fill"></i></div>' : ''}
            </div>`;
        }).join(''));
    },

    addToCart(id) {
        const item  = DB.getItem(id);
        if (!item || item.qty === 0) return;
        const entry = DB.cart.find(c => c.id === id);
        if (entry) {
            if (entry.qty < item.qty) entry.qty++;
            else { toast(`Max stock: ${item.qty}`, 'warn'); return; }
        } else {
            DB.cart.push({ id: item.id, name: item.name, price: item.price, qty: 1, maxQty: item.qty });
        }
        this.renderCart();
        this.renderGrid();
    },

    removeFromCart(id) {
        DB.cart = DB.cart.filter(c => c.id !== id);
        this.renderCart();
        this.renderGrid();
    },

    updateQty(id, val) {
        const entry = DB.cart.find(c => c.id === id);
        if (!entry) return;
        const n = parseInt(val);
        entry.qty = isNaN(n) || n < 1 ? 1 : n > entry.maxQty ? entry.maxQty : n;
        this.renderCart();
    },

    renderCart() {
        if (!DB.cart.length) {
            $('#cart-items').html('<p class="empty-cell">No parts added yet</p>');
            $('#cart-summary').hide();
            return;
        }

        $('#cart-items').html(DB.cart.map(c => `
            <div class="cart-row">
                <div class="cart-info">
                    <div class="cart-name">${c.name}</div>
                    <div class="cart-sub">${c.id} · ${fmt(c.price)} each</div>
                </div>
                <input type="number" class="qty-input" value="${c.qty}" min="1" max="${c.maxQty}"
                    onchange="OrderController.updateQty('${c.id}', this.value)">
                <div class="cart-total">${fmt(c.price * c.qty)}</div>
                <button class="btn-remove" onclick="OrderController.removeFromCart('${c.id}')">
                    <i class="bi bi-x-lg"></i>
                </button>
            </div>`).join(''));

        $('#cart-summary').show();
        this.recalc();
    },

    recalc() {
        const sub   = DB.cart.reduce((s, c) => s + c.price * c.qty, 0);
        const disc  = Math.max(0, Math.min(100, parseFloat($('#order-discount').val()) || 0));
        const grand = sub * (1 - disc / 100);
        const cash  = parseFloat($('#order-cash').val()) || 0;
        const change = Math.max(0, cash - grand);

        $('#ot-sub').text(fmt(sub));
        $('#ot-grand').text(fmt(grand));

        if (cash > 0 && cash < grand) {
            $('#ot-change').text('⚠ Insufficient').css('color', 'var(--danger)');
        } else {
            $('#ot-change').text(fmt(change)).css('color', 'var(--success)');
        }
    },

    placeOrder() {
        const custId = $('#order-customer').val();
        if (!custId) { toast('Select a customer first', 'error'); return; }
        if (!DB.cart.length) { toast('Add at least one part', 'error'); return; }

        const sub   = DB.cart.reduce((s, c) => s + c.price * c.qty, 0);
        const disc  = Math.max(0, Math.min(100, parseFloat($('#order-discount').val()) || 0));
        const grand = sub * (1 - disc / 100);
        const cash  = parseFloat($('#order-cash').val()) || 0;

        if (cash > 0 && cash < grand) { toast('Cash is less than total', 'error'); return; }

        const customer = DB.getCustomer(custId);
        const orderId  = DB.nextOrdId();

        // Deduct stock
        DB.cart.forEach(c => { DB.getItem(c.id).qty -= c.qty; });

        // Save order
        DB.orders.push({
            id: orderId,
            customerId:   customer.id,
            customerName: customer.name,
            items:        DB.cart.map(c => ({ ...c })),
            subtotal: sub, discount: disc, grand, cash,
            change: Math.max(0, cash - grand),
            date: nowStr()
        });

        // Show receipt modal
        $('#receipt-body').html(`
            <div class="receipt-row"><span>Order ID</span><strong>${orderId}</strong></div>
            <div class="receipt-row"><span>Customer</span><strong>${customer.name}</strong></div>
            <div class="receipt-row"><span>Parts</span><strong>${DB.cart.length} item(s)</strong></div>
            <div class="receipt-row"><span>Discount</span><strong>${disc}%</strong></div>
            <hr>
            <div class="receipt-row grand"><span>GRAND TOTAL</span><strong>${fmt(grand)}</strong></div>
            ${cash ? `<div class="receipt-row"><span>Change</span><strong style="color:var(--success)">${fmt(Math.max(0, cash - grand))}</strong></div>` : ''}
            <div class="receipt-date">${nowStr()}</div>
        `);

        DB.cart = [];
        bootstrap.Modal.getOrCreateInstance(document.getElementById('receiptModal')).show();
        DashController.render();
        toast(`${orderId} placed!`);
    },

    clearCart() {
        DB.cart = [];
        this.renderCart();
        this.renderGrid();
    },

    newOrder() {
        DB.cart = [];
        this.init();
    }
};
