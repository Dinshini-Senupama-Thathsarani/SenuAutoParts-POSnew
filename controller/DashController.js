// Dashboard Controller

const DashController = {

    // SVG illustrations per category - always renders, no external deps
    getCategoryArt(category, idx){
        const palettes = [
            ['#f5a623','#b87a18'],['#4ea8f0','#2a6fa8'],['#3ecf8e','#1a8a5a'],
            ['#f04e4e','#a83030'],['#c47cf5','#7a3db8'],['#f0c040','#b89018']
        ];
        const [c1,c2] = palettes[idx % palettes.length];
        const svgs = {
            'Bumpers': `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 160'><rect width='400' height='160' fill='#1a1c21'/><rect x='40' y='90' width='320' height='28' rx='6' fill='${c1}' opacity='.9'/><rect x='20' y='90' width='24' height='28' rx='4' fill='${c2}'/><rect x='356' y='90' width='24' height='28' rx='4' fill='${c2}'/><rect x='60' y='80' width='280' height='14' rx='4' fill='${c1}' opacity='.4'/><circle cx='80' cy='118' r='22' fill='#111' stroke='${c2}' stroke-width='4'/><circle cx='80' cy='118' r='12' fill='#222'/><circle cx='320' cy='118' r='22' fill='#111' stroke='${c2}' stroke-width='4'/><circle cx='320' cy='118' r='12' fill='#222'/><rect x='160' y='60' width='80' height='30' rx='3' fill='${c1}' opacity='.15'/><rect x='170' y='65' width='60' height='20' rx='2' fill='${c1}' opacity='.2'/><text x='200' y='40' font-family='monospace' font-size='12' fill='${c1}' opacity='.5' text-anchor='middle'>BUMPER</text></svg>`,
            'Doors': `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 160'><rect width='400' height='160' fill='#1a1c21'/><rect x='80' y='15' width='240' height='130' rx='6' fill='#252830' stroke='${c1}' stroke-width='2'/><rect x='95' y='25' width='210' height='80' rx='4' fill='${c1}' opacity='.08'/><rect x='95' y='25' width='210' height='80' rx='4' fill='none' stroke='${c1}' stroke-width='1' opacity='.3'/><circle cx='300' cy='95' r='10' fill='${c1}' opacity='.8'/><circle cx='300' cy='95' r='5' fill='${c2}'/><rect x='100' y='115' width='60' height='8' rx='3' fill='${c1}' opacity='.5'/><text x='200' y='155' font-family='monospace' font-size='11' fill='${c1}' opacity='.5' text-anchor='middle'>DOOR PANEL</text></svg>`,
            'Bonnets & Boots': `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 160'><rect width='400' height='160' fill='#1a1c21'/><path d='M30 120 Q100 50 200 40 Q300 50 370 120 Z' fill='#252830' stroke='${c1}' stroke-width='2'/><path d='M60 120 Q120 65 200 55 Q280 65 340 120' fill='none' stroke='${c1}' stroke-width='1' opacity='.4'/><ellipse cx='200' cy='115' rx='30' ry='6' fill='${c1}' opacity='.3'/><rect x='185' y='42' width='30' height='4' rx='2' fill='${c1}' opacity='.6'/><text x='200' y='145' font-family='monospace' font-size='11' fill='${c1}' opacity='.5' text-anchor='middle'>BONNET</text></svg>`,
            'Fenders & Guards': `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 160'><rect width='400' height='160' fill='#1a1c21'/><path d='M60 140 L60 60 Q62 30 120 25 L320 25 L320 60 Q340 65 350 90 L350 140 Z' fill='#252830' stroke='${c1}' stroke-width='2'/><path d='M75 140 L75 65 Q77 38 125 33 L310 33' fill='none' stroke='${c1}' stroke-width='1' opacity='.3'/><circle cx='200' cy='135' r='28' fill='#111' stroke='${c2}' stroke-width='4'/><circle cx='200' cy='135' r='16' fill='#1a1c21'/><circle cx='200' cy='135' r='6' fill='${c2}' opacity='.5'/><text x='200' y='20' font-family='monospace' font-size='11' fill='${c1}' opacity='.5' text-anchor='middle'>FENDER</text></svg>`,
            'Side Mirrors': `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 160'><rect width='400' height='160' fill='#1a1c21'/><ellipse cx='200' cy='80' rx='100' ry='60' fill='#252830' stroke='${c1}' stroke-width='2'/><ellipse cx='200' cy='80' rx='88' ry='50' fill='#1e2024' stroke='${c1}' stroke-width='1' opacity='.3'/><ellipse cx='200' cy='80' rx='70' ry='40' fill='#111' opacity='.6'/><line x1='130' y1='80' x2='270' y2='80' stroke='${c1}' stroke-width='1' opacity='.2'/><line x1='200' y1='30' x2='200' y2='130' stroke='${c1}' stroke-width='1' opacity='.2'/><rect x='290' y='70' width='30' height='20' rx='4' fill='${c2}' opacity='.7'/><text x='200' y='150' font-family='monospace' font-size='11' fill='${c1}' opacity='.5' text-anchor='middle'>SIDE MIRROR</text></svg>`,
            'Grilles': `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 160'><rect width='400' height='160' fill='#1a1c21'/><rect x='60' y='35' width='280' height='90' rx='8' fill='#252830' stroke='${c1}' stroke-width='2'/><line x1='60' y1='65' x2='340' y2='65' stroke='${c1}' stroke-width='1.5' opacity='.5'/><line x1='60' y1='85' x2='340' y2='85' stroke='${c1}' stroke-width='1.5' opacity='.5'/><line x1='60' y1='105' x2='340' y2='105' stroke='${c1}' stroke-width='1.5' opacity='.5'/><line x1='100' y1='35' x2='100' y2='125' stroke='${c1}' stroke-width='1' opacity='.3'/><line x1='140' y1='35' x2='140' y2='125' stroke='${c1}' stroke-width='1' opacity='.3'/><line x1='180' y1='35' x2='180' y2='125' stroke='${c1}' stroke-width='1' opacity='.3'/><line x1='220' y1='35' x2='220' y2='125' stroke='${c1}' stroke-width='1' opacity='.3'/><line x1='260' y1='35' x2='260' y2='125' stroke='${c1}' stroke-width='1' opacity='.3'/><line x1='300' y1='35' x2='300' y2='125' stroke='${c1}' stroke-width='1' opacity='.3'/><text x='200' y='150' font-family='monospace' font-size='11' fill='${c1}' opacity='.5' text-anchor='middle'>GRILLE</text></svg>`,
            'Headlights & Taillights': `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 160'><rect width='400' height='160' fill='#1a1c21'/><ellipse cx='200' cy='80' rx='110' ry='55' fill='#252830' stroke='${c1}' stroke-width='2'/><ellipse cx='200' cy='80' rx='85' ry='40' fill='${c1}' opacity='.08'/><circle cx='200' cy='80' r='32' fill='${c1}' opacity='.15'/><circle cx='200' cy='80' r='22' fill='${c1}' opacity='.25'/><circle cx='200' cy='80' r='12' fill='${c1}' opacity='.8'/><line x1='200' y1='80' x2='380' y2='70' stroke='${c1}' stroke-width='2' opacity='.3'/><line x1='200' y1='80' x2='380' y2='80' stroke='${c1}' stroke-width='2' opacity='.5'/><line x1='200' y1='80' x2='380' y2='90' stroke='${c1}' stroke-width='2' opacity='.3'/><text x='200' y='150' font-family='monospace' font-size='11' fill='${c1}' opacity='.5' text-anchor='middle'>HEADLIGHT</text></svg>`,
            'Glass & Windscreens': `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 160'><rect width='400' height='160' fill='#1a1c21'/><path d='M60 130 L100 30 L300 30 L340 130 Z' fill='#252830' stroke='${c1}' stroke-width='2'/><path d='M80 130 L115 40 L285 40 L320 130 Z' fill='${c1}' opacity='.06'/><path d='M80 130 L115 40 L285 40 L320 130 Z' fill='none' stroke='${c1}' stroke-width='1' opacity='.3'/><line x1='180' y1='30' x2='160' y2='130' stroke='${c1}' stroke-width='1' opacity='.2'/><line x1='220' y1='30' x2='240' y2='130' stroke='${c1}' stroke-width='1' opacity='.2'/><text x='200' y='152' font-family='monospace' font-size='11' fill='${c1}' opacity='.5' text-anchor='middle'>WINDSCREEN</text></svg>`,
            'Other Body Parts': `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 160'><rect width='400' height='160' fill='#1a1c21'/><rect x='60' y='50' width='280' height='70' rx='10' fill='#252830' stroke='${c1}' stroke-width='2'/><circle cx='110' cy='130' r='22' fill='#111' stroke='${c2}' stroke-width='3'/><circle cx='110' cy='130' r='10' fill='#222'/><circle cx='290' cy='130' r='22' fill='#111' stroke='${c2}' stroke-width='3'/><circle cx='290' cy='130' r='10' fill='#222'/><rect x='90' y='55' width='80' height='35' rx='3' fill='${c1}' opacity='.1'/><rect x='230' y='55' width='80' height='35' rx='3' fill='${c1}' opacity='.1'/><text x='200' y='45' font-family='monospace' font-size='11' fill='${c1}' opacity='.5' text-anchor='middle'>BODY PART</text></svg>`,
        };
        const svg = svgs[category] || svgs['Other Body Parts'];
        return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
    },

    categoryIcons: {
        'Bumpers':'🚗','Doors':'🚪','Bonnets & Boots':'🔩','Fenders & Guards':'🛡️',
        'Side Mirrors':'🔭','Grilles':'⚙️','Headlights & Taillights':'💡',
        'Glass & Windscreens':'🪟','Other Body Parts':'🔧'
    },

    refresh(){
        const rev = Model.orders.reduce((s,o)=>s+o.grand,0);
        const low = Model.items.filter(i=>i.qty>0&&i.qty<=5).length;
        $('#stat-revenue').text(fmt(rev));
        $('#stat-orders').text(Model.orders.length);
        $('#stat-customers').text(Model.customers.length);
        $('#stat-lowstock').text(low);
        $('#dash-username').text((Model.currentUser||'Admin').toUpperCase());

        // ── BEST SELLERS ── computed from order history
        const soldMap = {};
        Model.orders.forEach(o => o.items.forEach(it => {
            soldMap[it.itemId] = (soldMap[it.itemId]||0) + it.qty;
        }));

        // merge with current items, fallback to full inventory sorted by price desc
        let ranked = Model.items.map(i => ({
            ...i,
            sold: soldMap[i.id] || 0,
            score: (soldMap[i.id]||0) * i.price
        }));
        ranked.sort((a,b) => b.score - a.score || b.price - a.price);
        const top6 = ranked.slice(0,6);
        const maxSold = Math.max(1, ...top6.map(i=>i.sold));

        if(top6.length === 0){
            $('#bestseller-grid').html('<div class="empty-state" style="grid-column:1/-1"><i class="bi bi-bar-chart"></i><p>No data yet</p></div>');
        } else {
            const imgMap = this.partImages;
            const iconMap = this.categoryIcons;
            $('#bestseller-grid').html(top6.map((item, idx) => {
                const imgUrl = this.getCategoryArt(item.category, idx);
                const pct = item.sold > 0 ? Math.round((item.sold/maxSold)*100) : 20;
                const sc = item.qty===0?'stock-out':item.qty<=5?'stock-low':'stock-ok';
                const sl = item.qty===0?'Out of stock':item.qty<=5?`Only ${item.qty} left`:`${item.qty} in stock`;
                const isNew = item.sold === 0;
                return `
      <div class="bs-card" onclick="navigate('order')">
        <div class="bs-rank">${idx+1}</div>
        ${isNew ? '<div class="bs-badge-new">NEW</div>' : ''}
        <img class="bs-card-img" src="${imgUrl}" alt="${item.name}">
        <div class="bs-card-body">
          <div class="bs-code">${item.code} &nbsp;·&nbsp; ${item.category}</div>
          <div class="bs-name">${item.name}</div>
          <div class="bs-bar-wrap"><div class="bs-bar" style="width:${pct}%"></div></div>
          <div class="bs-footer">
            <div class="bs-price">${fmt(item.price)}</div>
            <div>
              <span class="stock-badge ${sc}" style="font-size:10px">${sl}</span>
            </div>
          </div>
          ${item.sold>0?`<div style="margin-top:6px;font-family:var(--font-mono);font-size:10px;color:var(--muted)">${item.sold} units sold</div>`:''}
        </div>
      </div>`;
            }).join(''));
        }

        // Recent orders (last 5)
        const recent = [...Model.orders].reverse().slice(0,5);
        if(recent.length===0){
            $('#dash-recent-orders').html('<tr><td colspan="4"><div class="empty-state"><i class="bi bi-receipt"></i><p>No orders yet</p></div></td></tr>');
        } else {
            $('#dash-recent-orders').html(recent.map(o=>`
    <tr>
      <td><span class="code-badge">${o.id}</span></td>
      <td>${o.customerName}</td>
      <td style="font-family:var(--font-mono);color:var(--amber)">${fmt(o.grand)}</td>
      <td style="color:var(--muted);font-size:11px;font-family:var(--font-mono)">${o.date}</td>
    </tr>`).join(''));
        }

        // Low stock
        const lowItems = Model.items.filter(i=>i.qty<=5);
        if(lowItems.length===0){
            $('#dash-low-stock').html('<tr><td colspan="3"><div class="empty-state"><i class="bi bi-check-circle"></i><p>All levels OK</p></div></td></tr>');
        } else {
            $('#dash-low-stock').html(lowItems.map(i=>`
    <tr>
      <td style="font-size:12px">${i.name}</td>
      <td><span class="code-badge">${i.code}</span></td>
      <td><span class="stock-badge ${i.qty===0?'stock-out':'stock-low'}">${i.qty===0?'OUT':i.qty}</span></td>
    </tr>`).join(''));
        }
    }
};