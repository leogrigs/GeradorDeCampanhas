$(document).ready(init());

function init() {
  chamada();
}

// Função que faz chamada externa para ContentStack e retorna uma entry específica.
function chamada(){
    var myHeaders = new Headers();
    myHeaders.append("api_key", "bltefa138b6241a5e0b");
    myHeaders.append("authorization", "csc06618dd63bc55f9957698bd");
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };
    fetch("https://api.contentstack.io/v3/content_types/testes/entries/blt8930c784322d9ccd", requestOptions)
      .then(response => response.text())
      .then(result => {
        console.log(result)
        manipulaJson(result);
      })
      .catch(error => console.log('error', error));
}

// Manipula a entry extraindo os campos a serem criados
function manipulaJson(result){
  let json = JSON.parse(result);
  console.log(json);

  // Extrai título da campanha
  let titulo = json.entry.title;
  criaCampoTitulo(titulo);

  // Extrai o texto legal da campanha
  let texto = json.entry.texto_legal;
  criaCampoTexto(texto);

  // Verifica se a campanha tem imagem
  if (json.entry.ilustracao != null) {
    let urlImg = json.entry.ilustracao.url
    criaImagem(urlImg)
  }
  
  // Faz uma lista com os campos opcionais que haverá na campanha
  let fields = json.entry.campos_de_captura.campos_da_campanha;
  let array = Object.entries(fields);
  let lista = new Array();
  for (let i = 0; i < fields.length; i++) {
    let map = new Map(Object.entries(fields[i]));
    let iter = map.keys();
    let value = iter.next().value;
    if (value === 'sim_ou_nao'){
      console.log(map.get('sim_ou_nao').pergunta);
      lista.push({'sim_ou_nao': map.get('sim_ou_nao').pergunta})
    }
    else{
      lista.push(value);
    }
  }
  console.log(lista);
  criaCampos(lista);
}

// Função que verifica se uma variável é um objeto
function isObject(obj) {
  if (obj === Object(obj)) {
    return true;
  }
  return false;
}

// Função que recebe uma lista de campos e determina quais campos serão criados
function criaCampos(lista){
  lista.forEach(element => {
    if (isObject(element)) {
      criaCampoCheck(element.sim_ou_nao);
    }
    else{
      switch (element) {
        case 'nome':
          criaCampoNome();
          break;
      
        case 'cpf':
          criaCampoCPF();
          break;
  
        case 'apelido':
          criaCampoApelido();
          break;
        
        case 'data_de_nascimento':
          criaCampoData();
          break;
        
        case 'cep':
          criaCampoCEP();
          break;
        
        case 'email':
          criaCampoEmail();
          break;
        
          case 'whatsapp':
            criaCampoWhats();
            break;   
        
      }
    }
  })

}

// Funções de criação de campos
function criaCampoTitulo(titulo) {
  $(".titulo").append(`<h2 style="font-size: 72px;">${titulo}</h2>`);
}
function criaCampoTexto(texto){
  $(".titulo").append(`<h6 style="font-family: 'Sniglet', cursive; font-size: 20px;">${texto}</h6>`);
}

function criaCampoNome() {
  $(".formulario").append("<div class='mb-3 row'><label for='nome' class='col-sm-2 col-form-label'>Nome</label><div class='col-sm-10'><input type='text' class='form-control' id='nome' onblur='verificaNome(this.value)' placeholder='Nome Completo [max 50]' maxlength='50'></div></div>")
  
}
function criaCampoCPF() {
  $(".formulario").append("<div class='mb-3 row'><label for='cpf' class='col-sm-2 col-form-label'>CPF</label><div class='col-sm-10'><input type='text' class='form-control' id='cpf' onke placeholder='CPF' onkeyup='verificaCPF()'></div></div>")
}
function criaCampoApelido() {
  $(".formulario").append("<div class='mb-3 row'><label for='apelido' class='col-sm-2 col-form-label'>Apelido</label><div class='col-sm-10'><input type='text' class='form-control' id='apelido' onblur='verificaApelido(this.value)' placeholder='Apelido [max 20]' maxlength='20'></div></div>")
}
function criaCampoEmail() {
  $(".formulario").append("<div class='mb-3 row'><label for='email' class='col-sm-2 col-form-label'>Email</label><div class='col-sm-10'><input type='text' class='form-control col-sm-5' id='email' onblur='verificaEmail(this.value)' placeholder='Email' maxlength='50'></div></div>")
}
function criaCampoData() {
  $(".formulario").append("<div class='mb-3 row'><label for='data' class='col-sm-2 col-form-label'>Data de Nascimento</label><div class='col-sm-10'><input type='text' class='form-control' id='data' onke placeholder='dd/mm/yyyy' onkeyup='verificaData()'></div></div>")
}
function criaCampoCEP() {
  $(".formulario").append("<div class='mb-3 row'><label for='cep' class='col-sm-2 col-form-label'>CEP</label><div class='col-sm-10'><input type='text' class='form-control' id='cep' placeholder='CEP' onkeyup='verificaCEP()'></div></div>")
}
function criaCampoCheck(pergunta){
  console.log(pergunta);
  $(".formulario").append(`<div class='mb-3 row'><div class='col-sm-2'><input class='form-check-input' type='checkbox' value='' id='flexCheckDefault'></div><div class='col-sm-10'><label class='form-check-label' for='flexCheckDefault'><h6>${pergunta}</h6></label></div></div> `)
}
function criaCampoWhats() {
  $(".formulario").append("<div class='mb-3 row'><label for='whats' class='col-sm-2 col-form-label'>Whatsapp</label><div class='col-sm-10'><input type='text' class='form-control' id='whats' onke placeholder='(DDD) Telefone' onkeyup='verificaWhats()'></div></div>")
}
function criaImagem(urlImagem){
  $(".imagem").append( `<img class='camp' src='${urlImagem}' alt='imagem campanha'>`)
}

// Funções de verificação de campos e máscaras
function verificaNome(nome) {
  var regex = new RegExp("[^0-9]")
  if (!regex.test(nome)){
    alert("Nome Inválido");
  }
}
function verificaCPF() {
  var $cpf = $("#cpf");
  $cpf.mask('000.000.000-00', {reverse: true});
}
function verificaApelido(apelido) {
  var regex = new RegExp("[^0-9]")
  if (!regex.test(apelido)){
    alert("Apelido Inválido");
  }
}
function verificaData() {
  var $data = $("#data");
  $data.mask('00/00/0000');
}
function verificaCEP() {
  var $cep = $("#cep");
  $cep.mask('00000-000');
}
function verificaEmail(email) {
  var $email = $("#email");
  $email.mask("A", {
    translation: {
      "A": { pattern: /[\w@\-.+]/, recursive: true }
    }
  });
}
function verificaWhats() {
  var $whats = $("#whats");
  $whats.mask('(000) 00000-0000');
}



