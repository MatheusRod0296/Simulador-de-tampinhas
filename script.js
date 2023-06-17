$(document).ready(function(){
    var QtdTimes = 0;
    var QtdJogadoresPorTime = 0;
    var TotalJogadores = 0;
    var JogadoresQueSobraram = 0;

    var CoresEscolhidas = [];
    var VagasPorCores = [];
    var soretioCount = 0;
 
    $("#calcular").click(function(){
        reset();
        TotalJogadores =$("#totalJogadores").val(); 

        calcularQuantidadeTimes();
        showQuantidade();
        showQuantidade();
        
      });

    function calcularQuantidadeTimes(){
        QtdJogadoresPorTime = $("#qtdJogadoresPorTime").val();           

        if(QtdJogadoresPorTime > 0 && TotalJogadores > 0){
            JogadoresQueSobraram = TotalJogadores % QtdJogadoresPorTime;

            var resultadoDivisao = TotalJogadores / QtdJogadoresPorTime;
    
            var resultado = Math.trunc(resultadoDivisao);
            
            if(JogadoresQueSobraram > 0 ){
                resultado++;
            }        
            
            if(resultado > 9){
                alert("Quantidade de times nao pode ultapassar 9!");
                return;
            }
            
            QtdTimes = resultado;           
        } 
    }

    function showQuantidade(){
        $("#lbl_selecione").empty();
        $("#lbl_selecione").prepend("Selecione "+ QtdTimes + " times:");
    }

    function reset(){
        $('input[type=checkbox]').prop('checked',false);
        $("#list-vagas").empty();
        $("#div_status").empty();
        $("#div_cor_sorteada").css("background-color", "white");
        VagasPorCores = [];
        CoresEscolhidas = [];
        soretioCount = 0;
    }
        
    $("input[name='chk']").on('change', function(evt) { 
        if ($('input[type=checkbox]:checked').length > QtdTimes) {
            $(this).prop('checked', false);
            alert("apenas:  "+ QtdTimes);
        }else {
           if($(this).prop('checked')){              
                CoresEscolhidas.push(this.attributes["data"].value);
           }else{
               var index = CoresEscolhidas.indexOf(this.attributes["data"].value);
               CoresEscolhidas.splice(index, 1);
           }           
        }

        if ($('input[type=checkbox]:checked').length == QtdTimes && QtdTimes > 0) {            
            for (let index = 0; index < CoresEscolhidas.length; index++) {
                if(JogadoresQueSobraram > 0 && index == CoresEscolhidas.length -1){
                    VagasPorCores.push({ cor : CoresEscolhidas[index], vagas : JogadoresQueSobraram, vagasOcupadas: 0})  
                }else{
                    VagasPorCores.push({ cor : CoresEscolhidas[index], vagas : QtdJogadoresPorTime, vagasOcupadas: 0})  
                }                            
            }

            mostrarOrdemDosTimes();
        }
    });

    $("#btn_sortear").on('click', function() {   
        if(soretioCount >= TotalJogadores) {
            alert("Times preenchidos!");
            return;
        }

        if(CoresEscolhidas.length < QtdTimes){
            alert("Selecione os times!");
            return;
        }
            
        if(CoresEscolhidas.length > 0){
            var max = CoresEscolhidas.length; 
            var sort = Math.floor(Math.random() * max);
            
            var index = verificarTimeDisponivel(sort);
           
            VagasPorCores[index].vagasOcupadas++;
            soretioCount++;            

            mostrarCoreSorteada(VagasPorCores[index].cor);
            mostrarStatus(VagasPorCores[index].cor); 
            atualizaVagasOcupadas(VagasPorCores[index]);           
        }                   
            
    });  

    function verificarTimeDisponivel(sort){
        if(VagasPorCores[sort].vagasOcupadas < VagasPorCores[sort].vagas){
            return sort;
        }else{
            for (let index = 0; index < VagasPorCores.length; index++) {
                if(VagasPorCores[index].vagasOcupadas < VagasPorCores[index].vagas){
                    return index;
                }                
            }
        }
    }
    
    function mostrarCoreSorteada(cor){  
        $("#div_cor_sorteada").css("display", "none");
        $("#div_cor_sorteada").css("background-color", cor);
        $("#div_cor_sorteada").delay(500).fadeIn();       
    }   

    function mostrarStatus(cor){  
        $("#div_status").prepend("<div class='square-status' style='background-color: "+cor+"'></div>");       
    } 

    function mostrarOrdemDosTimes(){   
        VagasPorCores.forEach(element => {
            if(element.cor == "yellow" || element.cor == "pink" || element.cor == "orange" || element.cor == "greenyellow"){
                $("#list-vagas").append('<li id="li_'+ element.cor +'" class="list-group-item row_status color-black" style="background-color: '+element.cor+'">Vagas:  0/'+element.vagas+'</li>');
            }else{
                $("#list-vagas").append('<li id="li_'+ element.cor +'" class="list-group-item row_status color-white" style="background-color: '+element.cor+'">Vagas:  0/'+element.vagas+'</li>');
            }
        });  
    }

    function atualizaVagasOcupadas(vagas){
        $("#li_"+ vagas.cor).empty();
        $("#li_"+ vagas.cor).append("Vagas:  " +vagas.vagasOcupadas+"/" +vagas.vagas);
    }
    
});

