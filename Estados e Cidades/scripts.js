
const apiLinkIBGE = "https://servicodados.ibge.gov.br/api/v1/localidades/estados";
const uf = document.getElementById("uf");


uf.addEventListener("change", function(){
    fetch(apiLinkIBGE + "/" + uf.value)
        .then(resp => resp.json())
        .then(json =>{
            document.getElementById("regiao").value = json.regiao.nome;
        })

    fetch(apiLinkIBGE + "/" + uf.value + "/municipios")
        .then(resp => resp.json())
        .then(json =>{
            document.getElementById("municipio").innerHTML = "<option value='0'></option>";
            json.forEach( function(cidade){
                document.getElementById("municipio").innerHTML += 
                    "<option value="+cidade.id+">"+cidade.nome+"</option>";
            })
        })
    
})









let cadastros = new Array();

function cadastraNovo(){
    const formcad = document.getElementById("formcad");
    const formData = new FormData(formcad);         //cria novo objeto de formulário com dados do HTML

    const formObj = Object.fromEntries(formData);   //cria pares chave/valor para formObj
    cadastros.push(formObj);                        //injeta valores do formulário no fim do array de cadastros na RAM
    localStorage.setItem("cadastro", JSON.stringify(cadastros) );
}

function preencheTabela(){
    if(localStorage.hasOwnProperty("cadastro")){    //se o cadastro existe no localStorage
        cadastros = JSON.parse(localStorage.getItem("cadastro"));   //copie cadastro de localStorage para array de cadastros na RAM
    }

    document.getElementById("cadastros").innerHTML = "";    //esvazia HTML da tabela (incluir títulos aqui em vez disso)
    cadastros.forEach( function(cadastro){                  //para cada item do array cadastros, crie uma linha de tabela:
        document.getElementById("cadastros").innerHTML += `<tr>
        <td>${cadastro.nome}</td><td>${cadastro.gen}</td><td>${cadastro.cpf}</td><td>${cadastro.uf}</td><td>${cadastro.regiao}</td><td>${cadastro.municipio}</td><td>${cadastro.ddd}</td><td>${cadastro.tel}</td><td>${cadastro.email}</td>
        </tr>`
    })
}

document.getElementById("cadnovo").addEventListener("click", function(event){ //ao clicar em novo cadastro:
    event.preventDefault();         //impeça evento padrão do botão de formulário
    cadastraNovo();                 //coleta dados do formulário e leva ao array de cadastros e localStorage
    preencheTabela();               //redesenha a tabela de cadastros existentes
})

window.onload = function(){ //após baixar a página:
    fetch(apiLinkIBGE)      //baixa lista de estados
        .then(resp => resp.json())  //processa arquivo baixado como JSON
        .then(json => {             //manipula JSON
            json.forEach( function(estado){
                uf.innerHTML += "<option value="+ estado.id +">"+ estado.nome + "</option>";
            })
        })
        preencheTabela();
}