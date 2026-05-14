// ── AUTH CONTROLLER ─────────────────────────

const AuthController = {

    login() {
        const user = $('#login-user').val().trim();
        const pass = $('#login-pass').val().trim();

        if (user === 'admin' && pass === 'admin123') {
            DB.currentUser = user;
            $('#login-error').hide();
            $('#login-view').fadeOut(200, () => {
                $('#topbar-user').text(user.toUpperCase());
                $('#app-view').css('display', 'flex').fadeIn(200);
                navigate('dashboard');
            });
        } else {
            $('#login-error').show();
            $('#login-pass').val('').addClass('is-invalid');
            setTimeout(() => $('#login-pass').removeClass('is-invalid'), 1500);
        }
    },

    logout() {
        DB.currentUser = null;
        DB.cart = [];
        $('#app-view').fadeOut(200, () => {
            $('#login-user').val('');
            $('#login-pass').val('');
            $('#login-view').fadeIn(200);
        });
    }
};
