package express.cucumber.steps.restApi;

import java.io.StringReader;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

import org.junit.Assert;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import javax.json.Json;
import javax.json.JsonObject;
import javax.json.JsonReader;
import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.client.Entity;
import javax.ws.rs.client.WebTarget;
import javax.ws.rs.core.GenericType;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import java.security.cert.CertificateException; 
import java.security.cert.X509Certificate; 
import javax.net.ssl.SSLContext; 
import javax.net.ssl.TrustManager; 
import javax.net.ssl.X509TrustManager; 

import cucumber.api.PendingException;
import cucumber.api.java.en.Given;
import cucumber.api.java.en.Then;
import cucumber.api.java.en.When;
import express.cucumber.steps.restApi.RestAPICommonSteps;

public class RestAPIServiceSteps {

	// Routes for service rest api
	private final String servicePath="/service";

	// Initial number of objects in db
	private int testStartServiceNumber = 0;
	
	@When("^Manager adds the new service (.*)$")
	public void manager_adds_the_new_service(String serviceData) throws Throwable {
		ObjectMapper mapper = new ObjectMapper();
		WebTarget localTarget = RestAPICommonSteps.target.path(servicePath);
		Response resp = localTarget
			.request(MediaType.APPLICATION_JSON)
			.accept(MediaType.APPLICATION_JSON)
			.header(HttpHeaders.AUTHORIZATION, "Basic "+RestAPICommonSteps.credentials)
			.post(Entity.entity(serviceData, MediaType.APPLICATION_JSON),Response.class);
		Assert.assertTrue(resp.getStatus()==201);
	}
	
	@Then("^the service (.*) should be created and added to the database$")
	public void the_service_should_be_created_and_added_to_the_database(String serviceData) throws Throwable {
		ObjectMapper mapper = new ObjectMapper();
		String pk = Integer.toString(++testStartServiceNumber);
		WebTarget localTarget = RestAPICommonSteps.target.path(servicePath+"/"+pk);
		Response resp = localTarget
			.request(MediaType.APPLICATION_JSON)
			.accept(MediaType.APPLICATION_JSON)
			.header(HttpHeaders.AUTHORIZATION, "Basic "+RestAPICommonSteps.credentials).get();
		Assert.assertTrue(resp.getStatus()==200);
		HashMap<String, String> received = resp.readEntity(new GenericType<HashMap<String, String>>() { });
		HashMap<String,String> expected=mapper.readValue(serviceData, new TypeReference<Map<String, String>>(){});
		RestAPICommonSteps.client.close();
		// Put expected next key created
		expected.put("pk", pk);
		Assert.assertTrue(expected.equals(received));
    }
    
    @Then("^Adding the new service (.*) should fail$")
    public void adding_the_new_service_should_fail(String serviceData) throws Throwable {
		WebTarget localTarget = RestAPICommonSteps.target.path(servicePath);
		Response resp = localTarget
			.request(MediaType.APPLICATION_JSON)
			.accept(MediaType.APPLICATION_JSON)
			.header(HttpHeaders.AUTHORIZATION, "Basic "+RestAPICommonSteps.credentials)
			.post(Entity.entity(serviceData, MediaType.APPLICATION_JSON),Response.class);
        Assert.assertTrue(resp.getStatus()==403);
    }

}