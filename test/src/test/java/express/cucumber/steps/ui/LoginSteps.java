package express.cucumber.steps.ui;

import org.junit.Assert;

import express.cucumber.steps.ui.pages.LoginPageFactory;
import express.cucumber.steps.ui.pages.StylistPageFactory;

import cucumber.api.PendingException;
import cucumber.api.java.en.Given;
import cucumber.api.java.en.Then;
import cucumber.api.java.en.When;

public class LoginSteps {

    LoginPageFactory loginPage;
    StylistPageFactory stylistPage;

    @Given("^The user goes to the UI website$")
    public void the_user_goes_to_the_UI_website() throws Throwable {
        loginPage = new LoginPageFactory(SetupSteps.getWebDriver());
    }

    @When("^The user logins as (.*) and (.*)$")
    public void the_user_logins_as(String user, String pass) throws Throwable {
        loginPage.login(user, pass);
    }

    @Then("^The user should see the stylists page$")
    public void the_user_should_see_the_stylists_page() throws Throwable {
        stylistPage = new StylistPageFactory(SetupSteps.getWebDriver());
        Assert.assertTrue(stylistPage.verifyLoaded());
    }

}