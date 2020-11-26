package express.cucumber.steps.ui;

import org.junit.Assert;

import express.cucumber.steps.ui.pages.CustomerPageFactory;
import express.cucumber.steps.ui.pages.LoginPageFactory;
import express.cucumber.steps.ui.pages.ManagerPageFactory;
import express.cucumber.steps.ui.pages.SignupPageFactory;
import express.cucumber.steps.ui.pages.StylistPageFactory;

import cucumber.api.PendingException;
import cucumber.api.java.en.And;
import cucumber.api.java.en.Given;
import cucumber.api.java.en.Then;
import cucumber.api.java.en.When;

public class UISteps {

    CustomerPageFactory customerPage;
    LoginPageFactory loginPage;
    ManagerPageFactory managerPage;
    SignupPageFactory signupPage;
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

    @When("^The customer clicks to sign up$")
    public void the_customer_clicks_to_sign_up() throws Throwable {
        loginPage.signup();
        loginPage = null;
    }

    @And("^The customer is redirected to the signup page$")
    public void the_customer_is_redirected_to_the_signup_page() throws Throwable {
        signupPage = new SignupPageFactory(SetupSteps.getWebDriver());
        Assert.assertTrue(signupPage.isLoaded());
    }

    @And("^The manager sees the manager page$")
    public void the_manager_sees_the_manager_page() throws Throwable {
        managerPage = new ManagerPageFactory(SetupSteps.getWebDriver());
        Assert.assertTrue(managerPage.isLoaded());
    }


    @And("^The manager goes to the (.*) tab$")
    public void the_manager_goes_to_the_tab(String tab) throws Throwable {
        System.out.println(tab);
        managerPage.clickTab(tab);
        Assert.assertTrue(managerPage.verifyLoaded(tab));
    }

    @Then("^The manager should be able to create the stylist (.*) (.*) (.*) (.*) (.*)$")
    public void the_Manager_should_be_able_to_create_the_stylist(String user, String pass, String first, String last, String email) throws Throwable {
        managerPage.createAccount(user, pass, first, last, email, ManagerPageFactory.ROLES.Stylist.getRole());
        Assert.assertTrue(managerPage.verifyUserJustCreated());
    }

    @Then("^The manager should be able to see the stylist (.*) (.*) (.*)$")
    public void the_Manager_should_be_able_to_see_the_stylist(String first, String last, String email) throws Throwable {
        Assert.assertTrue(managerPage.verifyUserExists(first, last, email, ManagerPageFactory.ROLES.Stylist.getRole()));
    }

    @Then("^The manager should be able to see the customer (.*) (.*) (.*)$")
    public void the_Manager_should_be_able_to_see_the_customer(String first, String last, String email) throws Throwable {
        Assert.assertTrue(managerPage.verifyUserExists(first, last, email, ManagerPageFactory.ROLES.Customer.getRole()));
    }

    @Then("^The Manager should be able to create a schedule for the stylist (.*)$")
    public void the_Manager_should_be_able_to_create_a_schedule_for_the_stylist(String name) throws Throwable {
        managerPage.createSchedule(name);
        Assert.assertTrue(managerPage.verifyScheduleCreated(name));
    }

    @Then("^The Manager should be able to see the stylists (.*) schedule$")
    public void the_Manager_should_be_able_to_see_the_stylists_schedule(String name) throws Throwable {
        Assert.assertTrue(managerPage.seeUserScheduleCreated(name));
    }

    @Then("^The Manager should be able to logout$")
    public void the_Manager_should_be_able_to_logout() throws Throwable {
        managerPage.logout();
        Assert.assertTrue(managerPage.verifyLogout());
        managerPage = null;
    }



    @Then("^The customer should be able to sign up as (.*) (.*) (.*) (.*) (.*)$")
    public void the_customer_should_be_able_to_sign_up_as(String user, String pass, String first, String last, String email) throws Throwable {
        signupPage.createAccount(user, pass, first, last, email);
        Assert.assertTrue(signupPage.verifySignedup());
    }

    @Then("^The customer should be able to click on the login button$")
    public void the_customer_should_be_able_to_click_on_the_login_button() throws Throwable {
        signupPage.login();
        Assert.assertTrue(signupPage.verifyLoggingIn());
        signupPage = null;
    }

    @Then("^The customer should be able to log in as (.*) and (.*)$")
    public void the_customer_should_be_able_to_log_in_as(String user, String pass) throws Throwable {
        loginPage = new LoginPageFactory(SetupSteps.getWebDriver());
        loginPage.login(user, pass);
        loginPage = null;
        this.the_user_should_see_the_customers_page();
    }

    @Then("^The user should see the stylists page$")
    public void the_user_should_see_the_stylists_page() throws Throwable {
        stylistPage = new StylistPageFactory(SetupSteps.getWebDriver());
        try {
            Assert.assertTrue(stylistPage.isLoaded());
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
            Assert.assertTrue(customerPage.isLoaded());
        } catch (Exception e) {
            throw e;
        }finally{
            customerPage = null;
        }
    }

}