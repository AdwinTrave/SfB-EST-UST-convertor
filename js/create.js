$(function(){
  //setup date picker for beginning date
  $("#beginning").fdatepicker({format:"yyyy-mm-dd"});

  /**
   * Add unit
   */
  $("#addUnit").click(function(event){
    event.preventDefault();

    //find the latest unit
    var addPoint = $("[class^=unit]").last();
    //console.log(addPoint);

    //determine the latest unit
    var latest = addPoint.attr("id").split("-");
    latest = latest[1];
    addPoint = addPoint.parent();
    //console.log(latest);
    var unitNew = parseInt(latest) + 1;

    //for now limit to 9 units in order to prevent too much craziness
    if(unitNew < 10)
    {
      //add separator
      addPoint.after('<label>Separator '+ unitNew +'<input id="separator-'+ latest +'" class="separator" type="text" max="3" required></label>');

      //add unit
      //console.log(unitNew);
      var addPoint2 = $("[class^=separator]").last().parent();
      addPoint2.after('<label>Unit '+ unitNew +' (how many of unit '+ latest +' are in this unit)<input id="unit-'+ unitNew +'" class="unit" type="number" step="1" min="1" required></label>');
    }
    else
    {
      addPoint.after('<div data-alert class="alert-box warning">That is enough for now. If you really have such complex time, contact me (@storyteller_cz) to get around this. I\'m really curious about your universe now.</div>');
    }
  });

  /**
   * Creat the time
   */
  $("#createTime").submit(function(event){
    event.preventDefault();

    //start animation on the button
    $("#cog").attr("class", "fa fa-cog fa-spin");

    //find the total number of units
    var units = $("[class^=unit]");
    //console.log(units);
    var separators = $("[class^=separator]");
    //console.log(separators);
    var totalUnits = units.last().attr("id").split("-");
    totalUnits = parseInt(totalUnits[1]);
    //console.log(totalUnits);

    var unitsArray = new Array(totalUnits+1)
    var separatorsArray = new Array(totalUnits+2);
    //get all the units and separators into arrays
    var i = totalUnits;
    units.each(function(index, item){
      //console.log(item);
      unitsArray[i] = parseInt($(item).val());
      i--;
    });

    i = totalUnits;
    separators.each(function(index, item){
      //console.log(item);
      if(i === totalUnits)
      {
        separatorsArray[0] = $(item).val();
      }
      else
      {
        separatorsArray[i+1] = $(item).val();
      }
      i--;
    });
    //console.log(unitsArray);

    //calculate the units to milliseconds
    for (var i = 0; i < unitsArray.length; i++) {
      //add another loop to multiply by all the units bellow
      for (var k = i+1; k < unitsArray.length; k++) {
        unitsArray[i] = unitsArray[i] * unitsArray[k];
      }
    }
    //console.log(unitsArray);

    //get the remaining values
    var beginning = $("#beginning").val();
    beginning = new Date(beginning).valueOf();
    //console.log(beginning);

    var name = $("#timeName").val();
    //console.log(name);

    //merge separtorsArray with the time declaration correctly (before, after)
    var declarator = $('input[name=declaration]:checked', '#createTime').val()
    //console.log(declarator);
    if(declarator === "after")
    {
      separatorsArray[totalUnits+1] = separatorsArray[0];
      separatorsArray[0] = "";
    }
    else
    {
      separatorsArray[totalUnits+1] = "";
    }
    //console.log(separatorsArray);

    //create the JSON
    //console.log('{"name": '+JSON.stringify(name)+',"beginning": '+beginning+',"units": '+JSON.stringify(unitsArray)+',"separators": '+JSON.stringify(separatorsArray)+',"declaration": '+JSON.stringify(declarator)+'}');
    var json = JSON.parse('{"name": '+JSON.stringify(name)+',"beginning": '+beginning+',"units": '+JSON.stringify(unitsArray)+',"separators": '+JSON.stringify(separatorsArray)+',"declaration": '+JSON.stringify(declarator)+'}');
    console.log(json);

    //give JSON to the user
    $("#result").html(JSON.stringify(json));

    //stop cog spinning
    $("#cog").attr("class", "fa fa-cog");

    //move the view to the result
    $(window).scrollTop($("#result").offset().top);
  });
});
