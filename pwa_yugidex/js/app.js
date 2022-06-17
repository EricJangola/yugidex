/*
#
# Globais
#
*/
var quant_cards = 10;
var contar = 1;
var endpoint_yugioh = " https://db.ygoprodeck.com/api/v7/cardinfo.php";
var tela_detalhe = document.getElementById("conteudo");
var resultados = document.getElementById("resultados");
var data_json;
var CACHE_DINAMICO = "yugidex_dinamico";
/*
#
# Requisição AJAX
#
*/
function carregar_yugioh(){
    
    let ajax = new XMLHttpRequest();

    ajax.open("GET", endpoint_yugioh, true);
    ajax.send();
    
    //Lendo requisição
    ajax.onreadystatechange = function(){

        if(this.readyState == 4 && this.status == 200)
        {
            console.log(this.responseText);
            data_json = JSON.parse(this.responseText).data;
            console.log('data_json', data_json);

            if(data_json.length > 0){
                resultados.className = "row";
                
                try {
                    cache_dinamico_json();
                } catch (ex) {
                    console.log(ex);
                }
                
                //Carga inicial
                imprimir_yugioh();
            }
        }

    }
}

carregar_yugioh();

var files_img_yugiohs = [];

function imprimir_yugioh(){

    let html_conteudo = "";
    let limite;
    if((contar+quant_cards) < data_json.length){
        limite = (contar+quant_cards);
    }else{
        limite = data_json.length;
        btCarregarMais.style.display = "none";
    }

    for(let i=contar; i < limite; i++){
        //Montar Card
        html_conteudo+=card_yugioh(i,data_json[i].name,data_json[i].type,data_json[i].card_images[0].image_url);  

    }

    resultados.innerHTML += html_conteudo;

    contar+=quant_cards;

}

/*
#
# Comportamento Botões
#
*/

let btVoltar = document.getElementById("btVoltar");

btVoltar.addEventListener("click", function(){
    let color = tela_detalhe.className.substring(tela_detalhe.className.indexOf("color_"));
    tela_detalhe.className = "animate__animated animate__bounceOutLeft "+color;
    
    setTimeout(function(){document.getElementById("conteudo_img").style.display = "none";}, 500);
});

let btCarregarMais = document.getElementById("btCarregarMais");

btCarregarMais.addEventListener("click", function(){
    imprimir_yugioh();
});

function btCard(id){
    console.log('btCard', id);
    tela_detalhe.style.display = "block";

    document.getElementById("conteudo_img").style.display = "block";
    tela_detalhe.className = "animate__animated animate__bounceInLeft color_"+data_json[id].type.replace(/\s/g, '');   
    document.getElementById("conteudo_img").setAttribute("src",data_json[id].card_images[0].image_url);
    document.getElementById("conteudo_nome").innerHTML = data_json[id].name;
    document.getElementById("conteudo_numero").innerHTML = "#"+padLeadingZeros(data_json[id].id, 3);;
    document.getElementById("conteudo_tipo").innerHTML = data_json[id].type;
    document.getElementById("conteudo_descricao").innerHTML = data_json[id].desc;
    document.getElementById("conteudo_ataque").innerHTML = data_json[id].atk || 'NA';
    document.getElementById("conteudo_defesa").innerHTML = data_json[id].def || 'NA';
    document.getElementById("conteudo_altura").innerHTML = data_json[id].race;
}


/*
#
# Sistema de Template
#
*/

function card_yugioh(id,nome,tipo,img){

    return '<div class="col-6 col-md-3" onClick="javascript:btCard(\''+id+'\');" data-id="'+id+'">'+
                '<div class="card_yugioh color_'+tipo.replace(/\s/g, '')+'">'+
                '<div class="info_yugioh">'+
                    '<h3>'+nome+'</h3>'+
                    '<span class="badge rounded-pill bg-alert-poke">'+tipo+'</span>'+
                '</div>'+
                '<img src="'+img+'" class="img_yugioh">'+
                '</div>'+
            '</div>';
}

/*
#
# Cache Dinâmico (json / imgs)
#
*/
var cache_dinamico_json = function(){

    localStorage[CACHE_DINAMICO] = JSON.stringify(data_json);
}

/*
#
# Botao de Instalação
#
*/

let janelaInstalacao = null;

const btInstall = document.getElementById("btInstall");

window.addEventListener('beforeinstallprompt', gravarJanela);

function gravarJanela(evt){
    janelaInstalacao = evt;
}

let inicializarInstalacao = function(){

    btInstall.removeAttribute("hidden");
    btInstall.addEventListener("click", function(){

        janelaInstalacao.prompt();

        janelaInstalacao.userChoice.then((choice) => {

            if(choice.outcome === 'accepted'){
                console.log("Usuário fez a instalação do app");
            }else{
                console.log("Usuário NÃO fez a instalação do app");
            }

        });

    });

}

/*
#
# Funções Extras
#
*/
function padLeadingZeros(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}