
// 1. capturar o token do localStorage (qual o nome da variável?)
let tokenUser = localStorage.getItem('token');
const URLAPI = "https://ctd-todo-api.herokuapp.com/v1"

onload = () => {
    let tokenUser = localStorage.getItem('token');
    //Simula uma validação se o usuário não estiver autenticado e autorizado
    if (tokenUser == "" || tokenUser == null || tokenUser == undefined) {
        alert("Você não tem permissão para usar esta página!\nVoltando para a tela de login...");
        window.location = "login.html"
    } else {
        buscaUsuarioNaApi(tokenUser);
        buscaTarefas(tokenUser);
    }
}

async function buscaUsuarioNaApi(token) {
    //console.log(tokenJwtArmazenado);
    let urlGetUsuario = "https://ctd-todo-api.herokuapp.com/v1/users/getMe";

    let configuracaoRequisicao = {
        //method: 'GET', //Pode omitir o GET da configuração
        //body: objetoUsuarioCadastroJson, //Não precisa de body
        headers: {
            'authorization': `${token}`, // é OBRIGATORIO passar essa informação
        },
    };
    let respostaDoServidor;
    let respostaDoServidorJSON
    try {
        respostaDoServidor = await fetch(urlGetUsuario, configuracaoRequisicao);

        if (respostaDoServidor.status == 200) {
            respostaDoServidorJSON = await respostaDoServidor.json();
            console.log(respostaDoServidorJSON);
            alteraDadosUsuarioEmTela(respostaDoServidorJSON);
        } else {
            throw respostaDoServidor.status
        }
    } catch (error) {
        let escolhaUsuario = confirm("Ocorreu algum erro ao buscar as informações do usuário logado")
        // console.log(error);
        if (escolhaUsuario) {
            buscaUsuarioNaApi(token);
        }
        if (escolhaUsuario) {
            buscaTarefas(token);
        }
    }
    
}

function alteraDadosUsuarioEmTela(objetoUsuarioRecebido) {
    let nomeUsuarioEmTarefas = document.getElementById('nomeUsuarioEmTarefas');
    nomeUsuarioEmTarefas.innerText = `${objetoUsuarioRecebido.firstName} ${objetoUsuarioRecebido.lastName}-${objetoUsuarioRecebido.email}`;
}

async function buscaTarefas(token) {
    //console.log(tokenJwtArmazenado);
    

    let configuracaoRequisicao = {
        //method: 'GET', //Pode omitir o GET da configuração
        //body: objetoUsuarioCadastroJson, //Não precisa de body
        headers: {
            'authorization': `${token}`, // é OBRIGATORIO passar essa informação
        },
    };
    
    fetch(`${URLAPI}/tasks`, configuracaoRequisicao)
    .then(function(respostaDoServidor){
        return respostaDoServidor.json();
    })
    .then(function(respostaDoServidorJSON){
        manipulandoTarefasUsuario(respostaDoServidorJSON)
    });
}

function manipulandoTarefasUsuario(listaDeTarefas) {

    if (listaDeTarefas.length == 0) {
        nenhumaTarefaPendenteEncontrada();
    //Se retornar algum registro da API...
    } else {
        //Ordenando a lista recebida da API
        listaDeTarefas = listaDeTarefas.sort(function (a, b) {
            return a.description.localeCompare(b.description);
        });

        listaDeTarefas.map(tarefa => {
            if (tarefa.completed) {
                renderizaTarefasConcluidas(tarefa);
            } else {
                renderizaTarefasPendentes(tarefa);
            }
        });

    }

}

let botaoCadastrar = document.getElementById("botaoTarefas");

botaoCadastrar.addEventListener('click', evento => {
    evento.preventDefault();

        let descricaoTarefa = document.getElementById('novaTarefa');
    let radioGrupo = document.getElementsByName('grupoRadio');
    let radioSelecionado;
    if (descricaoTarefa.value != "") {

        //Verifica qual foi o radio selecionado e armazena em uma variável
        radioGrupo.forEach(radio => radioSelecionado = radio.checked);

        //Cria objeto JS que será convertido para JSON
        const objetoTarefa = {
            description: descricaoTarefa.value,
            completed: radioSelecionado
        }

        let objetoTarefaJson = JSON.stringify(objetoTarefa);

        ///@@ Comunicando com a API
        let endPointCriarNovaTarfa = "https://ctd-todo-api.herokuapp.com/v1/tasks";

        let configuracoesRequisicao = {
            method: 'POST',
            body: objetoTarefaJson,
            headers: {
                // Precisa passar ambas propriedades pro Headers da requisição
                'Content-type': 'application/json', //responsável pelo json no Body
                'authorization': `${tokenUser}` //responsável pela autorização (localStorage)
            },
        }

        //@@@Chamando a API
        fetch(endPointCriarNovaTarfa, configuracoesRequisicao)
            .then((response) => {
                if (response.status == 201) {
                    return response.json()
                }
                //Se o código for diferente de sucesso (201), lança um throw para que a execução caia no Catch() 
                throw response;
            }).then(function () {
                alert("A tarefa foi salva com sucesso!")
                //Recarrega a página para atualiza a lista com a "nova" tarefa cadastrada
                window.location.reload();
            })
            .catch(error => {
                loginErro(error)
            });
    } else {
        evento.preventDefault();
        alert("Você deve informar uma descrição para a tarefa")
    }

});

///@@@ ATUALIZAR TAREFA, ALETANDO SEU STATUS 
function atualizaTarefa(idTarefa, status, tokenJwt) {

    let endPointEditarTarefa = `https://ctd-todo-api.herokuapp.com/v1/tasks/${idTarefa}`;
    let configuracoesRequisicao = {
        method: 'PUT',
        body: JSON.stringify(
            {
                completed: status
            }
        ),
        headers: {
            // Preciso passar ambas propriedade pro Headers da requisição
            'Content-type': 'application/json', //responsável elo json no Body
            'Authorization': tokenJwt //responsável pela autorização (vem do cookie)
        },
    }

    //@@@Chamando a API
    fetch(endPointEditarTarefa, configuracoesRequisicao)
        .then((response) => {
            if (response.status == 200) {
                return response.json()
            }
            //Se o código for diferente de sucesso (201), lança um throw para que a execução caia no Catch() 
            throw response;
        }).then(function () {
            alert("A tarefa foi atualizada com sucesso!")
            //Recarrega a página para atualiza a lista com a "nova" tarefa cadastrada
            window.location.reload();
        })
        .catch(error => {
            loginErro(error)
        });
}

///@@@ DELETAR UMA TAREFA POR SEU ID
function deletarTarefa(idTarefa, token) {

    let endPointDeletarTarefa = `https://ctd-todo-api.herokuapp.com/v1/tasks/${idTarefa}`;
    let configuracoesRequisicao = {
        method: 'DELETE',
        headers: {
            'authorization': token //responsável pela autorização (vem do cookie)
        },
    }

    //@@@Chamando a API
    fetch(endPointDeletarTarefa, configuracoesRequisicao)
        .then((resposta) => {
            if (resposta.status == 200) {
                return resposta.json()
            }
            //Se o código for diferente de sucesso (201), lança um throw para que a execução caia no Catch() 
            throw resposta;
        }).then(function () {
            alert("A tarefa foi deletada com sucesso!")
            //Recarrega a página para atualiza a lista com a "nova" tarefa cadastrada
            window.location.reload();
        })
        .catch(error => {
            console.log(error);
        });
}

function encerrarSessao() {
    let escolhaUsuario = confirm("Deseja realmente finalizar a sessão e voltar para o login ?");
    if (escolhaUsuario) {
        //Setar uma data anterior, remove(deleta) o cookie do navegador
        document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
        //Direciona para a tela de login
        window.location = "login.html"
    }
}




let tarefasPendentesUl = document.querySelector(".tarefas-pendentes");

function renderizaTarefasPendentes(tarefaRecebida) {

    //Converte a data de TimeStamp Americadno, para Data na formatação PT-BR
    var dataTarefa = new Date(tarefaRecebida.createdAt).toLocaleDateString("pt-BR")
 
    let liTarefaPendente = document.createElement('li');
    liTarefaPendente.classList.add("tarefa");
    //liTarefaPendente.setAttribute('class', 'tarefa'); //Também é possível

    liTarefaPendente.innerHTML =
        `
        <div class="not-done" id="${tarefaRecebida.id}"></div>
        <div class="descricao">
            <p class="nome">ID:${tarefaRecebida.id}</p>
            <p class="nome">${tarefaRecebida.description}</p>
            <p class="timestamp"><i class="far fa-calendar-alt"></i> ${dataTarefa}</p>
        </div
    `
    //Adiciona a lista principal
    tarefasPendentesUl.appendChild(liTarefaPendente);
}

//Captura toda a lista e verifica qual foi o elemento clicado (com o target)
tarefasPendentesUl.addEventListener('click', function (tarefaClicada) {
    tarefaClicada.preventDefault(); //Impede de atualizar a pagina
    let targetTarefa = tarefaClicada.target;

    if (targetTarefa.className == "not-done") { //Garante que seja clicado apenas na DIV a esqueda e não em qualquer lugar do card.
        let escolhaUsuario = confirm("Deseja realmente mover esta tarefa para as 'Tarefas Terminadas' ?");
        if (escolhaUsuario) {
            let tokenUser = localStorage.getItem('token');
            //Invoca função de atualização, passando o uuid, o status e o tokenJWT
            atualizaTarefa(tarefaClicada.target.id, true, tokenUser); // true -> A tarefa passa de "Pendente" para "Finalizada"
        }
    }
});

//Card que simboliza nenhuma tarefa pendente cadastrada na API
function nenhumaTarefaPendenteEncontrada() {
    let liTarefaPendente = document.createElement('li');
    liTarefaPendente.classList.add("tarefa");

    liTarefaPendente.innerHTML =
        `
        <div class="descricao">
            <p class="nome">Você ainda não possui nenhuma tarefa cadastrada em nosso sistema</p>
        </div
    `
    //Adiciona a lista principal
    tarefasPendentesUl.appendChild(liTarefaPendente);
}

let tarefasTerminadasUl = document.querySelector(".tarefas-terminadas");

function renderizaTarefasConcluidas(tarefaRecebida) {
    let liTarefaTerminada = document.createElement('li');
    liTarefaTerminada.classList.add("tarefa");
    //liTarefaPendente.setAttribute('class', 'tarefa'); //Também é possível

    liTarefaTerminada.innerHTML =
        `
        <div class="done"></div>
        <div class="descricao">
            <p class="nome">${tarefaRecebida.description}</p>
            <div>
                <button><i id="${tarefaRecebida.id}" class="fas fa-undo-alt change"></i></button>
                <button><i id="${tarefaRecebida.id}" class="far fa-trash-alt"></i></button>
            </div>
        </div>
    `
    //Adiciona a lista principal
    tarefasTerminadasUl.appendChild(liTarefaTerminada);
}

//Captura toda a lista e verifica qual foi o elemento clicado (com o target)
tarefasTerminadasUl.addEventListener('click', function (tarefaClicada) {
    tarefaClicada.preventDefault(); //Impede de atualizar a pagina
    let targetTarefa = tarefaClicada.target;
    let tokenUser = localStorage.getItem('token');

    //Trocar o status da atividade para "pendente"
    if (targetTarefa.className == "fas fa-undo-alt change") {
        let escolhaUsuario = confirm("Deseja realmente voltar esta tarefa para as 'Tarefas Pendentes' ?");
        if (escolhaUsuario) {
            atualizaTarefa(tarefaClicada.target.id, false, tokenUser); // true -> A tarefa passa de "Pendente" para "Finalizada"
        }
    }

    //Deletar uma tarefa por seu id
    if (targetTarefa.className == "far fa-trash-alt") {

        let escolhaUsuario = confirm("Deseja realmente deletar esta tarefa ?");
        if (escolhaUsuario) {
            deletarTarefa(tarefaClicada.target.id, tokenUser);
        }
    }
});
































// async function criarItemsNaDOM(token) {
//     //console.log(tokenJwtArmazenado);
    

//     let configuracaoCriar = {
//         method: 'POST', //Pode omitir o GET da configuração
//         //body: objetoUsuarioCadastroJson, //Não precisa de body
//         headers: {
//             'authorization': `${token}`, // é OBRIGATORIO passar essa informação
//         },
//     };

//     fetch(`${URLAPI}/task`, configuracaoCriar)
//     .then(function(respostaDoServidor){
//         return respostaDoServidor.json();
//     })
//     .then(function(respostaDoServidorJSON){
//         criarTarefa(respostaDoServidorJSON)
//     });

    

// }










// function   criarTarefa(respostaDoServidor){

//     //  // Varre o objeto e retorna item por item.
//     respostaDoServidor.map(function(corpoDaTarefa){

//         let idDaTarefa = corpoDaTarefa.id;

//         let tituloTarefa = corpoDaTarefa.title;

//         // let corpoDeTextoTarefa = corpoDaTarefa.body;

//         let dataDaTarefa = new Date(corpoDaTarefa.createdAt).toLocaleDateString("pt-BR");

//         // cria tarefa


//         let listaDeTarefas = document.querySelector('.tarefas-pendentes');

//         // add Div 
//         listaDeTarefas.innerHTML +=
//         `
//         <div class="not-done" id="${idDaTarefa}"></div>
//         <div class="descricao">
//             <p class="nome">ID:${idDaTarefa}</p>
//             <p class="nome">${tituloTarefa}</p>
//             <p class="timestamp"><i class="far fa-calendar-alt"></i> ${dataDaTarefa}</p>
//             <br>
//             <button onclick="removerTarefa(${idDaTarefa})">Excluir</button>
//             <button onclick="removerTarefa(${idDaTarefa})">Editar</button>
//         </div
//         `

//     });
// }














// function removerTarefa(idDaTarefa) {
//         console.log(`delatar o item ${idDaTarefa}`);
    
// }
    
// function editarTarefa(idDaTarefa) {
//         console.log(`editar o item ${idDaTarefa}`);
    
//         // fetch de editar do item...
// }




// function   criarItemsNaDOM(respostaDoServidor){

//     //  // Varre o objeto e retorna item por item.
//     respostaDoServidor.map(function(corpoDaTarefa){

//         let idDaTarefa = corpoDaTarefa.id;

//         let tituloTarefa = corpoDaTarefa.title;

//         // let corpoDeTextoTarefa = corpoDaTarefa.body;

//         let dataDaTarefa = new Date(corpoDaTarefa.createdAt).toLocaleDateString("pt-BR");

//         // cria tarefa


//         let listaDeTarefas = document.querySelector('.tarefas-pendentes');

//         // add Div 
//         listaDeTarefas.innerHTML +=
//         `
//         <div class="not-done" id="${idDaTarefa}"></div>
//         <div class="descricao">
//             <p class="nome">ID:${idDaTarefa}</p>
//             <p class="nome">${tituloTarefa}</p>
//             <p class="timestamp"><i class="far fa-calendar-alt"></i> ${dataDaTarefa}</p>
//             <br>
//             <button onclick="removerTarefa(${idDaTarefa})">Excluir</button>
//             <button onclick="removerTarefa(${idDaTarefa})">Editar</button>
//         </div
//         `

//     });
// }



















