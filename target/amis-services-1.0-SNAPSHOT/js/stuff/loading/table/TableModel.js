/**
 * Created by fabrizio on 6/3/14.
 */
define(["jquery", "loading/configuration/Configurator", "jqwidgets"],
    function ($, Configurator) {

        var configurator, forecasts, elementList, columnsProperties, model;


        function TableModel() {
            configurator = new Configurator;
        }


        TableModel.prototype.init = function (fields) {

            model = {};
            columnsProperties = new Array();
            forecasts = fields;
            elementList = configurator.init();


            model["data"] = this.translateModel(forecasts);
            model["columnProperties"] = columnsProperties;




            return model

        }


        TableModel.prototype.translateModel = function (forecasts) {

            var numberOfColumns = 4 + 2 * forecasts.currentYearFields.length;
            var data = new Array();
            var status = true;
            var firstTime = true;
            for (var i = 0; i < elementList.length; i++) {
                var rows = {}
                rows["Id"] = i + 1;

                switch (elementList[i].elementCode) {
                    case -1:
                        rows["Elements"] = elementList[i].elementName;
                        break;
                    default :
                        rows["Elements"] = elementList[i].elementName + "  (" + elementList[i].units + " )";
                }

                rows["PreviousYear"] = forecasts.prevYearFields[i].value;

                rows["flag"] = forecasts.prevYearFields[i].flag;

                if (firstTime) {
                    columnsProperties.push("Id")
                    columnsProperties.push("Elements")
                    columnsProperties.push("PreviousYear")
                    columnsProperties.push("flag")
                    firstTime = false;
                }


                if (Object.prototype.toString.call(forecasts.currentYearFields[0]) === '[object Array]') {
                    for (var j = 0; j < forecasts.currentYearFields.length; j++) {
                        if (status) {
                            columnsProperties.push(forecasts.currentYearFields[j].lastUpdate + "(" + j + ")");
                            columnsProperties.push("flag" + forecasts.currentYearFields[j].lastUpdate + "(" + j + ")")
                        }
                        rows[forecasts.currentYearFields[j].lastUpdate + "(" + j + ")"] = forecasts.currentYearFields[j][i].value;
                        rows["flag" + forecasts.currentYearFields[j].lastUpdate + "(" + j + ")"] = forecasts.currentYearFields[j][i].flag;
                        rows["ElementCode"] = forecasts.currentYearFields[j][i].elementCode;
                    }
                    status = false;
                    data[i] = rows;
                } else {

                    if (status) {
                        columnsProperties.push(forecasts.currentYearFields.lastUpdate + "(" + 0 + ")");
                        columnsProperties.push("flag" + forecasts.currentYearFields.lastUpdate + "(" + 0 + ")");
                        status = false;
                    }
                    rows[forecasts.currentYearFields.lastUpdate + "(" + 0 + ")"] = forecasts.currentYearFields[i].value;
                    rows["flag" + forecasts.currentYearFields.lastUpdate + "(" + 0 + ")"] = forecasts.currentYearFields[i].flag;
                    rows["ElementCode"] = forecasts.currentYearFields[i].elementCode;
                    data[i] = rows;
                }
            }
            return data;
        }


        TableModel.prototype.inverseTranslateModel = function (grid) {

            var oldModel = {};
            oldModel["previousYear"] = new Array();
            oldModel["currentYear"] = new Array();
            var model = grid.jqxGrid('getrows');
            var singletonFirst = true;
            console.log(model)


            for (var i = 0; i < model.length; i++) {
                var object = model[i];
                var keys = Object.keys(object);
                oldModel["previousYear"].push({
                    elementCode: elementList[i].elementCode,
                    flag: object.flag + "",
                    units: elementList[i].units,
                    value: object.PreviousYear
                })
                var firstKey = keys[0 + 4]

                if (keys.length <= 7) { // Only a current Year
                    oldModel["currentYear"].push({
                        elementCode: elementList[i].elementCode,
                        flag: object["flag" + firstKey],
                        units: elementList[i].units,
                        value: object[firstKey],
                        lastUpdate: firstKey.substring(0, 10)
                    })
                }
                else {          // More than a forecast of the current Year
                    var numbersOfForecastCurrYear = (keys.length - 5) / 2;   // coupled at structure of grid model
                    for (var j = 0; j < numbersOfForecastCurrYear; j++) {
                        var firstElemKey = keys[4 + 2 * j];
                        if (singletonFirst) {
                            oldModel["currentYear"][j] = new Array();
                        }
                        oldModel["currentYear"][j].push({
                            elementCode: elementList[i].elementCode,
                            flag: object["flag" + firstElemKey],
                            units: elementList[i].units,
                            value: object[firstElemKey],
                            lastUpdate: firstElemKey.substring(0, 10)
                        })
                    }
                    singletonFirst = false;

                }
            }
            return oldModel;
        }


        TableModel.prototype.getDatafieldColumnName = function (indexColumn) {

            return columnsProperties[indexColumn - 1];

        }


        TableModel.prototype.getCellValue = function (indexColumn, indexRow, model) {

            var datafieldName = this.getDatafieldColumnName(indexColumn);
            var result = model.records[indexRow - 1][datafieldName];

            return result;

        }


        TableModel.prototype.setCellValue = function (indexColumn, indexRow, newValue, model) {

            var datafieldName = this.getDatafieldColumnName(indexColumn);
            model.records[indexRow - 1][datafieldName] = newValue;

            return model;

        }


        TableModel.prototype.getRowElements = function (indexRow) {

        }



        return TableModel;

    });