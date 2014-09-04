/**
 * Created by fabrizio on 5/27/14.
 */
define(["jquery"],function($) {


    var monthUrl,monthsForCurrentYear,lastOfPreviousYear, result;


    function MonthSelector(){}


    MonthSelector.prototype.init = function(preloadingData){

        monthUrl  ="http://localhost:8081/wds/rest/amis/cbsmonthly/AMISCBS/months";
        this.listOfActions(monthUrl,preloadingData);
        result = this.returnListMonths(monthsForCurrentYear,lastOfPreviousYear);
        return result;
    }


    MonthSelector.prototype.listOfActions = function(url, data) {

        // Prepare the bean
        var postForMonths = this.prepareMonthData(data);

        monthsForCurrentYear = this.getListMonth(postForMonths.currentYearMonths);

        if (postForMonths.prevYearMonthsBean.year != -1) {
            var list = this.getListMonth(postForMonths.prevYearMonthsBean);
            lastOfPreviousYear = list[list.length - 1];
        } else{
            lastOfPreviousYear = null;
        }


    }

    MonthSelector.prototype.prepareMonthData = function(preloadingData){


        currYearMonthsBean = {
            regionCode :  preloadingData.post.regionCode,
            productCode:  preloadingData.post.productCode,
            year:         preloadingData.years.currentYear,
            yearLabel :   preloadingData.years.currentYearLabel,
            databaseText: preloadingData.post.databaseText,
            databaseValue: preloadingData.post.databaseValue

        }

        prevYearMonthsBean = {
            regionCode: preloadingData.post.regionCode,
            productCode: preloadingData.post.productCode,
            year: preloadingData.years.previousYear,
            yearLabel :   preloadingData.years.previousYearLabel,
            databaseText: preloadingData.post.databaseText,
            databaseValue: preloadingData.post.databaseValue

        }

        var postFormonths = {
            currentYearMonths: currYearMonthsBean,
            prevYearMonthsBean   : prevYearMonthsBean
        }

        return postFormonths;
    }


    MonthSelector.prototype.getListMonth = function(payload){
        var result
        var that = this;
        $.ajax({
            async: false,
            url: monthUrl,
            type: 'post',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify(payload),
            success : function(data){
                result = data;
            }
        });

        return result;
    }


    MonthSelector.prototype.returnListMonths = function(monthsForCurrentYear, bestPrevious){

        var result = {
            monthsForCurrentYear: monthsForCurrentYear,
            bestMonthOfPreviousYear   : bestPrevious
        }
        return result;
    }


    return MonthSelector;
});