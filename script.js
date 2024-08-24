$(document).ready(function(){
    var _totalTeams = 0;
    var _totalPlayersPerTeam = 0;
    var _totalPlayers = 0;
    var _restOfPlayers = 0;

    var _colorsChosen = [];
    var _spotsPerColor = [];
    var _sortCount = 0;
    var _colorsCount = 0;
 
    $("#calculate").click(function(){
        reset();
        _totalPlayers = $("#players").val(); 
        _totalPlayersPerTeam = $("#playersPerTeam").val();
        if(_totalPlayers <= 0 || _totalPlayersPerTeam <= 0){
            alert("Preencha os campos a cima!");
            return;
        }

        _restOfPlayers = calculateRestOfPlayers(_totalPlayers, _totalPlayersPerTeam);

        _totalTeams = calculateAmountOfTeams(_totalPlayers, _totalPlayersPerTeam, _restOfPlayers);
        
        showNumberOfTeams(_totalTeams); 
      })   
        
    $("input[name='chk']").on('change', function() { 
        if(CanCheck(this, _totalTeams, _colorsChosen)){
            if ($('input[type=checkbox]:checked').length == _totalTeams && _totalTeams > 0){
                buildSpotsPerColor(_colorsChosen, _restOfPlayers, _spotsPerColor, _totalPlayersPerTeam);
                showTeamsOrder(_spotsPerColor);
            }
    
            _colorsCount = _colorsChosen.length;
        }
    })   

    $("#btn_sort").on('click', function() {   
        if(_colorsCount == 0 ||_colorsCount < _totalTeams){
            alert("Selecione os times!");
            return;
        }

        if(_sortCount >= _totalPlayers) {
            alert("Times preenchidos!");
            return;
        }        
            
        if(_colorsChosen.length > 0){            
            let indexOfSpot = sort(_colorsChosen, _spotsPerColor);

            showSortedColor(_spotsPerColor[indexOfSpot].color);
            showStatus(_spotsPerColor[indexOfSpot].color); 
            updateSpotsAvailables(_spotsPerColor[indexOfSpot]);  
            _sortCount++;         
        } 
    })
    
    function calculateAmountOfTeams(totalPlayers, totalPlayersPerTeam, restOfPlayers){
        if(totalPlayersPerTeam > 0 && totalPlayers > 0){  
            var totalTeams = Math.trunc(totalPlayers / totalPlayersPerTeam);
            
            if(restOfPlayers > 0 ){
                totalTeams++;
            }        
            
            if(totalTeams > 9){
                alert("Quantidade de times nao pode ultapassar 9!");
                return;
            }
            
           return totalTeams;          
        } 
    }

    function calculateRestOfPlayers(totalPlayers, totalPlayersPerTeam){
        if(totalPlayersPerTeam > 0 && totalPlayers > 0){
            return totalPlayers % totalPlayersPerTeam;
        }              
    }

    function showNumberOfTeams(totalTeams){
        $("#lbl_select").empty();
        $("#lbl_select").prepend("Selecione "+ totalTeams + " times:");
    }

    function sort(colorsChosen, spotsPerColor ){
        let sort = Math.floor(Math.random() * colorsChosen.length);
        var sortedColor = colorsChosen[sort];
         
        var indexOfSpot =  spotsPerColor.map( e => e.color).indexOf(sortedColor);
        
        let available = verifyAvailableTeam(indexOfSpot, spotsPerColor);
        if(available == 1){
            spotsPerColor[indexOfSpot].spotsFilled++;
            return indexOfSpot;
        }else if(available == 2){
            return recursiveSort(colorsChosen, spotsPerColor);
        }
        else if(available == 0){
            colorsChosen.splice(sort, 1);         
            return recursiveSort(colorsChosen, spotsPerColor);
        } 
    }

    function recursiveSort(colorsChosen, spotsPerColor){
        return sort(colorsChosen, spotsPerColor);
    }

    function verifyAvailableTeam(indexOfSpot, spotsPerColor, sortedColor){       
        if(spotsPerColor.every(spot => spot.spotsFilled > 0)){
            if(indexOfSpot > -1 && spotsPerColor[indexOfSpot].spotsFilled < spotsPerColor[indexOfSpot].spotsAvailable){
                return 1;
            }
        }else if(indexOfSpot > -1 && spotsPerColor[indexOfSpot].spotsFilled > 0){
            return 2;
        }else if(indexOfSpot > -1 && spotsPerColor[indexOfSpot].spotsFilled == 0){
            return 1;
        }

        return 0;       
    }
    
    function showSortedColor(cor){  
        $("#sorted_color").css("display", "none");
        $("#sorted_color").css("background-color", cor);
        $("#sorted_color").delay(50).fadeIn();       
    }   

    function showStatus(cor){  
        $("#status").prepend("<div class='cap-status' style='background-color: "+ cor +"'></div>");       
    } 

    function CanCheck(input, totalTeams, colorsChosen){
        if ($('input[type=checkbox]:checked').length > totalTeams) {
            $(input).prop('checked', false);
            alert("apenas:  "+ totalTeams); 
            return false;           
        }else if($(input).prop('checked')) {  
            colorsChosen.push(input.attributes["data"].value);
            return true;             
        }else {
            reset();
            return false;
        }        
    }

    function buildSpotsPerColor(colorsChosen, restOfPlayers, spotsPerColor, totalPlayersPerTeam){               
        for (let index = 0; index < colorsChosen.length; index++) {
            if(restOfPlayers > 0 && index == colorsChosen.length -1){
                spotsPerColor.push({ color : colorsChosen[index], spotsAvailable : restOfPlayers, spotsFilled: 0})  
            }else{
                spotsPerColor.push({ color : colorsChosen[index], spotsAvailable : totalPlayersPerTeam, spotsFilled: 0})  
            }                            
        }
    }

    function showTeamsOrder(spotsPerColor){
        spotsPerColor.forEach(spot => {
            if(spot.color == "yellow" || spot.color == "pink" || spot.color == "orange" || spot.color == "greenyellow"){
                $("#list-spots").append('<li id="li_'+ spot.color +'" class="list-group-item row_status text-black" style="background-color: '+ spot.color +'">Vagas:  0/'+ spot.spotsAvailable +'</li>');
            }else{
                $("#list-spots").append('<li id="li_'+ spot.color +'" class="list-group-item row_status text-white" style="background-color: '+ spot.color +'">Vagas:  0/'+ spot.spotsAvailable +'</li>');
            }
        });  
    }

    function updateSpotsAvailables(spotsPerColor){
        $("#li_"+ spotsPerColor.color).empty();
        $("#li_"+ spotsPerColor.color).append("Vagas:  " + spotsPerColor.spotsFilled +"/" + spotsPerColor.spotsAvailable);
    } 
    
    function reset(){
        $('input[type=checkbox]').prop('checked',false);
        $("#list-spots").empty();
        $("#status").empty();
        $("#sorted_color").css("background-color", "white");
        _spotsPerColor = [];
        _colorsChosen = [];
        _sortCount = 0;
    }
});
