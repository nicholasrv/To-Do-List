
//obs....
// let cookieJwt;

///@@@@@@ Executa automaticamente ao iniciar a página

// onload = () => {
//     cookieJwt = getCookie("jwt");
//     //Simula uma validação se o usuário não estiver autenticado e autorizado
//     if (cookieJwt == "" || cookieJwt == null || cookieJwt == undefined) {
//         alert("Você não tem permissão para usar esta página!\nVoltando para a tela de login...");
//         window.location = "login.html"
//     } else {
//         buscaUsuarioNaApi(cookieJwt);
//         buscaAsTarefasDoUsuario(cookieJwt);
//     }
// }




// 1. capturar o token do localStorage (qual o nome da variável?)

let tokenUser = localStorage.getItem("token");
//2. Passar como parametro o TOKEN na função buscar usuário na API;



//@@@@ CARREGA E ALTERA DADOS DO USUÁRIO LOGADO
//Usando Async-Await

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
    let resposta;
    let respostaJson
    try {
        resposta = await fetch(urlGetUsuario, configuracaoRequisicao);

        if (resposta.status == 200) {
            respostaJson = await resposta.json();
            // console.log(respostaJson);
            alteraDadosUsuarioEmTela(respostaJson);
        } else {
            throw resposta.status
        }
    } catch (error) {
        let escolhaUsuario = confirm("Ocorreu algum erro ao buscar as informações do usuário logado")
        // console.log(error);
        if (escolhaUsuario) {
            buscaUsuarioNaApi(token);
        }
    }
}



function alteraDadosUsuarioEmTela(objetoUsuarioRecebido) {
    let nomeUsuarioEmTarefas = document.getElementById('nomeUsuarioEmTarefas');
    nomeUsuarioEmTarefas.innerText = `${objetoUsuarioRecebido.firstName} ${objetoUsuarioRecebido.lastName}`;
}

////@@@@ BUSCANDO TODAS AS TAREFAS DO USUÁRIO LOGADO
function buscaAsTarefasDoUsuario(token) {
    let urlGetTarefas = "https://ctd-todo-api.herokuapp.com/v1/tasks";
    let configuracaoRequisicao = {
        headers: {
            'authorization': `${token}`, // é OBRIGATORIO passar essa informação
        },
    };

    fetch(urlGetTarefas, configuracaoRequisicao).then(
        resultado => {
            if (resultado.status == 200) {
                return resultado.json();
            }
            throw resultado.status;
        }
    ).then(
        resultado => {
            manipulandoTarefasUsuario(resultado);
        }
    ).catch(
        erros => {
            console.log(erros);
        }
    );
}

function manipulandoTarefasUsuario(listaDeTarefas) {
    //Formas de percorrer a lista obtida
    for (let tarefa of listaDeTarefas) {
        //console.log(tarefa);   
    }
    listaDeTarefas.forEach(tarefa => {
        console.log(tarefa);
    }); 
    //console.log(listaDeTarefas);

    //Se a lista de tarefas retornar vazia da api...
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



///@@@@@@ CADASTRANDO UMA NOVA TAREFA PARA O USUÁRIO LOGADO
let botaoCadastrar = document.getElementById("botaoTarefas");

botaoCadastrar.addEventListener('click', evento => {
    evento.preventDefault(); //Impede que a página atualize automaticamente e não faça o envio da request

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
                'authorization': `${tokenUser}`, //responsável pela autorização (vem do cookie)
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

//Rodrigo Escobar - necessário capturar os dados do usuário logado para buscar as tarefas dele
//necessário buscar a tarefa criada através do appendingChild





///@@@ ATUALIZAR TAREFA, ALETANDO SEU STATUS 
function atualizaTarefa(idTarefa, status, token) {

    let endPointEditarTarefa = `https://ctd-todo-api.herokuapp.com/v1/tasks/${idTarefa}`;
    let configuracoesRequisicao = {
        method: 'PUT',
        body: JSON.stringify(
            {
                completed: status
            }
        ),
        headers: {
            // Preciso passar ambas as propriedades pro Headers da requisição
            'Content-type': 'application/json', //responsável elo json no Body
            'authorization': token //responsável pela autorização (vem do cookie)
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
            //Recarrega a página para atualizar a lista com a "nova" tarefa cadastrada
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
            'Authorization': token //responsável pela autorização (vem do cookie)
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