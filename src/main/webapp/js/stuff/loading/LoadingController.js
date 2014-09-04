/**
 * Created by fabrizio on 5/20/14.
 */
define(["jquery", "loading/datafields/DatafieldPicker", "loading/table/TableModel",
        "loading/table/TableCreator", "loading/table/AlgorithmCreator",
        "loading/configuration/Configurator"],
    function($, DataField,TableModel, TableCreator, AlgorithmCreator, Configurator) {

    var datafield, tableModel, configurator, tableCreator,algorithm, grid;

    function LoadingController(){}


    LoadingController.prototype.init = function(preloadingData){
        configurator = new Configurator;
        var configuration = configurator.init()
        console.log(configuration)

        datafield = new DataField;
        var forecasts = datafield.init(preloadingData, configuration);

        console.log("LOADING")

        tableModel = new TableModel;
        algorithm = new AlgorithmCreator
        tableCreator = new TableCreator;

        return this.createOrUpdate(forecasts)


    }


    LoadingController.prototype.createOrUpdate = function(forecasts){

        var forecastCalculated = algorithm.init(forecasts)

        console.log("==================================================================")
        console.log(forecastCalculated)

        var model = tableModel.init(forecastCalculated)
         grid = tableCreator.init(model)
        return grid

    }


    LoadingController.prototype.getTableModel  = function(){
        return tableModel;
    }


    LoadingController.prototype.getActionToDo = function(indexRow , columnDatafield, newValue){

        var configuration;
        $.ajax({
            async: false,
            type: 'GET',
            url: url,
            success: function (data) {
                configuration = data;
            }
        });
        for(var i = 0; i< configuration.editableFields.length; i++){
            if(configuration.editableFields[i].id == indexRow+1){
                switch(i) {
                    case 0:
                        this.onChangeClosingStock(indexRow , columnDatafield, newValue)
                        break;
                    case 1:
                        break;
                    case 2:
                        this.onChangeImportsNMY()
                        break;
                    case 3:
                        this.onChangeFoodUse()
                        break;
                    case 4:
                        this.onChangeFeedUse()
                        break;
                    case 5:
                        break;
                    case 6:
                        this.onChangeExportsNMY()
                        break;
                    case 7:
                        break;
                }

            }
        }
    }



    LoadingController.prototype.onChangeClosingStock = function(indexRow , columnDatafield, newValue){


        var totalUtilization = jqxGrid('getcellvalue', 0, "columndatafield");




    }


    LoadingController.prototype.onChangeImportsNMY = function(){


    }


    LoadingController.prototype.onChangeExportsNMY = function(){




    }


    LoadingController.prototype.onChangeFeedUse = function(){


    }


    LoadingController.prototype.onChangeFoodUse = function(){


    }









        return LoadingController;
    });