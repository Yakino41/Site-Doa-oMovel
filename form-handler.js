const STORAGE_KEY = 'moveis_doacao';

// Configuração de tipos de móveis
const TIPOS_MOVEIS = ['todos', 'sofa', 'mesa', 'cama', 'cadeira', 'armario', 'estante'];

// ========== FUNÇÕES DE ARMAZENAMENTO ==========
function salvarMovelNoBD(movel) {
  const moveis = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  movel.id = Date.now();
  moveis.push(movel);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(moveis));
  return movel;
}

function carregarMoveisDoLocalStorage() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

function deletarMovelDoBD(id) {
  let moveis = carregarMoveisDoLocalStorage();
  moveis = moveis.filter(m => m.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(moveis));
}

function deletarTodosMoveisDoLocalStorage() {
  if (confirm('Tem certeza que quer deletar TODOS os móveis? Essa ação é irreversível!')) {
    localStorage.removeItem(STORAGE_KEY);
    document.querySelector('.lista-moveis').innerHTML = '';
    alert('Todos os móveis foram deletados!');
    return true;
  }
  return false;
}

function pesquisarMoveisPorCampo(campo, valor) {
  const moveis = carregarMoveisDoLocalStorage();
  return moveis.filter(m => 
    String(m[campo]).toLowerCase().includes(String(valor).toLowerCase())
  );
}

function limparFormulario(form) {
  form.reset();
}

// ========== FUNÇÕES DE RENDERIZAÇÃO ==========
function criarHTMLMovel(movel) {
  const tipo = movel.tipo.charAt(0).toUpperCase() + movel.tipo.slice(1);
  const estado = movel.estado.charAt(0).toUpperCase() + movel.estado.slice(1);
  
  return `
    <h4>${tipo} - ${movel.descricao}</h4>
    <p><strong>Estado:</strong> ${estado}</p>
    <p><strong>Descrição:</strong> ${movel.descricao}</p>
    <p><strong>Contato:</strong> ${movel.contato}</p>
    <button onclick="deletarMovel(${movel.id})" style="background: #d32f2f; color: white; padding: 8px 12px; border: none; border-radius: 5px; cursor: pointer;">🗑️ Deletar</button>
  `;
}

function adicionarMovelAoDOM(movel) {
  const listaMoveis = document.querySelector('.lista-moveis');
  const novoMovel = document.createElement('div');
  novoMovel.className = `movel ${movel.tipo}`;
  novoMovel.style.display = 'block';
  novoMovel.dataset.id = movel.id;
  novoMovel.innerHTML = criarHTMLMovel(movel);
  listaMoveis.appendChild(novoMovel);
}

// ========== INICIALIZAÇÃO ==========
document.addEventListener('DOMContentLoaded', () => {
  const listaMoveis = document.querySelector('.lista-moveis');
  
  // Encontrar formulário de cadastro
  const formCadastroMovel = document.querySelector('[for="modal-cadastro-movel"]')?.parentElement?.querySelector('form') ||
    Array.from(document.querySelectorAll('.modal-content')).find(m => m.querySelector('h2')?.textContent === 'Cadastro de Móveis')?.querySelector('form');

  // Carregar móveis salvos
  carregarMoveisAoIniciar();

  // Event listener do formulário de cadastro
  if (formCadastroMovel) {
    formCadastroMovel.addEventListener('submit', (e) => {
      e.preventDefault();

      const tipoMovel = formCadastroMovel.querySelector('#tipo-movel').value;
      const descricao = formCadastroMovel.querySelector('#descricao').value;
      const estado = formCadastroMovel.querySelector('#estado').value;
      const contato = formCadastroMovel.querySelector('#contato').value;

      if (!tipoMovel || !descricao || !estado || !contato) {
        alert('Por favor, preencha todos os campos!');
        return;
      }

      const novoMovelObj = { tipo: tipoMovel, descricao, estado, contato };
      const movelComId = salvarMovelNoBD(novoMovelObj);

      adicionarMovelAoDOM(movelComId);
      atualizarFiltros();
      limparFormulario(formCadastroMovel);

      alert('Móvel cadastrado com sucesso! ✅');
      document.getElementById('modal-cadastro-movel').checked = false;
      
      const todosFiltro = document.getElementById('todos');
      if (todosFiltro) todosFiltro.checked = true;
    });
  }

  // ========== SISTEMA DE FILTROS ==========
  function atualizarFiltros() {
    const filtros = TIPOS_MOVEIS.map(tipo => ({
      elemento: document.getElementById(tipo === 'todos' ? 'todos' : tipo),
      classe: tipo === 'todos' ? null : tipo
    }));

    filtros.forEach(filtro => {
      if (filtro.elemento) {
        filtro.elemento.addEventListener('change', () => {
          const todosMoveis = listaMoveis.querySelectorAll('.movel');
          
          todosMoveis.forEach(movel => {
            if (filtro.classe === null) {
              movel.style.display = 'block';
            } else {
              movel.style.display = movel.classList.contains(filtro.classe) ? 'block' : 'none';
            }
          });
        });
      }
    });
  }

  atualizarFiltros();

  // ========== CONSULTA DE MÓVEIS ==========
  window.consultarMoveis = function() {
    const todosOsMoveis = listaMoveis.querySelectorAll('.movel');
    todosOsMoveis.forEach(movel => movel.style.display = 'block');
    
    const todosFiltro = document.getElementById('todos');
    if (todosFiltro) todosFiltro.checked = true;
    
    console.log(`Total de móveis cadastrados: ${todosOsMoveis.length}`);
  };

  const modalConsulta = document.getElementById('modal-consulta');
  if (modalConsulta) {
    modalConsulta.addEventListener('change', (e) => {
      if (e.target.checked) window.consultarMoveis();
    });
  }

  // ========== CARREGAR MÓVEIS AO INICIAR ==========
  function carregarMoveisAoIniciar() {
    const moveis = carregarMoveisDoLocalStorage();
    moveis.forEach(adicionarMovelAoDOM);
    
    if (moveis.length > 0) {
      atualizarFiltros();
      console.log(`${moveis.length} móvel(is) carregado(s)`);
    }
  }
});

// ========== FUNÇÕES GLOBAIS ==========
function deletarMovel(id) {
  if (confirm('Tem certeza que quer deletar este móvel?')) {
    deletarMovelDoBD(id);
    const elemento = document.querySelector(`[data-id="${id}"]`);
    if (elemento) {
      elemento.remove();
      alert('Móvel deletado com sucesso! ✅');
    }
  }
}

function deletarTodos() {
  deletarTodosMoveisDoLocalStorage();
}

window.pesquisar = function(campo, valor) {
  const resultado = pesquisarMoveisPorCampo(campo, valor);
  console.log(`Pesquisa em "${campo}" por "${valor}":`, resultado);
  return resultado;
};

// Função para executar pesquisa a partir da interface
function executarPesquisa() {
  const campo = document.getElementById('campo-pesquisa').value;
  const valor = document.getElementById('valor-pesquisa').value;
  
  if (!valor.trim()) {
    alert('Digite um valor para pesquisar');
    return;
  }
  
  const resultado = pesquisarMoveisPorCampo(campo, valor);
  const listaMoveis = document.querySelector('.lista-moveis');
  
  if (resultado.length === 0) {
    alert(`Nenhum móvel encontrado com ${campo}: "${valor}"`);
    return;
  }
  
  listaMoveis.innerHTML = '';
  resultado.forEach(adicionarMovelAoDOM);
  console.log(`${resultado.length} móvel(is) encontrado(s)`);
}

// Função para limpar pesquisa e mostrar todos
function limparPesquisa() {
  document.getElementById('campo-pesquisa').value = 'tipo';
  document.getElementById('valor-pesquisa').value = '';
  
  const listaMoveis = document.querySelector('.lista-moveis');
  listaMoveis.innerHTML = '';
  
  const moveis = carregarMoveisDoLocalStorage();
  moveis.forEach(adicionarMovelAoDOM);
  
  const todosFiltro = document.getElementById('todos');
  if (todosFiltro) todosFiltro.checked = true;
  
  console.log('Pesquisa limpa - mostrando todos os móveis');
}