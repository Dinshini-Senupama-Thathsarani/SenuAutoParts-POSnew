// ═══════════════════════════════════════════
//  HELPERS & UTILITIES
// ═══════════════════════════════════════════

// ═══════════════════════════════════════════
//  HELPERS & UTILITIES
// ═══════════════════════════════════════════
// ════════════════════════════════════════════
//  HELPERS / UTILS
// ════════════════════════════════════════════
function fmt(n){ return 'Rs ' + parseFloat(n).toLocaleString('en-LK',{minimumFractionDigits:2,maximumFractionDigits:2}) }
function uid(){ return Date.now() }
function now(){ return new Date().toLocaleString('en-GB',{day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'}) }
function toast(msg, type='success'){
const icons = {success:'bi-check-circle-fill', error:'bi-x-circle-fill', warn:'bi-exclamation-triangle-fill'};
const $t = $(`<div class="toast-msg toast-${type}"><i class="bi ${icons[type]} toast-icon"></i><span>${msg}</span></div>`);
$('#toast-container').append($t);
setTimeout(()=>{ $t.addClass('removing'); setTimeout(()=>$t.remove(), 300) }, 2800);
}
function showConfirm(msg, cb){
$('#confirm-msg').text(msg);
const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('confirmModal'));
modal.show();
$('#confirm-yes').off('click').on('click', ()=>{ modal.hide(); cb(); });
}
function navigate(page){
$('.page').removeClass('active');
$('.nav-item').removeClass('active');
$(`#page-${page}`).addClass('active');
$(`.nav-item[data-page="${page}"]`).addClass('active');
if(page==='dashboard') DashController.refresh();
if(page==='customers') CustomerController.render();
if(page==='items') ItemController.render();
if(page==='order') OrderController.init();
if(page==='history') HistoryController.render();
}
// Live clock
setInterval(()=>{
const d=new Date();
$('#live-time').text(d.toLocaleTimeString('en-GB'));
},1000);