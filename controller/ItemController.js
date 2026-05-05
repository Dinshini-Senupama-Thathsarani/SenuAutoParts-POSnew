// Item / Inventory Controller

const ItemController = {
    render(data=null){
        const list = data || Model.items;
        if(list.length===0){
            $('#item-table-body').html('<tr><td colspan="6"><div class="empty-state"><i class="bi bi-boxes"></i><p>No parts found</p></div></td></tr>');
            return;
        }
        $('#item-table-body').html(list.map(i=>{
            const sc = i.qty===0?'stock-out':i.qty<=5?'stock-low':'stock-ok';
            const sl = i.qty===0?'OUT OF STOCK':i.qty<=5?`LOW: ${i.qty}`:`${i.qty} units`;
            return `<tr>
    <td><span class="code-badge">${i.code}</span></td>
    <td><strong>${i.name}</strong></td>
    <td style="color:var(--muted);font-size:12px">${i.category}</td>
    <td style="font-family:var(--font-mono);color:var(--amber)">${fmt(i.price)}</td>
    <td><span class="stock-badge ${sc}">${sl}</span></td>
    <td>
      <div style="display:flex;gap:6px">
        <button class="btn-edit-pos" onclick="ItemController.openEditModal(${i.id})"><i class="bi bi-pencil"></i> Edit</button>
        <button class="btn-danger-pos" onclick="ItemController.deleteConfirm(${i.id})"><i class="bi bi-trash"></i> Del</button>
      </div>
    </td>
  </tr>`;
        }).join(''));
    },

    search(){
        const q = $('#item-search').val().toLowerCase();
        const sf = $('#item-filter-stock').val();
        let list = Model.items.filter(i=>
            i.name.toLowerCase().includes(q)||i.code.toLowerCase().includes(q)||i.category.toLowerCase().includes(q)
        );
        if(sf==='ok') list=list.filter(i=>i.qty>5);
        else if(sf==='low') list=list.filter(i=>i.qty>0&&i.qty<=5);
        else if(sf==='out') list=list.filter(i=>i.qty===0);
        this.render(list);
    },

    openAddModal(){
        $('#itemModalTitle').text('ADD PART');
        $('#item-id').val(''); $('#item-code').val(''); $('#item-name').val(''); $('#item-price').val(''); $('#item-qty').val(''); $('#item-cat').val('Bumpers');
        ['item-code','item-name','item-price','item-qty'].forEach(f=>$(`#${f}`).removeClass('is-invalid-pos'));
        ['err-item-code','err-item-name','err-item-price','err-item-qty'].forEach(f=>$(`#${f}`).hide());
        bootstrap.Modal.getOrCreateInstance(document.getElementById('itemModal')).show();
    },

    openEditModal(id){
        const it = Model.getItemById(id);
        if(!it) return;
        $('#itemModalTitle').text('EDIT PART');
        $('#item-id').val(it.id); $('#item-code').val(it.code); $('#item-name').val(it.name);
        $('#item-price').val(it.price); $('#item-qty').val(it.qty); $('#item-cat').val(it.category);
        bootstrap.Modal.getOrCreateInstance(document.getElementById('itemModal')).show();
    },

    save(){
        const id = $('#item-id').val();
        const code = $('#item-code').val().trim().toUpperCase();
        const name = $('#item-name').val().trim();
        const price = parseFloat($('#item-price').val());
        const qty = parseInt($('#item-qty').val());
        const category = $('#item-cat').val();
        let valid = true;

        // code unique check
        const dupCode = Model.items.find(i=>i.code===code&&i.id!=id);
        if(!code||dupCode){ $('#item-code').addClass('is-invalid-pos'); $('#err-item-code').show().text(!code?'Code is required':'Code already exists'); valid=false; }
        else { $('#item-code').removeClass('is-invalid-pos'); $('#err-item-code').hide(); }

        if(!name){ $('#item-name').addClass('is-invalid-pos'); $('#err-item-name').show(); valid=false; }
        else { $('#item-name').removeClass('is-invalid-pos'); $('#err-item-name').hide(); }

        if(isNaN(price)||price<0){ $('#item-price').addClass('is-invalid-pos'); $('#err-item-price').show(); valid=false; }
        else { $('#item-price').removeClass('is-invalid-pos'); $('#err-item-price').hide(); }

        if(isNaN(qty)||qty<0){ $('#item-qty').addClass('is-invalid-pos'); $('#err-item-qty').show(); valid=false; }
        else { $('#item-qty').removeClass('is-invalid-pos'); $('#err-item-qty').hide(); }

        if(!valid) return;

        if(id){
            const it = Model.getItemById(parseInt(id));
            it.code=code; it.name=name; it.price=price; it.qty=qty; it.category=category;
            toast('Part updated successfully');
        } else {
            Model.items.push({id:Model.nextItemId(), code, name, price, qty, category});
            toast('Part added to inventory');
        }
        bootstrap.Modal.getOrCreateInstance(document.getElementById('itemModal')).hide();
        this.render();
        DashController.refresh();
    },

    deleteConfirm(id){
        const it = Model.getItemById(id);
        showConfirm(`Delete part "${it.name} (${it.code})"?`, ()=>this.delete(id));
    },

    delete(id){
        Model.items = Model.items.filter(i=>i.id!==id);
        this.render();
        DashController.refresh();
        toast('Part removed from inventory','warn');
    }
};