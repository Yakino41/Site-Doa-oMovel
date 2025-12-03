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

    const novoMovel = document.createElement('div');
    novoMovel.className = `movel ${tipoMovel}`;
    novoMovel.style.display = 'block';
    novoMovel.innerHTML = `
      <h4>${tipoMovel.charAt(0).toUpperCase() + tipoMovel.slice(1)} - ${descricao}</h4>
      <p><strong>Estado:</strong> ${estado.charAt(0).toUpperCase() + estado.slice(1)}</p>
      <p><strong>Descrição:</strong> ${descricao}</p>
      <p><strong>Contato:</strong> ${contato}</p>
    `;

    listaMoveis.appendChild(novoMovel);
    console.log('Móvel adicionado com classe:', tipoMovel);

    atualizarFiltros();

    formCadastroMovel.reset();

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
});