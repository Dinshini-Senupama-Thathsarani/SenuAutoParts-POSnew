// ═══════════════════════════════════════════
//  MAIN — App Initialization
// ═══════════════════════════════════════════

// ════════════════════════════════════════════
//  BOOTSTRAP MODAL DARK BACKDROP
// ════════════════════════════════════════════
document.addEventListener('show.bs.modal', ()=>{
    document.querySelectorAll('.modal-backdrop').forEach(el=>el.style.background='rgba(0,0,0,.7)');
});

// ════════════════════════════════════════════
//  INIT
// ════════════════════════════════════════════
$(document).ready(()=>{
    $('#login-user, #login-pass').on('keypress', e=>{ if(e.which===13) AuthController.login(); });
    // Ensure dashboard is active page on load
    navigate('dashboard');
    DashController.refresh();
});