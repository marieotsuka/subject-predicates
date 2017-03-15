function add(a, b) {
    return a + b;
}

var selectedVerb = "write";
var ngrams = [];
var subjects = [];
var sumAll = 0;
var sums = [];
var textsize = 10;

var year1 = 50;
var year2 = 150;

$(document).ready(function(){

    getData().done(processData);

    $( "#slider-range" ).slider({
          range: true,
          min: 1800,
          max: 2000,
          values: [ 1850, 1950 ],
          slide: function( event, ui ) {
            $( "#year" ).val( ui.values[ 0 ] + " - " + ui.values[ 1 ] );
            year1 = ui.values[ 0 ]-1800;
            year2 = ui.values[ 1 ]-1800;
            computeSum();
          }
        });

    $( "#year" ).val( $( "#slider-range" ).slider( "values", 0 ) + " - " + $( "#slider-range" ).slider( "values", 1 ) );

    $(".verb").click(function(){
        $("#text").empty();
        selectedVerb = $(this).attr('id');
        $(".verb").removeClass('selected');
        $(this).addClass('selected');
        console.log(selectedVerb);
        getData().done(processData);
    });


    function getData(){
      return $.ajax({
            type: 'GET',
            url: 'data/'+ selectedVerb + '.json',
            dataType: 'json'
        });
    }

    function processData(data){
        ngrams = data['ngrams'];
        subjects = Object.keys(ngrams);     
        for(j=0; j<subjects.length; j++){
            $("#text").append('<div class="word">' + subjects[j] + '</div>');    
        }
       computeSum();
    }
   
    function computeSum() {
        sums = [];
        sumAll = 0;
        var sumSubject = 0;     
        for (i = 0; i<subjects.length; i++){
            var subject = subjects[i];
            sumSubject = 0;

            for (j = year1; j<year2+1; j++){
                sumSubject = sumSubject + ngrams[subject][j];
            }

            sums.push([subject, sumSubject]); 
            sumAll = sumAll + sumSubject;         
        } 
        sizeText();       
    }

    function sizeText(){
        $('.word').each(function(index){
            textsize = 300*(sums[index][1] / sumAll);
            $(this).css('font-size', textsize+'px');
        });    
    }



});