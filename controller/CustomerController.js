// Customer Controller

// ════════════════════════════════════════════
//  CUSTOMER CONTROLLER
// ════════════════════════════════════════════
const CustomerController = {
    _fromOrder: false,

    render(data=null){
        const list = data || Model.customers;
        if(list.length===0){
            $('#customer-table-body').html('<tr><td colspan="5"><div class="empty-state"><i class="bi bi-people"></i><p>No customers found</p></div></td></tr>');
            return;
        }
        $('#customer-table-body').html(list.map((c,i)=>`
  <tr>
    <td style="color:var(--muted);font-family:var(--font-mono);font-size:11px">${String(i+1).padStart(2,'0')}</td>
    <td><strong>${c.name}</strong></td>
    <td style="font-family:var(--font-mono)">${c.phone}</td>
    <td style="color:var(--muted)">${c.address||'—'}</td>
    <td>
      <div style="display:flex;gap:6px">
        <button class="btn-edit-pos" onclick="CustomerController.openEditModal(${c.id})"><i class="bi bi-pencil"></i> Edit</button>
        <button class="btn-danger-pos" onclick="CustomerController.deleteConfirm(${c.id})"><i class="bi bi-trash"></i> Del</button>
      </div>
    </td>
  </tr>`).join(''));
    },

    search(){
        const q = $('#customer-search').val().toLowerCase();
        const filtered = Model.customers.filter(c=>
            c.name.toLowerCase().includes(q)||c.phone.includes(q)||(c.address||'').toLowerCase().includes(q)
        );
        this.render(filtered);
    },

    openAddModal(fromOrder=false){
        this._fromOrder = fromOrder;
        $('#customerModalTitle').text('ADD CUSTOMER');
        $('#cust-id').val(''); $('#cust-name').val(''); $('#cust-phone').val(''); $('#cust-address').val('');
        ['cust-name','cust-phone'].forEach(f=>$(`#${f}`).removeClass('is-invalid-pos'));
        ['err-cust-name','err-cust-phone'].forEach(f=>$(`#${f}`).hide());
        bootstrap.Modal.getOrCreateInstance(document.getElementById('customerModal')).show();
    },

    openEditModal(id){
        const c = Model.getCustomerById(id);
        if(!c) return;
        $('#customerModalTitle').text('EDIT CUSTOMER');
        $('#cust-id').val(c.id); $('#cust-name').val(c.name); $('#cust-phone').val(c.phone); $('#cust-address').val(c.address||'');
        bootstrap.Modal.getOrCreateInstance(document.getElementById('customerModal')).show();
    },

    save(){
        const id = $('#cust-id').val();
        const name = $('#cust-name').val().trim();
        const phone = $('#cust-phone').val().trim();
        const address = $('#cust-address').val().trim();
        let valid = true;

        if(!name){ $('#cust-name').addClass('is-invalid-pos'); $('#err-cust-name').show(); valid=false; }
        else { $('#cust-name').removeClass('is-invalid-pos'); $('#err-cust-name').hide(); }

        if(!phone || !/^0\d{9}$/.test(phone)){ $('#cust-phone').addClass('is-invalid-pos'); $('#err-cust-phone').show(); valid=false; }
        else { $('#cust-phone').removeClass('is-invalid-pos'); $('#err-cust-phone').hide(); }

        if(!valid) return;

        if(id){
            const c = Model.getCustomerById(parseInt(id));
            c.name=name; c.phone=phone; c.address=address;
            toast('Customer updated successfully');
        } else {
            Model.customers.push({id:Model.nextCustomerId(), name, phone, address});
            toast('Customer added successfully');
        }

        bootstrap.Modal.getOrCreateInstance(document.getElementById('customerModal')).hide();
        this.render();
        if(this._fromOrder){ OrderController.refreshCustomerDropdown(); this._fromOrder=false; }
        DashController.refresh();
    },

    deleteConfirm(id){
        const c = Model.getCustomerById(id);
        showConfirm(`Delete customer "${c.name}"? This cannot be undone.`, ()=>this.delete(id));
    },

    delete(id){
        Model.customers = Model.customers.filter(c=>c.id!==id);
        this.render();
        DashController.refresh();
        toast('Customer deleted','warn');
    }
};