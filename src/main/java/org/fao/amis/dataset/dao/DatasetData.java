package org.fao.amis.dataset.dao;

import java.sql.*;
import java.util.*;

import org.fao.amis.dataset.dto.DatasetFilter;
import org.fao.amis.dataset.dto.DatasetNationalFilter;
import org.fao.amis.dataset.dto.DatasetUpdate;
import org.fao.amis.server.tools.jdbc.ConnectionManager;
import org.fao.amis.server.tools.utils.DatabaseUtils;

import javax.inject.Inject;

@SuppressWarnings("JpaQueryApiInspection")
public class DatasetData {
    @Inject private DatabaseUtils utils;
    @Inject private ConnectionManager connectionManager;

    private static String queryLoad = "select element_code, units, date, value, flag,  notes from national_forecast where region_code = ? and product_code = ? and year = ? and (value is not null or flag is not null)";
    private static String queryLoadNational = "select element_code, units, value, flag from national_population where region_code = ? and element_code = ? and year = ? and (value is not null)";
    private static String queryDelete = "delete from national_forecast where region_code = ? and product_code = ? and year = ?";
    private static String queryMostRecentDate = "select distinct date from national_forecast where region_code = ? and product_code = ? and year = ?";
    private static String queryDeleteNational = "delete from national_population where region_code = ? and product_code = ? and year = ?";
    private static String queryInsert = "insert into national_forecast(region_code, product_code, year, element_code, units, date, value, flag, notes) values (?,?,?,?,?,?,?,?,?)";
    private static int[]  queryInsertTypes = new int[] {Types.INTEGER,Types.INTEGER,Types.INTEGER,Types.INTEGER,Types.VARCHAR,Types.VARCHAR,Types.REAL,Types.VARCHAR,  Types.VARCHAR};

    public Iterator<Object[]> getNationalData (DatasetFilter filter) throws Exception {
        Connection connection = connectionManager.getConnection();
        PreparedStatement statement = connection.prepareStatement(queryLoad);

        statement.setInt(1,filter.getRegion());
        statement.setInt(2,filter.getProduct());
        statement.setInt(3, filter.getYear());

        return utils.getDataIterator(statement.executeQuery());
    }

    public Iterator<Object[]> getPopulationData (DatasetNationalFilter filter) throws Exception {
        Connection connection = connectionManager.getConnection();
        PreparedStatement statement = connection.prepareStatement(queryLoadNational);

        statement.setInt(1,filter.getRegion());
        statement.setInt(2,filter.getElement());
        statement.setInt(3, filter.getYear());

        return utils.getDataIterator(statement.executeQuery());
    }

    public void updNationalData (DatasetUpdate data) throws Exception {
        Connection connection = connectionManager.getConnection();
        try {
            connection.setAutoCommit(false);
            //Delete existing rows
            PreparedStatement statement = connection.prepareStatement(queryDelete);
            statement.setInt(1, data.getFilter().getRegion());
            statement.setInt(2, data.getFilter().getProduct());
            statement.setInt(3, data.getFilter().getYear());
            statement.executeUpdate();
            //Insert new rows
            if (data.getData()!=null) {
                statement = connection.prepareStatement(queryInsert);
                for (Object[] row : data.getData()) {
                    utils.fillStatement (statement, queryInsertTypes,
                            data.getFilter().getRegion(),
                            data.getFilter().getProduct(),
                            data.getFilter().getYear(),
                            row[0],row[1],row[2],row[3],row[4], row[5], row[6]);
                    statement.addBatch();
                }
                statement.executeBatch();
            }
            //Commit
            connection.commit();
        } catch (Exception ex) {
            connection.rollback();
            throw ex;
        } finally {
            connection.setAutoCommit(true);
        }
    }


    public Iterator<Object[]> getMostRecentForecastDate (DatasetFilter filter) throws Exception {
        Connection connection = connectionManager.getConnection();
        PreparedStatement statement = connection.prepareStatement(queryMostRecentDate);

        statement.setInt(1,filter.getRegion());
        statement.setInt(2,filter.getProduct());
        statement.setInt(3, filter.getYear());

        return utils.getDataIterator(statement.executeQuery());
    }

}
