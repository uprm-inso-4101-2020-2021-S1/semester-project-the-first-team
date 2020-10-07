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

    @Given("^Rest API is up and running and the user logs in as manager (.*) and (.*)$")
    public void rest_API_is_up_and_running_and_the_user_logs_in_as_manager_admin_and_admin(String user, String pass) throws Throwable {
        // Write code here that turns the phrase above into concrete actions
        throw new PendingException();
    }
    
    @When("^Manager adds stylist credentials as (.*)$")
    public void manager_adds_stylist_credentials_as(String stylistJsonData) throws Throwable {
        // Write code here that turns the phrase above into concrete actions
        throw new PendingException();
    }
    
    @Then("^the stylist should be created and added to the database$")
    public void the_stylist_should_be_created_and_added_to_the_database() throws Throwable {
        // Write code here that turns the phrase above into concrete actions
        throw new PendingException();
    }

}