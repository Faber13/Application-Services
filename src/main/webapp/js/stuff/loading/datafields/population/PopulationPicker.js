/**
 * Created by fabrizio on 5/29/14.
 */
define(["jquery"],function($) {

    var list;

    function PopulationPicker() {}


    PopulationPicker.prototype.init = function(forecast,  request, prevYear, populationConfigurator){
        list = populationConfigurator;
        var populationBean = this.preparePopulationBean(request, prevYear)  ;
        var population = this.getPopulation(populationBean)
        if((typeof population === 'undefined' || population.length ==0 )|| population[0].value == 0 ){
            var nullPopulation = this.getNullPopulation();
            forecast.push(nullPopulation);
        }else {
            forecast.push(population[0])
        }
        return forecast;
    }


    PopulationPicker.prototype.getPopulation = function(populationBean){

        var url = "http://localhost:8081/wds/rest/amis/cbsmonthly/AMISCBS/populations"

        var population


        $.ajax({
            async: false,
            url: url,
            type: 'post',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify(populationBean),
            success : function(data){
                population= data;
            }
        });

        return population;

    }


    PopulationPicker.prototype.preparePopulationBean = function(datafields, prevYear){
       var populationBean ;

        if(prevYear) {
            populationBean = {
                year: datafields.years.previousYear,
                regionCode: datafields.post.regionCode,
                databaseValue: datafields.post.databaseValue
            }
        }else {
            populationBean = {
                year: datafields.years.currentYear,
                regionCode: datafields.post.regionCode,
                databaseValue: datafields.post.databaseValue
            }
        }

        return populationBean;

    }


    PopulationPicker.prototype.getNullPopulation = function(){

        var object = {
            "elementCode": list.elementCode,
            "elementName": list.elementName,
            "flag": "",
            "lastUpdate": "",
            "units": list.units,
            "value": ""
        };
        return object;
    }



    return PopulationPicker;

})