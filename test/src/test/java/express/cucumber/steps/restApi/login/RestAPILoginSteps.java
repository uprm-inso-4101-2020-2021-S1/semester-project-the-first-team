package express.cucumber.steps.restApi.login;

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

public class RestAPILoginSteps {

	// URI for backend
	private String url = System.getenv("REST_API_URI");

	// Used for testing
	public static Client client;
	public static String token;
	public static WebTarget target;

	// Routes for user rest api
	private final String userLoginPath="/api/user/login";
	// Routes for service rest api
	private final String servicePath="/api/service";

	// Initial number of objects in db
	private int testStartUserNumber = 4;

	@Given("^The user logs in with JWT (.*) and (.*)$")
	public void the_user_logs_in_with_JWT(String user, String pass) throws Throwable {
		if(url==null)
			url=System.getenv("REST_API_URI");
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
		target=client.target(url);
		WebTarget localTarget = target.path(userLoginPath);
		HashMap<String,String> json = new HashMap<String,String>();
		json.put("username", user);
		json.put("password", pass);
		Response resp = localTarget
			.request(MediaType.APPLICATION_JSON)
			.accept(MediaType.APPLICATION_JSON)
			.post(Entity.entity(json, MediaType.APPLICATION_JSON),Response.class);
		Assert.assertTrue(resp.getStatus()==200);
		HashMap<String, Object> jwtResponse = resp.readEntity(new GenericType<HashMap<String, Object>>() { });
		token = (String)jwtResponse.get("token");
	}

	@Then("^The user should be able to get the services in the system$")
	public void the_user_should_be_able_to_get_the_services_in_the_system() throws Throwable {
		ObjectMapper mapper = new ObjectMapper();
		WebTarget localTarget = target.path(servicePath);
		Response resp = localTarget
			.request(MediaType.APPLICATION_JSON)
			.accept(MediaType.APPLICATION_JSON)
			.header(HttpHeaders.AUTHORIZATION, "JWT "+token)
			.get();
		client.close();
		Assert.assertTrue(resp.getStatus()==200);
	}

}