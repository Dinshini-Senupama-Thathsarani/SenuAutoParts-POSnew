// ═══════════════════════════════════════════
//  DATA MODEL — Senu Auto Parts POS
// ═══════════════════════════════════════════

const Model = {
    currentUser: null,
    customers: [
        {id:1, name:'Kasun Perera', phone:'0711234567', address:'45/B Galle Rd, Colombo 3'},
        {id:2, name:'Nimal Silva', phone:'0777654321', address:'12 Kandy Rd, Kegalle'},
        {id:3, name:'Amara Jayawardena', phone:'0766112233', address:'78 Main St, Negombo'},
    ],
    items: [
        {id:1, code:'BP-001', name:'Front Bumper - Toyota Aqua', category:'Bumpers', price:18500, qty:4},
        {id:2, code:'BP-002', name:'Rear Bumper - Honda Fit', category:'Bumpers', price:15200, qty:3},
        {id:3, code:'DR-011', name:'Front Door Panel - Suzuki Alto', category:'Doors', price:22000, qty:2},
        {id:4, code:'FD-021', name:'Front Fender Left - Toyota Axio', category:'Fenders & Guards', price:9800, qty:0},
        {id:5, code:'BN-005', name:'Bonnet - Nissan Tiida', category:'Bonnets & Boots', price:28000, qty:5},
        {id:6, code:'SM-033', name:'Side Mirror Right - Honda Vezel', category:'Side Mirrors', price:6500, qty:2},
        {id:7, code:'GR-009', name:'Front Grille - Toyota Premio', category:'Grilles', price:4200, qty:8},
        {id:8, code:'HL-044', name:'Headlight Assembly Left - Suzuki Swift', category:'Headlights & Taillights', price:12500, qty:3},
    ],
    orders: [],
    custIdSeq: 4,
    itemIdSeq: 9,
    orderIdSeq: 1,
    cart: [],

    nextCustomerId(){ return this.custIdSeq++ },
    nextItemId(){ return this.itemIdSeq++ },
    nextOrderId(){ return 'ORD-' + String(this.orderIdSeq++).padStart(4,'0') },

    getCustomerById(id){ return this.customers.find(c=>c.id==id) },
    getItemById(id){ return this.items.find(i=>i.id==id) },
};