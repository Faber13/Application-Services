/**
 * Created by fabrizio on 6/9/14.
 */
define(["jquery"],function($){

    var configurator, amisCodeList, url, prefixJson;

    function Configurator(){};


    Configurator.prototype.init = function(){

         url = "http://faostat3.fao.org:7777/msd/cl/system/AMIS_ELEMENTS/1.0"
         prefixJson = "/js/stuff/loading/configuration/file/gridConfiguration"


        this.getJSONConfiguration(prefixJson);
        amisCodeList = this.getAmisElementsCodelist(url);

        return amisCodeList;
    }



    Configurator.prototype.getAmisElementsCodelist = function(url){

        var result = [];

        $.ajax({
            async: false,
            type: 'GET',
            url: url,
            success: function (data) {

                // Get the data and take the one of interest from the json file
                for (var i in configurator.fields) {
                    for (var j in data.rootCodes) {

                        if(configurator.fields[i].elementCode == "-1"){
                            var element = {
                                elementCode: configurator.fields[i].elementCode,
                                elementName: configurator.fields[i].elementName
                            }
                            result.push(element)
                            break;
                        }

                        else if(configurator.fields[i].elementCode == "-2"){
                            var element = {
                                elementCode: configurator.fields[i].elementCode,
                                elementName: configurator.fields[i].elementName,
                                units      : configurator.fields[i].units
                            }
                            result.push(element)
                            break;
                        }

                        else if(configurator.fields[i].elementCode == data.rootCodes[j].code) {

                            var element = {
                                elementCode: data.rootCodes[j].code,
                                elementName: data.rootCodes[j].title.EN,
                                units      : configurator.fields[i].units
                            }
                            result.push(element)
                            break;
                        }

                    }
                }
            }
        })

        return result


    }



    Configurator.prototype.getJSONConfiguration = function(prefixJson){

        var that = this;
        $.ajax({
            async: false,
            type: 'GET',
            url: prefixJson,
            success: function (data) {
                console.log("success")
                configurator = JSON.parse(data);
            }
        });

    }



    return Configurator;

})