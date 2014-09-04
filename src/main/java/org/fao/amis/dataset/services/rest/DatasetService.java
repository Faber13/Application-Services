package org.fao.amis.dataset.services.rest;

import java.util.Iterator;

import javax.inject.Inject;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;

import org.fao.amis.dataset.dao.DatasetData;
import org.fao.amis.dataset.dao.SupportData;
import org.fao.amis.dataset.dto.*;

@Path("dataset")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)

public class DatasetService {
    @Inject private DatasetData dao;
    @Inject private SupportData dao2;


    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Path("national")
    public Iterator<Object[]> getData(DatasetFilter filter) throws Exception {
        return dao.getNationalData(filter);
    }

    @PUT
    @Path("national")
    public void getData(DatasetUpdate data) throws Exception {
        dao.updNationalData(data);
    }


    @POST
    @Path("population")
    public Iterator<Object[]> getData(DatasetNationalFilter filter) throws Exception {
        return dao.getPopulationData(filter);
    }


    @POST
    @Path("recentDate")
    public Iterator<Object[]> getData(DateFilter filter) throws Exception {
        return dao2.getMostRecentForecastDate(filter);
    }

    @POST
    @Path("previousYear")
    public Iterator<Object[]> getData(DatasetFilterWithDate filter) throws Exception {
        return dao2.getPreviousYearForecast(filter);
    }

}
