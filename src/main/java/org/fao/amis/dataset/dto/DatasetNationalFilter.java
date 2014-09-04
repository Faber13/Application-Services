package org.fao.amis.dataset.dto;

/**
 * Created by fabrizio on 9/2/14.
 */
public class DatasetNationalFilter {

    private Integer region, element, year;

    public Integer getRegion() {
        return region;
    }

    public void setRegion(Integer region) {
        this.region = region;
    }

    public Integer getElement() {
        return element;
    }

    public void setElement(Integer element) {
        this.element = element;
    }

    public Integer getYear() {
        return year;
    }

    public void setYear(Integer year) {
        this.year = year;
    }
}
