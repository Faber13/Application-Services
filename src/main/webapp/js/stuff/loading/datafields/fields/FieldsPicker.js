/**
 * Created by fabrizio on 6/2/14.
 */
define(["jquery"],function($) {


    var months ,list, url;

    function FieldsPicker() {};


    FieldsPicker.prototype.init = function(months, preloadingData, configurator) {

        url = "http://localhost:8081/wds/rest/amis/cbsmonthly/AMISCBS/forecast/fields"

        months = months;
        list = configurator;

        // PreviousYear

        if (months.bestMonthOfPreviousYear != null) {
            var postForecastPrevYear = this.prepareFieldBean(months, preloadingData)
            var prevYearForecastFields = this.getForecastFields(postForecastPrevYear);
        } else {
            prevYearForecastFields = this.getNullForecast();
        }

        // CurrentYear
        var postForecastActualYear = this.prepareActualYearBean(months, preloadingData)
        var currentYearForecastsFields = this.getFieldsForCurrentYear(months.monthsForCurrentYear, postForecastActualYear);

        var fields = this.returnYearsForecastFields(prevYearForecastFields, currentYearForecastsFields);

        return fields;

    }



    FieldsPicker.prototype.prepareFieldBean = function(months, preloadingData){

       var  postForecast= {
            regionCode: preloadingData.post.regionCode,
            productCode: preloadingData.post.productCode,
            databaseText: preloadingData.post.databaseText,
            databaseValue: preloadingData.post.databaseValue,
            year: preloadingData.years.previousYearLabel,
            month:  months.bestMonthOfPreviousYear.month,
            monthPosition : months.bestMonthOfPreviousYear.monthPosition
        };
        return postForecast;


    }



    FieldsPicker.prototype.prepareActualYearBean = function(months,preloadingData){

        var postForecasts= [];


        for(var i =0; i<months.monthsForCurrentYear.length; i++){

            postForecasts[i]= {
                regionCode: preloadingData.post.regionCode,
                productCode: preloadingData.post.productCode,
                databaseText: preloadingData.post.databaseText,
                databaseValue: preloadingData.post.databaseValue,
                year: preloadingData.years.currentYearLabel,
                month:  months.monthsForCurrentYear[i].month,
                monthPosition : months.monthsForCurrentYear[i].monthPosition
                };

        }
        return postForecasts;

    }



    FieldsPicker.prototype.getNullForecast = function(){



        var result = []
        for(var i=0; i< list.length; i++) {
            if (list[i].elementCode != -1) {
                var object = {
                    "elementCode": list[i].elementCode,
                    "elementName": list[i].elementName,
                    "flag": "",
                    "lastUpdate": "",
                    "units": list[i].units,
                    "value": ""
                };
                result.push(object)
            }
            else {
                var object = {
                    "elementCode": list[i].elementCode,
                    "elementName": list[i].elementName,
                    "flag": "",
                    "lastUpdate": "",
                    "units": "",
                    "value": ""
                };
                result.push(object)
            }
        }

        return result;
    }



    FieldsPicker.prototype.getFieldsForCurrentYear = function(monthsCurrentYear, postForecastActualYear){

        var currentYearForecastsFields = [];
        for(var i = 0; i< monthsCurrentYear.length; i++){

            currentYearForecastsFields.push(this.getForecastFields(postForecastActualYear[i]));

        }
        return currentYearForecastsFields;

    }



    FieldsPicker.prototype.getForecastFields = function(postForecast){

        var forecasts

        $.ajax({
            async: false,
            url: url,
            type: 'post',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify(postForecast),
            success : function(data){
                forecasts= data;
            }
        });

        return forecasts;

    }


    FieldsPicker.prototype.returnYearsForecastFields = function(prevYear, actualYear){

        var forecasts = {
            currentYearFields : actualYear,
            prevYearFields   : prevYear
        }

        return forecasts;
    }



    return FieldsPicker;

});
