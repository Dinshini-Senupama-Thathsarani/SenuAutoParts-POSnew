// Order Controller

const OrderController = {
    _orderId: null,

    init(){
        this._orderId = Model.nextOrderId();
        Model.ordIdSeq = (Model.ordIdSeq||1); // keep consistent
        Model.orderIdSeq--; // will be re-assigned on place
        this._orderId = null;
        this.refreshCustomerDropdown();
        this.renderItemGrid();
        this.renderCart();
        $('#order-discount').val(0);
        $('#order-cash').val('');
    },

    refreshCustomerDropdown(){
        const cur = $('#order-customer').val();
        $('#order-customer').html('<option value="">— Choose Customer —</option>' +
            Model.customers.map(c=>`<option value="${c.id}" ${c.id==cur?'selected':''}>${c.name} — ${c.phone}</option>`).join(''));
    },

    renderItemGrid(query=''){
        const q = query.toLowerCase();
        const list = Model.items.filter(i=>!q||(i.name.toLowerCase().includes(q)||i.code.toLowerCase().includes(q)));
        if(list.length===0){ $('#order-item-grid').html('<div style="grid-column:1/-1"><div class="empty-state"><i class="bi bi-boxes"></i><p>No parts found</p></div></div>'); return; }
        $('#order-item-grid').html(list.map(i=>{
            const inCart = Model.cart.find(c=>c.itemId===i.id);
            const out = i.qty===0;
            const sc = i.qty===0?'stock-out':i.qty<=5?'stock-low':'stock-ok';
            return `<div class="item-tile ${inCart?'selected':''} ${out?'out':''}" onclick="OrderController.addToCart(${i.id})" id="tile-${i.id}">
    <div class="item-tile-code">${i.code}</div>
    <div class="item-tile-name">${i.name}</div>
    <div class="item-tile-price">${fmt(i.price)}</div>
    <div class="item-tile-stock"><span class="stock-badge ${sc}">${out?'OUT':i.qty+' left'}</span></div>
    ${inCart?'<div style="margin-top:4px"><i class="bi bi-check-circle-fill" style="color:var(--amber);font-size:12px"></i></div>':''}
  </div>`;
        }).join(''));
    },

    filterItemGrid(){
        this.renderItemGrid($('#order-item-search').val());
    },

    addToCart(itemId){
        const it = Model.getItemById(itemId);
        if(!it||it.qty===0) return;
        const existing = Model.cart.find(c=>c.itemId===itemId);
        if(existing){
            if(existing.qty < it.qty){ existing.qty++; }
            else { toast(`Max stock reached (${it.qty})`, 'warn'); return; }
        } else {
            Model.cart.push({itemId, name:it.name, code:it.code, price:it.price, qty:1, maxQty:it.qty});
        }
        this.renderCart();
        this.renderItemGrid($('#order-item-search').val());
    },

    removeFromCart(itemId){
        Model.cart = Model.cart.filter(c=>c.itemId!==itemId);
        this.renderCart();
        this.renderItemGrid($('#order-item-search').val());
    },

    updateQty(itemId, val){
        const c = Model.cart.find(c=>c.itemId===itemId);
        if(!c) return;
        const n = parseInt(val);
        if(isNaN(n)||n<1){ c.qty=1; }
        else if(n>c.maxQty){ c.qty=c.maxQty; toast(`Max available: ${c.maxQty}`, 'warn'); }
        else { c.qty=n; }
        this.renderCart();
    },

    renderCart(){
        if(Model.cart.length===0){
            $('#order-cart-items').html('<div class="empty-state"><i class="bi bi-cart-x"></i><p>No parts added yet</p></div>');
            $('#order-summary').hide();
            return;
        }
        $('#order-cart-items').html(Model.cart.map(c=>`
  <div class="order-item-row">
    <div style="flex:1">
      <div class="order-item-name">${c.name}</div>
      <div class="order-item-code">${c.code} · ${fmt(c.price)} each</div>
    </div>
    <input type="number" class="form-control order-qty-input" value="${c.qty}" min="1" max="${c.maxQty}"
      onchange="OrderController.updateQty(${c.itemId}, this.value)"
      style="width:60px;padding:5px 8px;font-family:var(--font-mono);font-size:12px">
    <div class="order-item-total">${fmt(c.price * c.qty)}</div>
    <button onclick="OrderController.removeFromCart(${c.itemId})" style="background:none;border:none;color:var(--muted);cursor:pointer;padding:4px;font-size:16px" title="Remove">
      <i class="bi bi-x-lg"></i>
    </button>
  </div>`).join(''));
        $('#order-summary').show();
        this.recalc();
    },

    recalc(){
        const sub = Model.cart.reduce((s,c)=>s+(c.price*c.qty),0);
        const disc = Math.max(0, Math.min(100, parseFloat($('#order-discount').val())||0));
        const grand = sub * (1 - disc/100);
        const cash = parseFloat($('#order-cash').val())||0;
        const change = Math.max(0, cash - grand);
        $('#ot-subtotal').text(fmt(sub));
        $('#ot-grand').text(fmt(grand));
        $('#ot-change').text(fmt(change));
        if(cash > 0 && cash < grand){
            $('#ot-change').css('color','var(--danger)').text('⚠ Insufficient');
        } else {
            $('#ot-change').css('color','var(--success)');
        }
    },

    clearCart(){
        Model.cart = [];
        this.renderCart();
        this.renderItemGrid();
    },

    placeOrder(){
        // Validate customer
        const custId = parseInt($('#order-customer').val());
        if(!custId){ $('#order-customer').addClass('is-invalid-pos'); $('#order-customer-err').show(); toast('Please select a customer','error'); return; }
        $('#order-customer').removeClass('is-invalid-pos'); $('#order-customer-err').hide();

        if(Model.cart.length===0){ toast('Add at least one part to the order','error'); return; }

        const cash = parseFloat($('#order-cash').val())||0;
        const sub = Model.cart.reduce((s,c)=>s+(c.price*c.qty),0);
        const disc = Math.max(0, Math.min(100, parseFloat($('#order-discount').val())||0));
        const grand = sub*(1-disc/100);

        if(cash > 0 && cash < grand){ toast('Cash tendered is less than grand total','error'); return; }

        const customer = Model.getCustomerById(custId);
        const orderId = Model.nextOrderId();

        // Deduct stock
        Model.cart.forEach(c=>{
            const it = Model.getItemById(c.itemId);
            it.qty -= c.qty;
        });

        // Record order
        const order = {
            id: orderId,
            customerId: custId,
            customerName: customer.name,
            customerPhone: customer.phone,
            items: Model.cart.map(c=>({...c})),
            subtotal: sub,
            discount: disc,
            grand: grand,
            cash: cash,
            change: Math.max(0, cash-grand),
            date: now()
        };
        Model.orders.push(order);
        Model.cart = [];

        // Show confirmation
        $('#order-confirm-body').html(`
  <div style="text-align:center;margin-bottom:20px">
    <span class="code-badge" style="font-size:16px;padding:8px 16px">${orderId}</span>
  </div>
  <div style="display:flex;justify-content:space-between;margin-bottom:8px">
    <span style="color:var(--muted)">Customer</span><strong>${customer.name}</strong>
  </div>
  <div style="display:flex;justify-content:space-between;margin-bottom:8px">
    <span style="color:var(--muted)">Items</span><span>${order.items.length} part(s)</span>
  </div>
  <div style="display:flex;justify-content:space-between;margin-bottom:8px">
    <span style="color:var(--muted)">Discount</span><span>${disc}%</span>
  </div>
  <div style="display:flex;justify-content:space-between;margin-bottom:8px;border-top:1px solid var(--border);padding-top:10px">
    <span style="font-family:var(--font-display);font-size:16px;font-weight:700">GRAND TOTAL</span>
    <span style="font-family:var(--font-display);font-size:20px;font-weight:800;color:var(--amber)">${fmt(grand)}</span>
  </div>
  ${cash>0?`<div style="display:flex;justify-content:space-between"><span style="color:var(--muted)">Change</span><span style="color:var(--success);font-family:var(--font-mono)">${fmt(Math.max(0,cash-grand))}</span></div>`:''}
  <div style="text-align:center;margin-top:16px;color:var(--muted);font-family:var(--font-mono);font-size:11px">${order.date}</div>
`);

        bootstrap.Modal.getOrCreateInstance(document.getElementById('orderConfirmModal')).show();
        DashController.refresh();
        toast(`Order ${orderId} placed successfully!`);
    },

    newOrder(){
        Model.cart = [];
        $('#order-customer').val('');
        this.init();
    }
};