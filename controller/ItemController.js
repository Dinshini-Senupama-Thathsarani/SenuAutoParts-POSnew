// ── ITEM CONTROLLER ─────────────────────────

const ItemController = {

    loadTable() {
        const q  = $('#item-search').val().toLowerCase();
        const sf = $('#item-filter').val();

        let list = DB.items.filter(i =>
            i.name.toLowerCase().includes(q) ||
            i.id.toLowerCase().includes(q) ||
            i.category.toLowerCase().includes(q)
        );

        if (sf === 'in')  list = list.filter(i => i.qty > 5);
        if (sf === 'low') list = list.filter(i => i.qty > 0 && i.qty <= 5);
        if (sf === 'out') list = list.filter(i => i.qty === 0);

        if (!list.length) {
            $('#item-tbody').html('<tr><td colspan="6" class="empty-cell">No parts found</td></tr>');
            return;
        }

        $('#item-tbody').html(list.map(i => {
            const badge = i.qty === 0  ? `<span class="badge-out">OUT</span>`
                : i.qty <= 5   ? `<span class="badge-low">${i.qty}</span>`
                    :                `<span class="badge-ok">${i.qty}</span>`;
            return `
            <tr>
                <td><code>${i.id}</code></td>
                <td>${i.name}</td>
                <td>${i.category}</td>
                <td>${fmt(i.price)}</td>
                <td>${badge}</td>
                <td>
                    <button class="btn-edit" onclick="ItemController.edit('${i.id}')"><i class="bi bi-pencil"></i></button>
                    <button class="btn-del"  onclick="ItemController.remove('${i.id}')"><i class="bi bi-trash"></i></button>
                </td>
            </tr>`;
        }).join(''));
    },

    save() {
        const isEdit  = !!$('#item-id-hidden').val();
        const id      = $('#item-code').val().trim().toUpperCase();
        const name    = $('#item-name').val().trim();
        const cat     = $('#item-cat').val();
        const price   = parseFloat($('#item-price').val());
        const qty     = parseInt($('#item-qty').val());
        let valid = true;

        const dup = DB.items.find(i => i.id === id && (!isEdit || i.id !== $('#item-id-hidden').val()));
        if (!id || dup)           { this._err('item-code',  !id ? 'Code required' : 'Code already exists'); valid = false; }
        else                      { this._ok('item-code'); }

        if (!name)                { this._err('item-name',  'Name required');   valid = false; }
        else                      { this._ok('item-name'); }

        if (isNaN(price) || price < 0) { this._err('item-price', 'Valid price'); valid = false; }
        else                           { this._ok('item-price'); }

        if (isNaN(qty)   || qty < 0)   { this._err('item-qty',   'Valid qty');   valid = false; }
        else                           { this._ok('item-qty'); }

        if (!valid) return;

        if (isEdit) {
            const it = DB.getItem($('#item-id-hidden').val());
            it.id = id; it.name = name; it.category = cat; it.price = price; it.qty = qty;
            toast('Part updated');
        } else {
            DB.items.push({ id, name, category: cat, price, qty });
            toast('Part added');
        }

        this._clearForm();
        this.loadTable();
        DashController.render();
    },

    edit(id) {
        const it = DB.getItem(id);
        if (!it) return;
        $('#item-id-hidden').val(it.id);
        $('#item-code').val(it.id);
        $('#item-name').val(it.name);
        $('#item-cat').val(it.category);
        $('#item-price').val(it.price);
        $('#item-qty').val(it.qty);
        $('#item-save-btn').text('Update Part');
    },

    remove(id) {
        if (!confirm('Delete this part?')) return;
        DB.items = DB.items.filter(i => i.id !== id);
        this.loadTable();
        DashController.render();
        toast('Part deleted', 'warn');
    },

    reset() { this._clearForm(); },

    _clearForm() {
        clearInputs('item-id-hidden', 'item-code', 'item-name', 'item-price', 'item-qty');
        $('#item-cat').val('Bumpers');
        $('#item-save-btn').text('Save Part');
    },

    _err(id, msg) { $(`#${id}`).addClass('is-invalid'); $(`#err-${id}`).text(msg).show(); },
    _ok(id)       { $(`#${id}`).removeClass('is-invalid'); $(`#err-${id}`).hide(); },
};
