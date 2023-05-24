/****************************
Animação do Scroll
**********************************************
*/

"https://ctd-todo-api.herokuapp.com/#/users/getMe"

"https://dh-3bi-frontend2-checkpoint2-resolucao-parcial.netlify.app/index.html"



const URLAPI = "https://ctd-todo-api.herokuapp.com/v1"


//1. Seleção dos formulários Login e Cadastro

let formularioLogin = document.getElementById("formularioLogin");
let formularioCadastro = document.getElementById("formularioCadastro");

//2. Captura o evento de envio do formulário	e dispara a função (rotina)

if (formularioLogin) {
  formularioLogin.addEventListener("submit", function (event) {
    event.preventDefault(); //evita carregar o fórmulário novamente
    let email = event.target["email"].value; // pega o valor do campo email
    let senha = event.target["senha"].value; // pega o valor do campo senha

    if (email == "") {
      alert("Preencha o campo de email");
    } else if (senha == "") {
      alert("Preencha o campo de senha");
    } else {
      const dadosLogin = {
        email: email,
        password: senha
      }

      const configuracaoFetch = {
        method: "POST",
        body: JSON.stringify(dadosLogin),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        }
      }

      console.log(URLAPI);

      fetch(`${URLAPI}/users/login`, configuracaoFetch)
        .then(function (response) {
          return response.json();
        })
        .then(function (resultado) {
          if (resultado === "Contraseña incorrecta") {
            alert("Senha incorreta");
          } else if (resultado === "El usuario no existe") {
            alert("Usuário não existe");
          } else if (resultado === "Error del servidor") {
            alert("Erro do servidor");
          } else {
            // alert(resultado.jwt); // jwt é o token de autenticação
            localStorage.setItem("token", resultado.jwt);
            window.location.href = "tarefas.html";
            console.log('Usuário criado com sucesso')
          }
        });
    }
  });
}

if (formularioCadastro) {
  formularioCadastro.addEventListener("submit", function (event) {
    event.preventDefault(); //evita carregar o fórmulário novamente

    let nome = event.target["nome"].value.trim(); // pega o valor do campo nome
    let sobrenome = event.target["sobrenome"].value.trim(); // pega o valor do campo sobrenome
    let email = event.target["email"].value.trim(); // pega o valor do campo email
    let senha = event.target["senha"].value.trim(); // pega o valor do campo senha
    let confirmaSenha = event.target["confirmarSenha"].value.trim(); // pega o valor do campo de confirmação da senha


    if (nome == "") {
      alert("Preencha o campo nome");
    } else if (sobrenome == "") {
      alert("Preencha o campo sobrenome");
    } else if (email == "") {
      alert("Preencha o campo de email");
    } else if (senha == "") {
      alert("Preencha o campo de senha");
    } else if (confirmaSenha == "") {
      alert("Preencha o campo Repetir Senha");
    } else {
      const dadosCadastro = {
        firstName: nome,
        lastName: sobrenome,
        email: email,
        password: senha
      }
      const configuracaoFetch = {
        method: "POST",
        body: JSON.stringify(dadosCadastro),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        }
      }
      fetch(`${URLAPI}/users`, configuracaoFetch)
        .then(function (response) {
          return response.json();
        })
        .then(function (resultado) {
          if (resultado === "El usuario ya se encuentra registrado") {
            alert("O usuário já se encontra registrado")
          } else if (resultado === "Alguno de los datos requeridos está incompleto") {
            alert("Alguns dados requeridos estão incompletos.")
          } else if (resultado === "Error del servidor") {
            alert("Erro do servidor")
          } else {
            // alert(resultado.jwt); // jwt é o token de autenticação
            localStorage.setItem("token", resultado.jwt);
            window.location = "login.html";
            alert('Usuário criado com sucesso')
          }

        });
    }
  });
}


//// Validações formulário de cadastro - Nicholas em 09/04/2022

let nome = document.getElementById("nome");
let sobrenome = document.getElementById("sobrenome");
let email = document.getElementById("email");
let senha = document.getElementById("senha");
let confirmarSenha = document.getElementById("confirmarSenha");

nome.addEventListener('change', function(evento) {

  var valorCampoNome = evento.target.value.trim();

  // Resultados de validação para apresentação das mensagens para usuário
  // 1. Valor do campo possui mais de vinte caracteres
  var campoPossuiMaisDeVinteCaracteres = possuiMaisDeVinteCaracteres(valorCampoNome);

  // 2. Valor do campo possui caracter especial
  var campoPossuiCaracteresEspeciais = possuiCaracteresEspeciais(valorCampoNome);

  // 3. Valor do campo possui números
  var campoPossuiNumeros = possuiNumeros(valorCampoNome);
  
  
  if(campoPossuiMaisDeVinteCaracteres) {
      alert('O campo ultrapassou o limite de caracteres');
  }
  else if(campoPossuiNumeros) {
      alert('O campo não permite o uso de números');
  }
  else if(campoPossuiCaracteresEspeciais) {
      alert('O campo não permite o uso de caracteres especiais');
  }
  else {
      console.log('Dados enviados com sucesso!')
  }

});



sobrenome.addEventListener('change', function(evento) {

  var valorCampoSobrenome = evento.target.value.trim();

  // Resultados de validação para apresentação das mensagens para usuário
  // 1. Valor do campo possui mais de vinte caracteres
  var campoPossuiMaisDeVinteCaracteres = possuiMaisDeVinteCaracteres(valorCampoSobrenome);

  // 2. Valor do campo possui caracter especial
  var campoPossuiCaracteresEspeciais = possuiCaracteresEspeciais(valorCampoSobrenome);

  // 3. Valor do campo possui números
  var campoPossuiNumeros = possuiNumeros(valorCampoSobrenome);
  
  
  if(campoPossuiMaisDeVinteCaracteres) {
      alert('O campo ultrapassou o limite de caracteres');
  }
  else if(campoPossuiNumeros) {
      alert('O campo não permite o uso de números');
  }
  else if(campoPossuiCaracteresEspeciais) {
      alert('O campo não permite o uso de caracteres especiais');
  }
  else {
      console.log('Dados enviados com sucesso!')
  }

});


email.addEventListener('change', function(evento) {

  var valorCampoEmail = evento.target.value.trim();

  // Resultados de validação para apresentação das mensagens para usuário

  // 1. Email no formato correto
  var campoEmailEstaValido = validacaoDeEmail(valorCampoEmail);
  
  
  if(campoEmailEstaValido) {
      return true;
  }
  else {
      return false;
  }
});


senha.addEventListener('change', function(evento) {

  var valorCampoSenha = evento.target.value.trim();

  // Resultados de validação para apresentação das mensagens para usuário

  // 1. Senha segue os requisitos de segurança mínimos:
  var campoSenhaEstaValido = checarSenha(valorCampoSenha);
  
  if(campoSenhaEstaValido) {
      return true;
  }
  else {
      alert('A senha deve possuir entre 8 e 15 caracteres, os quais deverão conter pelo menos UMA letra maiúscula, UMA minúscula, UM número e UM caractere especial (Exemplo: @ # $ %).');
  }
});


confirmarSenha.addEventListener('chance', function(evento) {

  var valorCampoSenha = evento.target.value.trim();

  // Resultados de validação para apresentação das mensagens para usuário

  // 1. Senha está igual a anteriormente digitada:
  var aSenhaEstaIgual = valorCampoSenha === senha.value;
  
  if(aSenhaEstaIgual) {
      return true;
  }
  else {
      alert('A senha informada não corresponde a anteriormente digitada.');
  }
});



///////----- Funções das validações do formulário de cadastro - Nicholas-----\\\\\\\

function possuiMaisDeVinteCaracteres(valorDoCampo) {
  
  var numeroDeCaracteresDoCampoValor = valorDoCampo.length;
  var limiteDeCaracteres = 20;

  var respostaDaValidacao = numeroDeCaracteresDoCampoValor > limiteDeCaracteres;

  return respostaDaValidacao;
}

// 3. Valor do campo possui caracter especial
function possuiCaracteresEspeciais(valorDoCampo) {

  var expressaoRegular = /\W/g;

  var respostaDaValidacao = expressaoRegular.test(valorDoCampo);

  return respostaDaValidacao;
}

// 4. Valor do campo possui números
function possuiNumeros(valorDoCampo) {

  var expressaoRegular = /\d/g

  var respostaDaValidacao = expressaoRegular.test(valorDoCampo);

  return respostaDaValidacao;

}

// 5. Validacao de formato padrao e-mail

function validacaoDeEmail (valorDoCampo){

  var expressaoRegular = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if(valorDoCampo.match(expressaoRegular)){
      console.log('Email válido e enviado com sucesso!');
    }

    else{
      alert('O endereço de e-mail informado é inválido.');
    }

}

// 6. Senha segue os requisitos mínimos de segurança:

function checarSenha(valorDoCampo){
    
  var expressaoRegular = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;

  var validacaoDaSenha = expressaoRegular.test(valorDoCampo)

  return validacaoDaSenha;
}