package express.cucumber.steps.restApi.users;

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

public class RestAPIUserSteps {

	// Routes for user rest api
	private final String userSignupPath="/user/signup";
	private final String userPath="/user";

	// Initial number of objects in db
	private int testStartUserNumber = 4;

	@When("^Manager adds stylist credentials as (.*)$")
	public void manager_adds_stylist_credentials_as(String stylistJsonData) throws Throwable {
		ObjectMapper mapper = new ObjectMapper();
		WebTarget localTarget = RestAPICommonSteps.target.path(userSignupPath);
		Response resp = localTarget
			.request(MediaType.APPLICATION_JSON)
			.accept(MediaType.APPLICATION_JSON)
			.header(HttpHeaders.AUTHORIZATION, "Basic "+RestAPICommonSteps.credentials)
			.post(Entity.entity(stylistJsonData, MediaType.APPLICATION_JSON),Response.class);
		Assert.assertTrue(resp.getStatus()==201);
	}

	@Then("^the stylist (.*) should be created and added to the database$")
	public void the_stylist_should_be_created_and_added_to_the_database(String stylistJsonData) throws Throwable {
		ObjectMapper mapper = new ObjectMapper();
		String pk = Integer.toString(++testStartUserNumber);
		WebTarget localTarget = RestAPICommonSteps.target.path(userPath+"/"+pk);
		Response resp = localTarget
			.request(MediaType.APPLICATION_JSON)
			.accept(MediaType.APPLICATION_JSON)
			.header(HttpHeaders.AUTHORIZATION, "Basic "+RestAPICommonSteps.credentials).get();
		Assert.assertTrue(resp.getStatus()==200);
		HashMap<String, String> received = resp.readEntity(new GenericType<HashMap<String, String>>() { });
		HashMap<String,String> expected=mapper.readValue(stylistJsonData, new TypeReference<Map<String, String>>(){});
		RestAPICommonSteps.client.close();
		// Put expected next key created
		expected.put("pk", pk);
		// Remove unexpected things from data
		expected.remove("password");
		Assert.assertTrue(expected.equals(received));
    }
    
    @Then("^Adding the new stylist (.*) should fail$")
    public void adding_the_new_stylist_should_fail(String stylistData) throws Throwable {
        WebTarget localTarget = RestAPICommonSteps.target.path(userSignupPath);
		Response resp = localTarget
			.request(MediaType.APPLICATION_JSON)
			.accept(MediaType.APPLICATION_JSON)
			.header(HttpHeaders.AUTHORIZATION, "Basic "+RestAPICommonSteps.credentials)
            .post(Entity.entity(stylistData, MediaType.APPLICATION_JSON),Response.class);
        int stat = resp.getStatus();
        System.out.println(stat);
        Assert.assertTrue(stat==403);
    }
	
}