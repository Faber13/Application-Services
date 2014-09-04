/**
 * Created by fabrizio on 6/13/14.
 */
define(["jquery", "jqwidgets"],function ($) {


    var configuration, grid;


    function TableCreator(){}



    TableCreator.prototype.init = function(parameter){

        var prefixConfigJson = "/js/stuff/loading/table/file/properties.json"

        var model = parameter;

        configuration = this.getConfig(prefixConfigJson)
        var data = new Array();



        var source =
        {
            localdata: model.data,
            datatype: "array"
        };
        var dataAdapter = new $.jqx.dataAdapter(source, {
            loadComplete: function (data) {
            },
            loadError: function (xhr, status, error) {
                alert("Error: Status is " + status + " and the error is" + error)
            }
        });


        grid = $("#jqxgrid")
        grid.jqxGrid(
            {
                selectionmode: 'singlecell',
                source: dataAdapter,
                pageable: true,
                autoheight: true,
                columns: function () {
                    var result = [
                        { text: 'Id', datafield: 'Id', width: 35
                            },
                        { text: 'Elements', datafield: 'Elements', width: 230 },
                        { text: 'PreviousYear', datafield: 'PreviousYear', width: 100 ,cellsformat: 'F2'},
                        { text: 'Flag', datafield: 'flag', width: 35 }
                    ]

                    for (var i = 4; i < model.columnProperties.length - 1; i = i + 2) {
                        var column = {
                            text: function () {
                                var result;
                                if (model.columnProperties[i].substring(0, 9) != "undefined") {
                                    result = model.columnProperties[i].substring(0, 10)
                                }
                                else {
                                    result = "";
                                }
                                return result
                        }(), datafield: model.columnProperties[i], width: 100 , cellsformat: 'F2'}
                        result.push(column);
                        var flag = { text: "Flag", datafield:  model.columnProperties[i + 1], width: 35  }
                        result.push(flag);
                    }
                    return result;
                }()
            });
        $("#jqxcheckbox").jqxCheckBox({ width: 120, height: 25 });






        this.onClickButton()
/*

        var rowid = $('#jqxgrid').jqxGrid('getrows');
        console.log("----------------------------------------------")
        console.log(column);
        console.log("----------------------------------------------")

       // console.log(this.inverseTranslateModel(grid));

        console.log(dataAdapter)


        $("#jqxgrid").jqxGrid('begincelledit', 1, 'Id');


*/
        return grid;

    }



    TableCreator.prototype.getTable = function (){


    }



    TableCreator.prototype.getConfig = function(url){

    var configuration;
        $.ajax({
            async: false,
            type: 'GET',
            url: url,
            success: function (data) {
                configuration = data;
            }
        })

        return configuration;
    }



    TableCreator.prototype.onClickButton = function () {
        $("#jqxcheckbox").bind('change', function (event) {
            if (event.args.checked) {
                $("#jqxgrid").jqxGrid('hidecolumn', 'PreviousYear');
                $("#jqxgrid").jqxGrid('hidecolumn', 'flag');
            }else{
                $("#jqxgrid").jqxGrid('showcolumn', 'PreviousYear');
                $("#jqxgrid").jqxGrid('showcolumn', 'flag');
            }
        });
    }



    return TableCreator;

    })