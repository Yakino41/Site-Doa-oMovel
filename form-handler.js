const STORAGE_KEY = 'moveis_doacao';

// CRITÉRIO 1: Função para salvar e carregar do LocalStorage
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

// CRITÉRIO 2: Função para deletar um item específico
function deletarMovelDoBD(id) {
  let moveis = carregarMoveisDoLocalStorage();
  moveis = moveis.filter(m => m.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(moveis));
}

// CRITÉRIO 3: Função para deletar todos
function deletarTodosMoveisDoLocalStorage() {
  if (confirm('Tem certeza que quer deletar TODOS os móveis? Essa ação é irreversível!')) {
    localStorage.removeItem(STORAGE_KEY);
    document.querySelector('.lista-moveis').innerHTML = '';
    alert('Todos os móveis foram deletados!');
    return true;
  }
  return false;
}

// CRITÉRIO 4: Função para pesquisar
function pesquisarMoveisPorCampo(campo, valor) {
  const moveis = carregarMoveisDoLocalStorage();
  const resultado = moveis.filter(m => 
    String(m[campo]).toLowerCase().includes(String(valor).toLowerCase())
  );
  return resultado;
}

// CRITÉRIO 5: Função para limpar formulário
function limparFormulario(form) {
  form.reset();
}

document.addEventListener('DOMContentLoaded', () => {
  const listaMoveis = document.querySelector('.lista-moveis');
  
  const modals = document.querySelectorAll('.modal-content');
  let formCadastroMovel = null;
  
  modals.forEach((modal, index) => {
    const h2 = modal.querySelector('h2');
    if (h2 && h2.textContent === 'Cadastro de Móveis') {
      formCadastroMovel = modal.querySelector('form');
    }
  });

  // Carregar móveis ao iniciar
  carregarMoveisAoIniciar();

  formCadastroMovel.addEventListener('submit', (e) => {
    e.preventDefault();

    const tipoMovel = formCadastroMovel.querySelector('#tipo-movel').value;
    const descricao = formCadastroMovel.querySelector('#descricao').value;
    const estado = formCadastroMovel.querySelector('#estado').value;
    const contato = formCadastroMovel.querySelector('#contato').value;

    console.log('Dados capturados:', { tipoMovel, descricao, estado, contato });

    if (!tipoMovel || !descricao || !estado || !contato) {
      alert('Por favor, preencha todos os campos!');
      return;
    }

    // Criar objeto do móvel
    const novoMovelObj = {
      tipo: tipoMovel,
      descricao: descricao,
      estado: estado,
      contato: contato
    };

    // CRITÉRIO 1: Salvar no LocalStorage
    const movelComId = salvarMovelNoBD(novoMovelObj);

    // Renderizar na página
    const novoMovel = document.createElement('div');
    novoMovel.className = `movel ${tipoMovel}`;
    novoMovel.style.display = 'block';
    novoMovel.dataset.id = movelComId.id;
    novoMovel.innerHTML = `
      <h4>${tipoMovel.charAt(0).toUpperCase() + tipoMovel.slice(1)} - ${descricao}</h4>
      <p><strong>Estado:</strong> ${estado.charAt(0).toUpperCase() + estado.slice(1)}</p>
      <p><strong>Descrição:</strong> ${descricao}</p>
      <p><strong>Contato:</strong> ${contato}</p>
      <button onclick="deletarMovel(${movelComId.id})" style="background: #d32f2f; color: white; padding: 8px 12px; border: none; border-radius: 5px; cursor: pointer;">🗑️ Deletar</button>
    `;

    listaMoveis.appendChild(novoMovel);
    console.log('Móvel adicionado com ID:', movelComId.id);

    atualizarFiltros();

    // CRITÉRIO 5: Limpar formulário
    limparFormulario(formCadastroMovel);

    alert('Móvel cadastrado com sucesso! ✅');

    document.getElementById('modal-cadastro-movel').checked = false;

    if (document.getElementById('todos')) {
      document.getElementById('todos').checked = true;
    }
  });

  // ============ SISTEMA DE FILTROS ============
  function atualizarFiltros() {
    const todosFiltro = document.getElementById('todos');
    const sofaFiltro = document.getElementById('sofa');
    const mesaFiltro = document.getElementById('mesa');
    const camaFiltro = document.getElementById('cama');
    const cadeiriFiltro = document.getElementById('cadeira');
    const armarioFiltro = document.getElementById('armario');
    const estanteFiltro = document.getElementById('estante');

    const filtros = [
      { elemento: todosFiltro, classe: null, nome: 'Todos' },
      { elemento: sofaFiltro, classe: 'sofa', nome: 'Sofás' },
      { elemento: mesaFiltro, classe: 'mesa', nome: 'Mesas' },
      { elemento: camaFiltro, classe: 'cama', nome: 'Camas' },
      { elemento: cadeiriFiltro, classe: 'cadeira', nome: 'Cadeiras' },
      { elemento: armarioFiltro, classe: 'armario', nome: 'Armários' },
      { elemento: estanteFiltro, classe: 'estante', nome: 'Estantes' }
    ];

    filtros.forEach(filtro => {
      if (filtro.elemento) {
        filtro.elemento.addEventListener('change', () => {
          const todosMoveis = listaMoveis.querySelectorAll('.movel');
          
          if (filtro.classe === null) {
            // Mostrar todos
            todosMoveis.forEach(movel => {
              movel.style.display = 'block';
            });
            console.log('Mostrando todos os móveis');
          } else {
            // Filtrar por classe
            todosMoveis.forEach(movel => {
              const temClasse = movel.classList.contains(filtro.classe);
              movel.style.display = temClasse ? 'block' : 'none';
            });
            console.log(`Filtrando: ${filtro.nome}`);
          }
        });
      }
    });
  }

  // Inicializar filtros
  atualizarFiltros();

  // Função para consultar móveis
  window.consultarMoveis = function() {
    // Mostrar todos os móveis
    const todosOsMoveis = listaMoveis.querySelectorAll('.movel');
    todosOsMoveis.forEach(movel => {
      movel.style.display = 'block';
    });

    // Marcar "Todos" no filtro
    if (document.getElementById('todos')) {
      document.getElementById('todos').checked = true;
    }

    console.log(`Total de móveis cadastrados: ${todosOsMoveis.length}`);
  };

  // Adicionar evento ao botão de consultar (quando o modal abrir)
  const modalConsulta = document.getElementById('modal-consulta');
  if (modalConsulta) {
    modalConsulta.addEventListener('change', (e) => {
      if (e.target.checked) {
        console.log('Modal de consulta aberto');
        window.consultarMoveis();
      }
    });
  }

  // Função para carregar móveis ao iniciar
  function carregarMoveisAoIniciar() {
    const moveis = carregarMoveisDoLocalStorage();
    moveis.forEach(movel => {
      const novoMovel = document.createElement('div');
      novoMovel.className = `movel ${movel.tipo}`;
      novoMovel.style.display = 'block';
      novoMovel.dataset.id = movel.id;
      novoMovel.innerHTML = `
        <h4>${movel.tipo.charAt(0).toUpperCase() + movel.tipo.slice(1)} - ${movel.descricao}</h4>
        <p><strong>Estado:</strong> ${movel.estado.charAt(0).toUpperCase() + movel.estado.slice(1)}</p>
        <p><strong>Descrição:</strong> ${movel.descricao}</p>
        <p><strong>Contato:</strong> ${movel.contato}</p>
        <button onclick="deletarMovel(${movel.id})" style="background: #d32f2f; color: white; padding: 8px 12px; border: none; border-radius: 5px; cursor: pointer;">🗑️ Deletar</button>
      `;
      listaMoveis.appendChild(novoMovel);
    });
    
    if (moveis.length > 0) {
      atualizarFiltros();
      console.log(`${moveis.length} móvel(is) carregado(s)`);
    }
  }
});

// Função global para deletar um móvel
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

// Função global para deletar todos
function deletarTodos() {
  deletarTodosMoveisDoLocalStorage();
}

// Funções globais para pesquisa (podem ser chamadas do console)
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
  
  // Limpar lista e mostrar apenas resultados
  listaMoveis.innerHTML = '';
  resultado.forEach(movel => {
    const novoMovel = document.createElement('div');
    novoMovel.className = `movel ${movel.tipo}`;
    novoMovel.style.display = 'block';
    novoMovel.dataset.id = movel.id;
    novoMovel.innerHTML = `
      <h4>${movel.tipo.charAt(0).toUpperCase() + movel.tipo.slice(1)} - ${movel.descricao}</h4>
      <p><strong>Estado:</strong> ${movel.estado.charAt(0).toUpperCase() + movel.estado.slice(1)}</p>
      <p><strong>Descrição:</strong> ${movel.descricao}</p>
      <p><strong>Contato:</strong> ${movel.contato}</p>
      <button onclick="deletarMovel(${movel.id})" style="background: #d32f2f; color: white; padding: 8px 12px; border: none; border-radius: 5px; cursor: pointer;">🗑️ Deletar</button>
    `;
    listaMoveis.appendChild(novoMovel);
  });
  
  console.log(`${resultado.length} móvel(is) encontrado(s)`);
}

// Função para limpar pesquisa e mostrar todos
function limparPesquisa() {
  document.getElementById('campo-pesquisa').value = 'tipo';
  document.getElementById('valor-pesquisa').value = '';
  
  const listaMoveis = document.querySelector('.lista-moveis');
  listaMoveis.innerHTML = '';
  
  const moveis = carregarMoveisDoLocalStorage();
  moveis.forEach(movel => {
    const novoMovel = document.createElement('div');
    novoMovel.className = `movel ${movel.tipo}`;
    novoMovel.style.display = 'block';
    novoMovel.dataset.id = movel.id;
    novoMovel.innerHTML = `
      <h4>${movel.tipo.charAt(0).toUpperCase() + movel.tipo.slice(1)} - ${movel.descricao}</h4>
      <p><strong>Estado:</strong> ${movel.estado.charAt(0).toUpperCase() + movel.estado.slice(1)}</p>
      <p><strong>Descrição:</strong> ${movel.descricao}</p>
      <p><strong>Contato:</strong> ${movel.contato}</p>
      <button onclick="deletarMovel(${movel.id})" style="background: #d32f2f; color: white; padding: 8px 12px; border: none; border-radius: 5px; cursor: pointer;">🗑️ Deletar</button>
    `;
    listaMoveis.appendChild(novoMovel);
  });
  
  if (document.getElementById('todos')) {
    document.getElementById('todos').checked = true;
  }
  
  console.log('Pesquisa limpa - mostrando todos os móveis');
}