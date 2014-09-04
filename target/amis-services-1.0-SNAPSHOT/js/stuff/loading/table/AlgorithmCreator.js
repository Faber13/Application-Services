/**
 * Created by fabrizio on 6/9/14.
 */
define(["jquery" ], function ($) {

    var configurator, forecasts;


    function AlgorithmCreator() {
    }


    AlgorithmCreator.prototype.init = function (forecast) {
        forecasts = forecast;
        var listForecastElements = new Object();
        listForecastElements = this.createList(forecasts.prevYearFields);
        forecasts.prevYearFields = this.listOfInitActions(listForecastElements, forecasts.prevYearFields)
        if (Object.prototype.toString.call(forecasts.currentYearFields[0]) === '[object Array]') {
            for (var i = 0; i < forecasts.currentYearFields.length; i++) {
                forecasts.currentYearFields[i] = this.listOfInitActions(listForecastElements, forecasts.currentYearFields[i]);
            }
        } else {
            forecasts.currentYearFields = this.listOfInitActions(listForecastElements, forecasts.currentYearFields);
        }

        return forecasts
    }


    AlgorithmCreator.prototype.listOfInitActions = function (listForecastElements, forecasts) {

        forecasts[listForecastElements["unbalanced"]].value = this.changeUnbalanced(listForecastElements, forecasts)
        forecasts[listForecastElements["domSupply"]] = this.changeDomesticSupply(listForecastElements, forecasts)
        forecasts[listForecastElements["totSupply"]] = this.changeTotalSupply(listForecastElements, forecasts)

        if (typeof (this.changeYield(listForecastElements, forecasts)) != "boolean") {
            forecasts[listForecastElements["yield"]].value = this.changeYield(listForecastElements, forecasts)
        }
        forecasts[listForecastElements["domUtilization"]] = this.changeDomesticUtilization(listForecastElements, forecasts)
        forecasts[listForecastElements["totUtilization"]] = this.changeTotalUtilization(listForecastElements, forecasts)
        forecasts[listForecastElements["perCapFoodUSe"]].value = this.changePerCapFoodUse(listForecastElements, forecasts)


        return forecasts


    }


    AlgorithmCreator.prototype.createList = function (list) {

        var array = list;
        var listElements = new Object();
        listElements["unbalanced"] = this.findAndCreateObject(-1, array);
        listElements["openingStock"] = this.findAndCreateObject(18, array);
        listElements["closingStock"] = this.findAndCreateObject(16, array);
        listElements["totSupply"] = this.findAndCreateObject(19, array);
        listElements["totUtilization"] = this.findAndCreateObject(35, array);
        listElements["domSupply"] = this.findAndCreateObject(27, array);
        listElements["production"] = this.findAndCreateObject(5, array);
        listElements["impNMY"] = this.findAndCreateObject(7, array);
        listElements["yield"] = this.findAndCreateObject(4, array);
        listElements["domUtilization"] = this.findAndCreateObject(20, array);
        listElements["areaH"] = this.findAndCreateObject(2, array);
        listElements["foodUse"] = this.findAndCreateObject(14, array);
        listElements["feedUse"] = this.findAndCreateObject(13, array);
        listElements["otherUses"] = this.findAndCreateObject(15, array);
        listElements["expNMY"] = this.findAndCreateObject(10, array);
        listElements["perCapFoodUSe"] = this.findAndCreateObject(25, array);
        listElements["population"] = this.findAndCreateObject(1, array);

        return listElements;
    }

// TO DO:  dicotomic research
    AlgorithmCreator.prototype.findAndCreateObject = function (id, array) {
        var result;
        var notFound = true;

        for (var i = 0; i < array.length && notFound; i++) {
            if (array[i].elementCode == id) {
                result = i;
                notFound = false;
            }
        }
        return result;

    }


    AlgorithmCreator.prototype.checkIfNull = function (value) {
        var result;
        if (typeof value == "string" && value == "") {
            result = 0;
        } else {
            result = value;
        }
        return result;
    }


    AlgorithmCreator.prototype.changeOpeningStock = function (elementList, prevArray, currentArray) {

        var idOpeningStock = elementList["openingStock"];
        var idClosingStock = elementList["closingStock"];

        currentArray["openingStock"].value = prevArray["closingStock"].value;

        return currentArray;


    }

    AlgorithmCreator.prototype.changeUnbalanced = function (elementList, array) {

        var result;

        var idTotSupply = elementList["totSupply"];
        var idTotUtilization = elementList["totUtilization"]

        result = this.checkIfNull(array[idTotSupply].value) - this.checkIfNull(array[idTotUtilization].value)
        // Only two decimal
        result = parseFloat(result.toFixed(2))

        return result


    }

    AlgorithmCreator.prototype.changeDomesticSupply = function (elementList, array) {

        var element = array;

        var idOpeningStock = elementList["openingStock"];
        var idProduction = elementList["production"]

        element.value = this.checkIfNull(array[idOpeningStock].value) + this.checkIfNull(array[idProduction].value)
        element.value = parseFloat(element.value.toFixed(2))
        element.flag = "C";

        return element


    }

    AlgorithmCreator.prototype.changeTotalSupply = function (elementList, array) {

        var element = array;

        var idDomSupply = elementList["domSupply"];
        var idImpNMYn = elementList["impNMY"]

        element.value = this.checkIfNull(array[idDomSupply].value) + this.checkIfNull(array[idImpNMYn].value)
        element.value = parseFloat(element.value.toFixed(2))
        element.flag = "C";

        return element


    }

    AlgorithmCreator.prototype.changeYield = function (elementList, array) {

        var result;

        var idProduction = elementList["production"]
        var idAreaH = elementList["areaH"]

        if (array[idAreaH].value != 0 || array[idAreaH].value != "") {
            result = this.checkIfNull(array[idProduction].value) / this.checkIfNull(array[idAreaH].value)
            result = parseFloat(result.toFixed(2))
            return result;

        } else {
            return false;
        }


    }

    AlgorithmCreator.prototype.changeDomesticUtilization = function (elementList, array) {

        var element = array;

        var idFoodUse = elementList["foodUse"]
        var idFeedUse = elementList["feedUse"]
        var idOtherUse = elementList["otherUses"]


        element.value = this.checkIfNull(array[idFoodUse].value) + this.checkIfNull(array[idFeedUse].value) +
            this.checkIfNull(array[idOtherUse].value)

        element.value = parseFloat(element.value.toFixed(2))
        element.flag = "C"


        return element


    }


    AlgorithmCreator.prototype.changeTotalUtilization = function (elementList, array) {

        var element = array;
        var idDomUtilization = elementList["domUtilization"];
        var idExpNMY = elementList["expNMY"]
        var idClosingStock = elementList["closingStock"]

        element.value = this.checkIfNull(array[idDomUtilization].value) + this.checkIfNull(array[idExpNMY].value) +
            this.checkIfNull(array[idClosingStock].value)
        element.value = parseFloat(element.value.toFixed(2))
        element.flag = "C"


        return element;


    }


    AlgorithmCreator.prototype.changePerCapFoodUse = function (elementList, array) {

        var result;
        var idFoodUse = elementList["foodUse"]
        var idPopulation = elementList["population"]

        if (array[idPopulation].value != "") {
            result = (this.checkIfNull(array[idFoodUse].value) * 1000000) / this.checkIfNull(array[idPopulation].value)
            result = parseFloat(result.toFixed(2))
        }
        return result;

    }



    AlgorithmCreator.prototype.listOfUpdateActions = function(forecast){


    }


    return AlgorithmCreator;

})