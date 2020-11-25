package express.cucumber.steps.ui;

import org.junit.Assert;

import express.cucumber.steps.ui.pages.CustomerPageFactory;
import express.cucumber.steps.ui.pages.LoginPageFactory;
import express.cucumber.steps.ui.pages.StylistPageFactory;

import cucumber.api.PendingException;
import cucumber.api.java.en.Given;
import cucumber.api.java.en.Then;
import cucumber.api.java.en.When;

public class LoginSteps {

    CustomerPageFactory customerPage;
    LoginPageFactory loginPage;
    StylistPageFactory stylistPage;

    @Given("^The user goes to the UI website$")
    public void the_user_goes_to_the_UI_website() throws Throwable {
        loginPage = new LoginPageFactory(SetupSteps.getWebDriver());
    }

    @When("^The user logins as (.*) and (.*)$")
    public void the_user_logins_as(String user, String pass) throws Throwable {
        loginPage.login(user, pass);
        loginPage = null;
    }

    @Then("^The user should see the stylists page$")
    public void the_user_should_see_the_stylists_page() throws Throwable {
        stylistPage = new StylistPageFactory(SetupSteps.getWebDriver());
        try {
            Assert.assertTrue(stylistPage.verifyLoaded());
        } catch (Exception e) {
            throw e;
        }finally{
            stylistPage = null;
        }
    }

    @Then("^The user should see the customers page$")
    public void the_user_should_see_the_customers_page() throws Throwable {
        customerPage = new CustomerPageFactory(SetupSteps.getWebDriver());
        try {
            Assert.assertTrue(customerPage.verifyLoaded());
        } catch (Exception e) {
            throw e;
        }finally{
            customerPage = null;
        }
    }

}