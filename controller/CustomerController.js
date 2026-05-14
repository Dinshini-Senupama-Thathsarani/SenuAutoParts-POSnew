// ── CUSTOMER CONTROLLER ─────────────────────

const CustomerController = {

    loadTable() {
        const q = $('#cust-search').val().toLowerCase();
        const list = DB.customers.filter(c =>
            c.name.toLowerCase().includes(q) ||
            c.phone.includes(q) ||
            (c.address || '').toLowerCase().includes(q)
        );

        if (!list.length) {
            $('#cust-tbody').html('<tr><td colspan="5" class="empty-cell">No customers found</td></tr>');
            return;
        }

        $('#cust-tbody').html(list.map((c, i) => `
            <tr>
                <td>${i + 1}</td>
                <td>${c.name}</td>
                <td>${c.phone}</td>
                <td>${c.address || '—'}</td>
                <td>
                    <button class="btn-edit" onclick="CustomerController.edit('${c.id}')"><i class="bi bi-pencil"></i></button>
                    <button class="btn-del"  onclick="CustomerController.remove('${c.id}')"><i class="bi bi-trash"></i></button>
                </td>
            </tr>`).join(''));
    },

    save() {
        const id      = $('#cust-id').val().trim();
        const name    = $('#cust-name').val().trim();
        const phone   = $('#cust-phone').val().trim();
        const address = $('#cust-address').val().trim();
        let valid = true;

        if (!name)                         { this._err('cust-name',  'Name required');          valid = false; }
        else                               { this._ok('cust-name'); }

        if (!/^0\d{9}$/.test(phone))       { this._err('cust-phone', 'Valid 10-digit number');  valid = false; }
        else                               { this._ok('cust-phone'); }

        if (!valid) return;

        if (id) {
            const c = DB.getCustomer(id);
            c.name = name; c.phone = phone; c.address = address;
            toast('Customer updated');
        } else {
            DB.customers.push({ id: DB.nextCustId(), name, phone, address });
            toast('Customer added');
        }

        this._clearForm();
        this.loadTable();
        DashController.render();
    },

    edit(id) {
        const c = DB.getCustomer(id);
        if (!c) return;
        $('#cust-id').val(c.id);
        $('#cust-name').val(c.name);
        $('#cust-phone').val(c.phone);
        $('#cust-address').val(c.address || '');
        $('#cust-save-btn').text('Update Customer');
    },

    remove(id) {
        if (!confirm('Delete this customer?')) return;
        DB.customers = DB.customers.filter(c => c.id !== id);
        this.loadTable();
        DashController.render();
        toast('Customer deleted', 'warn');
    },

    reset() { this._clearForm(); },

    _clearForm() {
        clearInputs('cust-id', 'cust-name', 'cust-phone', 'cust-address');
        $('#cust-save-btn').text('Save Customer');
    },

    _err(id, msg) { $(`#${id}`).addClass('is-invalid'); $(`#err-${id}`).text(msg).show(); },
    _ok(id)       { $(`#${id}`).removeClass('is-invalid'); $(`#err-${id}`).hide(); },
};
