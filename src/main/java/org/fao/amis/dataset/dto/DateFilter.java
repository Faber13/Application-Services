package org.fao.amis.dataset.dto;

public class DateFilter {

    private Integer region;
    private Integer product;
    private Integer year;

    public Integer getProduct() {
        return product;
    }

    public void setProduct(Integer product) {
        this.product = product;
    }

    public Integer getRegion() {
        return region;
    }

    public void setRegion(Integer region) {
        this.region = region;
    }

    public Integer getYear() {
        return year;
    }

    public void setYear(Integer year) {  this.year = year;}
}
