package org.fao.amis.dataset.dao;

import java.sql.*;
import java.util.*;

import org.fao.amis.dataset.dto.DatasetFilterWithDate;
import org.fao.amis.dataset.dto.DateFilter;
import org.fao.amis.dataset.dto.FilterDatabase;
import org.fao.amis.dataset.dto.FilterYear;
import org.fao.amis.server.tools.jdbc.ConnectionManager;
import org.fao.amis.server.tools.utils.DatabaseUtils;
import org.fao.amis.server.tools.utils.DatasourceObject;
import org.fao.amis.server.tools.utils.YearObject;

import javax.inject.Inject;

@SuppressWarnings("JpaQueryApiInspection")
public class FilterData {
    @Inject private DatabaseUtils utils;
    @Inject private ConnectionManager connectionManager;

    private static String queryDatabase = "select distinct database from national_forecast where region_code =? and database is not null";
    private static String queryYears    = "select distinct season, year from national_forecast where region_code = ? and product_code = ?  and season is not null and year is not null order by year DESC";


    public DatasourceObject  getDatabase (FilterDatabase filter) throws Exception {
        Connection connection = connectionManager.getConnection();
        PreparedStatement statement = connection.prepareStatement(queryDatabase);
        statement.setInt(1,filter.getRegionCode());
        return utils.getDataSource(statement.executeQuery());
    }


    public ArrayList<YearObject> getYears (FilterYear filter) throws Exception {
         Connection connection = connectionManager.getConnection();
         PreparedStatement statement = connection.prepareStatement(queryYears);
         statement.setInt(1,filter.getRegionCode());
         statement.setInt(2,filter.getProductCode());
         return utils.getYear(statement.executeQuery());
    }
}
