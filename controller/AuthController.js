// Auth Controller

const AuthController = {
    login(){
        const u = $('#login-user').val().trim();
        const p = $('#login-pass').val().trim();
        if(u==='admin' && p==='admin123'){
            Model.currentUser = u;
            $('#login-view').fadeOut(200,()=>{
                $('#app-view').css('display','flex').hide().fadeIn(200);
                $('#topbar-user').text(u.toUpperCase());
                DashController.refresh();
            });
            $('#login-error').hide();
        } else {
            $('#login-error').show();
            $('#login-pass').val('').addClass('is-invalid-pos');
            setTimeout(()=>$('#login-pass').removeClass('is-invalid-pos'),1500);
        }
    },
    logout(){
        Model.currentUser = null;
        Model.cart = [];
        $('#app-view').fadeOut(200,()=>{
            $('#login-view').fadeIn(200);
            $('#login-user').val(''); $('#login-pass').val('');
        });
    }
};

$('#login-pass').on('keypress',e=>{ if(e.which===13) AuthController.login(); });