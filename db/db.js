// ── DATA STORE ──────────────────────────────
const DB = {
    currentUser: null,

    customers: [
        { id: 'C001', name: 'Kasun Perera',      phone: '0711234567', address: '45/B Galle Rd, Colombo 3' },
        { id: 'C002', name: 'Nimal Silva',        phone: '0777654321', address: '12 Kandy Rd, Kegalle' },
        { id: 'C003', name: 'Amara Jayawardena', phone: '0766112233', address: '78 Main St, Negombo' },
    ],

    items: [
        { id: 'BP-001', name: 'Front Bumper - Toyota Aqua',          category: 'Bumpers',               price: 18500, qty: 4 },
        { id: 'BP-002', name: 'Rear Bumper - Honda Fit',             category: 'Bumpers',               price: 15200, qty: 3 },
        { id: 'DR-011', name: 'Front Door Panel - Suzuki Alto',      category: 'Doors',                 price: 22000, qty: 2 },
        { id: 'FD-021', name: 'Front Fender Left - Toyota Axio',     category: 'Fenders & Guards',      price: 9800,  qty: 0 },
        { id: 'BN-005', name: 'Bonnet - Nissan Tiida',               category: 'Bonnets & Boots',       price: 28000, qty: 5 },
        { id: 'SM-033', name: 'Side Mirror Right - Honda Vezel',     category: 'Side Mirrors',          price: 6500,  qty: 2 },
        { id: 'GR-009', name: 'Front Grille - Toyota Premio',        category: 'Grilles',               price: 4200,  qty: 8 },
        { id: 'HL-044', name: 'Headlight Assembly - Suzuki Swift',   category: 'Headlights & Taillights', price: 12500, qty: 3 },
    ],

    orders: [],
    cart:   [],

    _custSeq: 4,
    _ordSeq:  1,

    nextCustId() { return 'C' + String(this._custSeq++).padStart(3, '0'); },
    nextOrdId()  { return 'ORD-' + String(this._ordSeq++).padStart(4, '0'); },

    getCustomer(id) { return this.customers.find(c => c.id === id); },
    getItem(id)     { return this.items.find(i => i.id === id); },
};
