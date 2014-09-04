package org.fao.amis.dataset.dto;

public class DatasetUpdate {

    private DatasetFilter filter;

    private Object[][] data;

    public DatasetFilter getFilter() {
        return filter;
    }

    public void setFilter(DatasetFilter filter) {
        this.filter = filter;
    }

    public Object[][] getData() {
        return data;
    }

    public void setData(Object[][] data) {
        this.data = data;
    }
}
