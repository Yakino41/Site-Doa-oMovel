// Configuração centralizada de validação
const VALIDATION_RULES = {
  email: {
    minLength: 1,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Email inválido'
  },
  password: {
    maxLength: 8,
    minLength: 1,
    patterns: {
      number: /[0-9]/,
      uppercase: /[A-Z]/,
      lowercase: /[a-z]/
    },
    messages: {
      empty: 'Informe uma senha',
      tooLong: 'Senha deve conter no máximo 8 caracteres',
      noNumber: 'Senha deve conter no mínimo 1 número',
      noUppercase: 'Senha deve conter no mínimo 1 letra maiúscula',
      noLowercase: 'Senha deve conter no mínimo 1 letra minúscula'
    }
  }
};

const STORAGE_KEYS = {
  email: 'email',
  password: 'senha',
  loggedIn: 'loggedIn'
};

// Validação de senha
function validatePassword(password) {
  const { maxLength, patterns, messages } = VALIDATION_RULES.password;
  
  if (password.length === 0) return messages.empty;
  if (password.length > maxLength) return messages.tooLong;
  if (!patterns.number.test(password)) return messages.noNumber;
  if (!patterns.uppercase.test(password)) return messages.noUppercase;
  if (!patterns.lowercase.test(password)) return messages.noLowercase;
  
  return null;
}

// Validação de email
function validateEmail(email) {
  if (email.length === 0) return 'Informe um email';
  if (!VALIDATION_RULES.email.pattern.test(email)) {
    return VALIDATION_RULES.email.message;
  }
  return null;
}

// Função de cadastro refatorada
function cadastro() {
  const emailInput = document.getElementById('email-cadastro');
  const senhaInput = document.getElementById('password-cadastro');
  const senhaConfirmInput = document.getElementById('password-confirm-cadastro');

  // Validar campos
  const emailError = validateEmail(emailInput.value);
  if (emailError) {
    alert(emailError);
    return false;
  }

  const passwordError = validatePassword(senhaInput.value);
  if (passwordError) {
    alert(passwordError);
    return false;
  }

  // Validar confirmação de senha
  if (senhaInput.value !== senhaConfirmInput.value) {
    alert('As senhas não coincidem');
    return false;
  }

  // Salvar dados
  localStorage.setItem(STORAGE_KEYS.email, emailInput.value);
  localStorage.setItem(STORAGE_KEYS.password, senhaInput.value);
  localStorage.setItem(STORAGE_KEYS.loggedIn, 'false');

  alert('Sua conta foi criada com sucesso! ✅');
  
  // Limpar formulário
  document.querySelector('[for="modal-cadastro"] .modal-overlay form')?.reset?.();
  document.getElementById('modal-cadastro').checked = false;
  
  return true;
}

// Função de login refatorada
function login() {
  const storedEmail = localStorage.getItem(STORAGE_KEYS.email);
  const storedPassword = localStorage.getItem(STORAGE_KEYS.password);
  
  const userEmail = document.getElementById('userEmail').value;
  const userPassword = document.getElementById('userSenha').value;

  // Validar se usuário existe
  if (!storedEmail || !storedPassword) {
    alert('Nenhuma conta cadastrada. Por favor, crie uma conta primeiro!');
    return false;
  }

  // Validar credenciais
  if (userEmail === storedEmail && userPassword === storedPassword) {
    localStorage.setItem(STORAGE_KEYS.loggedIn, 'true');
    alert('Login realizado com sucesso! ✅');
    document.getElementById('modal-login').checked = false;
    return true;
  } else {
    alert('Email ou senha incorretos');
    return false;
  }
}

// Validar acesso ao cadastro de móveis
function abrirCadastroMovel() {
  const isLoggedIn = localStorage.getItem(STORAGE_KEYS.loggedIn) === 'true';

  if (!isLoggedIn) {
    alert('Você precisa estar logado para cadastrar móveis!');
    document.getElementById('modal-login').checked = true;
    return false;
  }

  document.getElementById('modal-cadastro-movel').checked = true;
  return true;
}