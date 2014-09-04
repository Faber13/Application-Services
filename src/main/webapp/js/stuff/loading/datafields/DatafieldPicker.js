/**
 * Created by fabrizio on 5/27/14.
 */
define(["jquery", "loading/datafields/monthly/MonthSelector", "loading/datafields/population/PopulationPicker", "loading/datafields/fields/FieldsPicker"],
    function ($, MonthSelector, PopulationPicker, FieldsPicker) {


        var months, monthSelector, forecast, populationPicker, fieldsPicker, fields, configurator;

        function DatafieldPicker() {

            monthSelector = new MonthSelector;
            fieldsPicker = new FieldsPicker;
            populationPicker = new PopulationPicker;

        }


        DatafieldPicker.prototype.init = function (preloadingData, configurations) {
            configurator = configurations;
            months = monthSelector.init(preloadingData);
            if (months.monthsForCurrentYear.length > 1) {
                alert("+++++++++++MONTHS++++++++++++++")
            }
            fields = fieldsPicker.init(months, preloadingData, configurator)
            this.addPopulationToYearsForecast(preloadingData);

            console.log("_______________POPULATION__________________________")
            console.log(fields)

            this.prepareData();

            console.log("_______________Sorted array__________________________")
            console.log(fields)

            return fields;
        }

        /**
         *
         */
        DatafieldPicker.prototype.prepareData = function () {

            if ($.isEmptyObject(fields.prevYearFields))
                fields.prevYearFields = this.cleanForecasts(fields.prevYearFields)
            fields.prevYearFields = this.sortAndReplace(fields.prevYearFields);

            // if currentYear is composed by more than a forecast
            if (Object.prototype.toString.call(fields.currentYearFields[0]) === '[object Array]') {

                // clean and add at the end of the currentYear the attributes month, monthPosition and lastUpdate
                for (var i = 0; i < fields.currentYearFields.length; i++) {
                    fields.currentYearFields[i] = this.cleanForecasts(fields.currentYearFields[i])
                    fields.currentYearFields[i] = this.sortAndReplace(fields.currentYearFields[i]);
                    fields.currentYearFields[i]["month"] = months.monthsForCurrentYear[i].month;
                    fields.currentYearFields[i]["monthPosition"] = months.monthsForCurrentYear[i].monthPosition;

                    fields.currentYearFields[i]["lastUpdate"] = function () {
                        var lastUpdate;
                        for (var j = 3; j < 20; i++) {
                            // DEPENDENCY from json list (the number 3)
                            // take the first lastUpdate from the fields, starting from fields number 3
                            if (fields.currentYearFields[i][j].lastUpdate != "") {
                                lastUpdate = fields.currentYearFields[i][j].lastUpdate;
                                break;
                            }
                        }
                        return lastUpdate;
                    }()
                }
            }
            else {

                // if there is only a forecast ( it means that there's only a month)
                fields.currentYearFields = this.cleanForecasts(fields.currentYearFields);
                fields.currentYearFields = this.sortAndReplace(fields.currentYearFields)
                fields.currentYearFields["month"] = months.monthsForCurrentYear[0].month;
                fields.currentYearFields["monthPosition"] = months.monthsForCurrentYear[0].monthPosition;
                fields.currentYearFields["lastUpdate"] = function () {
                    var lastUpdate;
                    for (var j = 3; j < 20; j++) {
                        if (fields.currentYearFields[j].lastUpdate != "") {
                            var arrayDate = fields.currentYearFields[j].lastUpdate.split("-");
                            lastUpdate = arrayDate[2] + "-" + arrayDate[1] + "-" + arrayDate[0];
                            break;
                        }
                    }
                    return lastUpdate;
                }()
            }
        }


        DatafieldPicker.prototype.addPopulationToYearsForecast = function (preloadingData) {
            // PreviousYear
            var populationObject = configurator[0];
            if (months.bestMonthOfPreviousYear != null) {
                fields.prevYearFields = populationPicker.init(fields.prevYearFields, preloadingData, true, populationObject)
            } // ELSE: just ready!

            if (fields.currentYearFields.length > 1) {
                for (var i = 0; i < fields.currentYearFields.length; i++) {
                    fields.currentYearFields[i] = populationPicker.init(fields.currentYearFields[i], preloadingData, false, populationObject);
                }
            }
            else {
                fields.currentYearFields = populationPicker.init(fields.currentYearFields[0], preloadingData, false, populationObject);
            }
        }


        /**
         * Function used to clean the forecast fields from duplicates (for the data)
         * @param array
         * @returns {Array cleaned}
         */
        DatafieldPicker.prototype.cleanForecasts = function (array) {

            // Start with previous year
            for (var i = 0; i < array.length - 1; i++) {
                var j = i + 1;
                if (array[i].elementCode == array[j].elementCode) {
                    var arrayDataI = array[i].lastUpdate.split("-")
                    var dateI = new Date(arrayDataI)
                    var arrayDataJ = array[j].lastUpdate.split("-")
                    var dateJ = new Date(arrayDataJ)

                    // between two dates, it takes the oldest one
                    if (dateI.getTime() - dateJ.getTime() < 0) {
                        array.splice(i, 1)
                    } else {
                        array.splice(j, 1)
                    }

                }
            }
            return array;
        }


        DatafieldPicker.prototype.sortAndReplace = function (forecast) {

            var sortedArray = [];


            console.log(configurator);

            for (var i = 0; i < configurator.length; i++) {

                // Unbalanced case or Of Which Governemtn case, add the fields
                if (configurator[i].elementCode == -1) {
                    var field = {
                        elementCode: configurator[i].elementCode,
                        elementName: configurator[i].elementName,
                        flag: "C",
                        units: "",
                        value: "",
                        lastUpdate: ""
                    }
                    sortedArray.push(field)
                }

                else if (configurator[i].elementCode == -2) {
                    var field = {
                        elementCode: configurator[i].elementCode,
                        elementName: configurator[i].elementName,
                        flag: "C",
                        units: configurator[i].units,
                        value: "",
                        lastUpdate: ""
                    }
                    sortedArray.push(field)
                }

                // Other fields
                else {
                    for (var j = 0; j < forecast.length; j++) {

                        // When a field exist into the json list of elements
                        if (configurator[i].elementCode == forecast[j].elementCode) {
                            // Only two decimal
                            if (forecast[j].value != "") {
                                forecast[j].value = parseFloat(forecast[j].value.toFixed(2))
                            }
                            sortedArray.push(forecast[j])
                            break;
                        }

                        // When a field NOT exist into the json list of elements and the list is finished
                        else if (configurator[i].elementCode != forecast[j].elementCode
                            && j == forecast.length - 1) {
                            var field = {
                                elementCode: configurator[i].elementCode,
                                elementName: configurator[i].elementName,
                                flag: "",
                                units: configurator[i].units,
                                value: "",
                                lastUpdate: ""
                            }
                            sortedArray.push(field)
                            break;
                        }
                    }
                }
            }
            return sortedArray;
        }

        return DatafieldPicker;
    });


