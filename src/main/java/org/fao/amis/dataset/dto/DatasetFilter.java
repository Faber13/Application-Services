package org.fao.amis.dataset.dto;

public class DatasetFilter {

    private Integer region, product, year;

    public Integer getRegion() {
        return region;
    }

    public void setRegion(Integer region) {
        this.region = region;
    }

    public Integer getProduct() {
        return product;
    }

    public void setProduct(Integer product) {
        this.product = product;
    }

    public Integer getYear() {
        return year;
    }

    public void setYear(Integer year) {  this.year = year;}
}
