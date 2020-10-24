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
import cucumber.api.java.en.And;
import cucumber.api.java.en.Given;
import cucumber.api.java.en.Then;
import cucumber.api.java.en.When;

public class RestAPICommonSteps {

	// URI for backend
	private String url = System.getenv("REST_API_URL");

	// Used for testing
	public static Client client;
	public static String credentials;
	public static WebTarget target;

	private void user_login(String user, String pass) throws Throwable {
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

	@Given("^Rest API is up and running and the user logs in as manager (.*) and (.*)$")
	public void rest_API_is_up_and_running_and_the_user_logs_in_as_manager(String user, String pass) throws Throwable {
		user_login(user, pass);
	}
	
	@Given("^Rest API is up and running and the user logs in as customer (.*) and (.*)$")
	public void rest_API_is_up_and_running_and_the_user_logs_in_as_customer(String user, String pass) throws Throwable {
		user_login(user, pass);
	}

	@Given("^Rest API is up and running and the user logs in as stylist (.*) and (.*)$")
	public void rest_API_is_up_and_running_and_the_user_logs_in_as_stylist(String user, String pass) throws Throwable {
		user_login(user, pass);
	}

}