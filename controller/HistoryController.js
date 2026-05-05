// History Controller

// ════════════════════════════════════════════
//  HISTORY CONTROLLER
// ════════════════════════════════════════════
const HistoryController = {
    render(data=null){
        const list = data || [...Model.orders].reverse();
        if(list.length===0){
            $('#history-list').html('<div class="empty-state"><i class="bi bi-clock-history"></i><p>No orders recorded yet</p></div>');
            return;
        }
        $('#history-list').html(list.map(o=>`
  <div class="order-history-card">
    <div class="order-history-header" onclick="HistoryController.toggle('${o.id}')">
      <div>
        <span class="order-id">${o.id}</span>
        <span style="color:var(--steel);font-size:13px;margin-left:12px">${o.customerName}</span>
      </div>
      <div style="display:flex;align-items:center;gap:16px">
        <span style="font-family:var(--font-display);font-size:16px;font-weight:700;color:var(--amber)">${fmt(o.grand)}</span>
        <span style="color:var(--muted);font-size:11px;font-family:var(--font-mono)">${o.date}</span>
        <i class="bi bi-chevron-down" style="color:var(--muted)" id="chevron-${o.id}"></i>
      </div>
    </div>
    <div class="order-history-body" id="ohb-${o.id}">
      <table class="table-pos"><thead><tr><th>CODE</th><th>PART</th><th>QTY</th><th>UNIT</th><th>TOTAL</th></tr></thead>
      <tbody>${o.items.map(it=>`
        <tr>
          <td><span class="code-badge">${it.code}</span></td>
          <td>${it.name}</td>
          <td style="font-family:var(--font-mono)">${it.qty}</td>
          <td style="font-family:var(--font-mono)">${fmt(it.price)}</td>
          <td style="font-family:var(--font-mono);color:var(--amber)">${fmt(it.price*it.qty)}</td>
        </tr>`).join('')}
      </tbody></table>
      <div style="text-align:right;margin-top:10px;font-size:13px;color:var(--muted)">
        Subtotal: <strong style="font-family:var(--font-mono)">${fmt(o.subtotal)}</strong>
        ${o.discount>0?` &nbsp;|&nbsp; Discount: <strong>${o.discount}%</strong>`:''}
        &nbsp;|&nbsp; Grand: <strong style="color:var(--amber);font-family:var(--font-mono)">${fmt(o.grand)}</strong>
        ${o.cash>0?` &nbsp;|&nbsp; Cash: <strong style="font-family:var(--font-mono)">${fmt(o.cash)}</strong> &nbsp;|&nbsp; Change: <strong style="color:var(--success);font-family:var(--font-mono)">${fmt(o.change)}</strong>`:''}
      </div>
    </div>
  </div>`).join(''));
    },

    toggle(id){
        const $body = $(`#ohb-${id}`);
        const $chev = $(`#chevron-${id}`);
        $body.toggleClass('open');
        $chev.toggleClass('bi-chevron-down bi-chevron-up');
    },

    search(){
        const q = $('#history-search').val().toLowerCase();
        const filtered = Model.orders.filter(o=>
            o.id.toLowerCase().includes(q)||o.customerName.toLowerCase().includes(q)
        ).reverse();
        this.render(filtered);
    }
};