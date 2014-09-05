/**
 * Created by fabrizio on 5/21/14555
 */
define(["jquery", "jqwidgets"], function($) {

    var  radioNationDB,radioCBS, selectedDB, source;

    function DatabaseSelector(){

        radioNationDB = $("#jqxradiobuttonNationalDB");
        radioCBS =      $("#jqxradiobuttonCBS");
       // $("#labelCBS").html("CBS");

    }


    DatabaseSelector.prototype.changeRadio = function(regionCode){
        //var url = "http://localhost:8081/wds/rest/amis/cbsmonthly/AMISCBS/databases/"+regionCode;
        var url  = "http://168.202.28.178:8080/dataset/datasource"
        var that = this;

        $.ajax({
            async: false,
            type: 'post',
            url: url,
            success: function(data) {
                // prepare the data
                 source =
                {
                    datatype: "json",
                    datafields: [
                        { name: 'datasource'},
                    ],
                    localdata: data
                };

                //callback
                $("#labelNatDB").html(data['datasource']);

            }
        });
        radioNationDB.jqxRadioButton({ width: 120, height: 25, checked: true});
    }


    DatabaseSelector.prototype.init = function(regionCode){

        var url = "http://168.202.28.178:8080/dataset/datasource"+regionCode;
        selectedDB = $("#labelCBS").text();
        var that = this;
        $.ajax({
            async: false,
            type: 'GET',
            url: url,
            success: function(data) {
               source = that.prepareBoxData(data)
                //callback
                $("#labelNatDB").html(data['title']);
            }
        });

        //radioCBS.jqxRadioButton({ width: 120, height: 25 });
        radioNationDB.jqxRadioButton({
            width: 120,
            height: 25,
             checked : true
        });
        return selectedDB;
    }


    DatabaseSelector.prototype.selectCBS = function(event){
        return $("#labelCBS").text();
    }


    DatabaseSelector.prototype.selectNational = function(event){
        console.log("SELECT NATIONAL: "+source.localdata.datasource);
        return source.localdata.datasource;
    }


    DatabaseSelector.prototype.getCBS = function() {
        return radioCBS;
    }


    DatabaseSelector.prototype.getNatDb = function() {
        return radioNationDB;

    }


    DatabaseSelector.prototype.prepareBoxData = function(data){

        // prepare the data
        var source =
        {
            datatype: "json",
            datafields: [
                { name: 'yearLabel'},
                { name: 'year' }
            ],
            localdata: data
        };
        return source;
    }

    return DatabaseSelector;

});