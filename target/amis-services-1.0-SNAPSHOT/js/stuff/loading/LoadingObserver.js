/**
 * Created by fabrizio on 5/27/14.
 */
define(["jquery", "loading/LoadingController"],function($, LoadingController){

    var controller, preloadingData;


    function LoadingObserver(){
        controller = new LoadingController;

    }


    LoadingObserver.prototype.init = function(data){
        preloadingData = data;
        var configuration;
        $.ajax({
            async: false,
            type: 'GET',
            url: "/js/stuff/loading/table/file/properties.json",
            success: function (data) {
                configuration = data;
            }
        });
        var grid = controller.init(preloadingData)

        grid.bind("cellclick", function (event)  {
            console.log("Cell EDITTT")
            var columnDataField = event.args.column.datafield;
            var rowindex = event.args.rowindex;
            var columnindex = event.args.columnindex;

            var isEditable = function(){
                var result = false;
                for(var i  = 0; i< configuration.editableFields.length && !result; i++){
                    if (rowindex +1  == configuration.editableFields[i].id){
                        result = true;
                    }
                }
                return result;
            }();
            if(columnDataField.substring(0,4) != "flag" && columnDataField != "Id"&& columnDataField != "Elements" && isEditable){
                grid.jqxGrid('begincelledit', rowindex, columnDataField);

                grid.on('cellendedit', function (event) {
                    if(event.args.oldvalue != event.args.value) {

                        var columnDatafield = event.args.datafield;
                        var rowindex = event.args.rowindex;
                        var newValue = event.args.newvalue;
                        var oldvalue = event.args.oldvalue;
                        var rowid = grid.jqxGrid('getrows');
                        console.log(rowid[17])
                        controller.getActionToDo(rowindex,columnDatafield,newValue  )

                    }


                });

            }
        });


    }


    return LoadingObserver;


})