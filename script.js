$(document).ready(function(){
    var _totalTeams = 0;
    var _totalPlayersPerTeam = 0;
    var _totalPlayers = 0;
    var _restOfPlayers = 0;

    var _colorsChosen = [];
    var _spotsPerColor = [];
    var _sortCount = 0;
    var _colorsCount = 0;

    // Modal Alert Function
    function showAlert(message) {
        $("#alert-message").text(message);
        $("#alert-modal").removeClass("hidden");
    }

    // Close Modal
    $("#alert-button").on('click', function() {
        $("#alert-modal").addClass("hidden");
    });

    // Close modal when clicking outside
    $("#alert-modal").on('click', function(e) {
        if (e.target === this) {
            $(this).addClass("hidden");
        }
    });

    // Inline validation on blur
    function validateInput($input) {
        const value = parseInt($input.val());
        const isValid = value > 0;

        if ($input.val() === '') {
            $input.addClass('error');
            showInputError($input, 'Este campo é obrigatório');
        } else if (!isValid) {
            $input.addClass('error');
            showInputError($input, 'Deve ser um número maior que 0');
        } else {
            $input.removeClass('error');
            hideInputError($input);
        }
    }

    function showInputError($input, message) {
        const errorId = $input.attr('id') + '-error';
        if (!$('#' + errorId).length) {
            $input.after('<span id="' + errorId + '" class="error-message">' + message + '</span>');
        }
    }

    function hideInputError($input) {
        const errorId = $input.attr('id') + '-error';
        $('#' + errorId).remove();
    }

    // Add blur validation to inputs
    $("#players, #playersPerTeam").on('blur', function() {
        validateInput($(this));
    });

    $("#calculate").click(function(){
        reset();
        _totalPlayers = $("#players").val();
        _totalPlayersPerTeam = $("#playersPerTeam").val();
        if(_totalPlayers <= 0 || _totalPlayersPerTeam <= 0){
            showAlert("Preencha os campos acima!");
            return;
        }

        _restOfPlayers = calculateRestOfPlayers(_totalPlayers, _totalPlayersPerTeam);

        _totalTeams = calculateAmountOfTeams(_totalPlayers, _totalPlayersPerTeam, _restOfPlayers);

        if(_totalTeams > 0) {
            showNumberOfTeams(_totalTeams);
            $("#teams-section").removeClass("hidden");
            $("#draw-section").addClass("hidden");
            $("#teams-list-section").addClass("hidden");
        }
      })

    $("input[name='chk']").on('change', function() {
        if(CanCheck(this, _totalTeams, _colorsChosen)){
            if ($('input[type=checkbox]:checked').length == _totalTeams && _totalTeams > 0){
                buildSpotsPerColor(_colorsChosen, _restOfPlayers, _spotsPerColor, _totalPlayersPerTeam);
                showTeamsOrder(_spotsPerColor);
                $("#draw-section").removeClass("hidden");
                $("#teams-list-section").removeClass("hidden");
            }

            _colorsCount = _colorsChosen.length;
        }
    })

    $("#btn_sort").on('click', function() {
        if(_colorsCount == 0 ||_colorsCount < _totalTeams){
            showAlert("Selecione os times!");
            return;
        }

        if(_sortCount >= _totalPlayers) {
            showAlert("Times preenchidos!");
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
                showAlert("Quantidade de times não pode ultrapassar 9!");
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
        let colorGradient = getColorGradient(cor);
        $("#sorted_color").css("display", "none");
        $("#sorted_color").css("background", colorGradient);
        $("#sorted_color").delay(50).fadeIn();
    }

    function getColorGradient(color) {
        const gradients = {
            "green": "linear-gradient(135deg, #10b981, #059669)",
            "blue": "linear-gradient(135deg, #3b82f6, #1e40af)",
            "red": "linear-gradient(135deg, #ef4444, #dc2626)",
            "yellow": "linear-gradient(135deg, #eab308, #ca8a04)",
            "purple": "linear-gradient(135deg, #8b5cf6, #6d28d9)",
            "pink": "linear-gradient(135deg, #ec4899, #be185d)",
            "orange": "linear-gradient(135deg, #f97316, #ea580c)",
            "black": "linear-gradient(135deg, #374151, #111827)",
            "greenyellow": "linear-gradient(135deg, #84cc16, #65a30d)"
        };
        return gradients[color] || color;
    }

    function showStatus(cor){
        let colorGradient = getColorGradient(cor);
        $("#status").prepend("<div class='cap-status' style='background: "+ colorGradient +"'></div>");
    } 

    function CanCheck(input, totalTeams, colorsChosen){
        if ($('input[type=checkbox]:checked').length > totalTeams) {
            $(input).prop('checked', false);
            showAlert("Selecione apenas " + totalTeams + " time(s)!");
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
            const textClass = (spot.color == "yellow" || spot.color == "pink" || spot.color == "orange" || spot.color == "greenyellow") ? "text-black" : "text-white";
            const bgGradient = getColorGradient(spot.color);
            $("#list-spots").append('<li id="li_'+ spot.color +'" class="list-group-item '+ textClass +'" style="background: '+ bgGradient +'">Vagas: 0/'+ spot.spotsAvailable +'</li>');
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
        $("#sorted_color").css("background", "white");
        _spotsPerColor = [];
        _colorsChosen = [];
        _sortCount = 0;
    }
});
