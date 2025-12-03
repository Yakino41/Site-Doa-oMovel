function cadastro() {
    var email = document.getElementById('email-cadastro');
    var senha = document.getElementById('password-cadastro');
    var senhaConfirm = document.getElementById('password-confirm-cadastro');
    var lowerCaseLetters = /[a-z]/g;
    var upperCaseLetters = /[A-Z]/g;
    var numbers = /[0-9]/g;

    
    if (email.value.length == 0) {
        alert('Informe um email');
    } else if (senha.value.length == 0) {
        alert('Informe uma senha');
    }
    
    if (senha.value.length > 8) {
        alert('Senha Deve Conter No Máximo de 8 caracteres');
    } else if (!senha.value.match(numbers)) {
        alert('Senha Deve conter no Minimo 1 numero');
    } else if (!senha.value.match(upperCaseLetters)) {
        alert('Senha Deve conter no Minimo 1 letra maíuscula');
    } else if (!senha.value.match(lowerCaseLetters)) {
        alert('Senha Deve conter no Minimo 1 letra minúscula');
    } else if (senha.value !== senhaConfirm.value) {
        alert('As senhas não coincidem');
    }
    
    else {
        localStorage.setItem('email', email.value);
        localStorage.setItem('senha', senha.value);
        localStorage.setItem('loggedIn', 'false');
        alert('Sua conta foi criada');
        return true;
    }
}


function login() {
    var storedEmail = localStorage.getItem('email');
    var storedSenha = localStorage.getItem('senha');
    var userEmail = document.getElementById('userEmail');
    var userSenha = document.getElementById('userSenha');
    if (userEmail.value == storedEmail && userSenha.value == storedSenha) {
        localStorage.setItem('loggedIn', 'true');
        alert('Login realizado.');
        document.getElementById('modal-login').checked = false;
    } else {
        alert('Erro ao fazer login');
    }
}

// Validar acesso ao cadastro de móveis
function abrirCadastroMovel() {
    const isLoggedIn = localStorage.getItem('loggedIn') === 'true';
    
    if (!isLoggedIn) {
        alert('Você precisa estar logado para cadastrar móveis. Por favor, faça login primeiro!');
        document.getElementById('modal-login').checked = true;
        return false;
    }
    
    document.getElementById('modal-cadastro-movel').checked = true;
    return false;
}