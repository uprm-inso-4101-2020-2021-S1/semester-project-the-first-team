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

public class RestAPIStepsDefinition {

	// Routes for rest api
	private final String userSignupPath="/user/signup";
	private final String userGetPath="/user";
	
	// URI for backend
	private String url = System.getenv("REST_API_URL");

	// Used for testing
	private Client client;
	private String credentials;
	private WebTarget target;
	// Initial number of users in db
	private int testStartUserNumber = 4;

	@Given("^Rest API is up and running and the user logs in as (.*) and (.*)$")
	public void rest_API_is_up_and_running_and_the_user_logs_in_as_and(String user, String pass) throws Throwable {
		if(url==null)
			url=System.getenv("REST_API_URL");
		// Disable SSL cert check
		SSLContext sslcontext = SSLContext.getInstance("TLS");
		sslcontext.init(null, new TrustManager[]{new X509TrustManager() {
			public void checkClientTrusted(X509Certificate[] arg0, String arg1) throws CertificateException {}
			public void checkServerTrusted(X509Certificate[] arg0, String arg1) throws CertificateException {}
			public X509Certificate[] getAcceptedIssuers() { return new X509Certificate[0]; }
		}}, new java.security.SecureRandom());
		client = ClientBuilder.newBuilder()
			.sslContext(sslcontext)
			.hostnameVerifier((s1, s2) -> true)
			.build();
		credentials=user+":"+pass;
		credentials=Base64.getEncoder().encodeToString(credentials.getBytes());
		target=client.target(url);
    }

	@When("^Manager adds stylist credentials as (.*)$")
	public void manager_adds_stylist_credentials_as(String stylistJsonData) throws Throwable {
		ObjectMapper mapper = new ObjectMapper();
		WebTarget localTarget = target.path(userSignupPath);
		Response resp = localTarget
			.request(MediaType.APPLICATION_JSON)
			.accept(MediaType.APPLICATION_JSON)
			.header(HttpHeaders.AUTHORIZATION, "Basic "+credentials)
			.post(Entity.entity(stylistJsonData, MediaType.APPLICATION_JSON),Response.class);
		Assert.assertTrue(resp.getStatus()==201);
    }

	@Then("^the stylist (.*) should be created and added to the database$")
	public void the_stylist_should_be_created_and_added_to_the_database(String stylistJsonData) throws Throwable {
		ObjectMapper mapper = new ObjectMapper();
		String pk = Integer.toString(++testStartUserNumber);
		WebTarget localTarget = target.path(userGetPath+"/"+pk);
		Response resp = localTarget
			.request(MediaType.APPLICATION_JSON)
			.accept(MediaType.APPLICATION_JSON)
			.header(HttpHeaders.AUTHORIZATION, "Basic "+credentials).get();
		Assert.assertTrue(resp.getStatus()==200);
		HashMap<String, String> received = resp.readEntity(new GenericType<HashMap<String, String>>() { });
		HashMap<String,String> expected=mapper.readValue(stylistJsonData, new TypeReference<Map<String, String>>(){});
		client.close();
		// Put expected next key created
		expected.put("pk", pk);
		// Remove unexpected things from data
		expected.remove("password");
		Assert.assertTrue(expected.equals(received));
    }

}