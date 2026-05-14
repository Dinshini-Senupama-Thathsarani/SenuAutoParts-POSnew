// ── DASHBOARD CONTROLLER ────────────────────

const DashController = {

    render() {
        const revenue  = DB.orders.reduce((s, o) => s + o.grand, 0);
        const lowStock = DB.items.filter(i => i.qty >= 0 && i.qty <= 5).length;

        $('#stat-revenue').text(fmt(revenue));
        $('#stat-orders').text(DB.orders.length);
        $('#stat-customers').text(DB.customers.length);
        $('#stat-lowstock').text(lowStock);
        $('#dash-user').text((DB.currentUser || 'Admin').toUpperCase());

        // Recent orders (last 5)
        const recent = [...DB.orders].reverse().slice(0, 5);
        $('#dash-orders').html(recent.length ? recent.map(o => `
            <tr>
                <td><code>${o.id}</code></td>
                <td>${o.customerName}</td>
                <td>${fmt(o.grand)}</td>
                <td>${o.date}</td>
            </tr>`).join('') :
            '<tr><td colspan="4" class="empty-cell">No orders yet</td></tr>');

        // Low stock items
        const low = DB.items.filter(i => i.qty <= 5);
        $('#dash-lowstock').html(low.length ? low.map(i => `
            <tr>
                <td>${i.name}</td>
                <td><code>${i.id}</code></td>
                <td>${i.qty === 0 ? '<span class="badge-out">OUT</span>' : `<span class="badge-low">${i.qty}</span>`}</td>
            </tr>`).join('') :
            '<tr><td colspan="3" class="empty-cell"><i class="bi bi-check-circle"></i> All stock OK</td></tr>');
    }
};
