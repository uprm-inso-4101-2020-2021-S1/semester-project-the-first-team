package express.cucumber.steps.ui.pages;

import java.util.logging.Logger;

import express.cucumber.common.Constants;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;

import org.junit.Assert;

public class LoginPageFactory{
	
    private static Logger Log = Logger.getLogger(LoginPageFactory.class.getName());
    WebDriver driver;

	// Elements that identify page
	@FindBy(id = "formUsername")
    WebElement userbox;

    @FindBy(id = "formPassword")
	WebElement passbox;
	
	@FindBy(xpath = "//button[contains(.,'Log')]")
    WebElement loginButton;
		
	
	// Steps
	public LoginPageFactory(WebDriver driver) {
		this.driver = driver;

		// Initialize web elements
		PageFactory.initElements(driver, this);
	}

	public void login(String user, String pass) {
		// Create WebDriver wait
	    WebDriverWait wait = new WebDriverWait(driver, Constants.DEFAULT_WEBELEMENT_TIMEOUT);
	    // Wait for login to be present
		wait.until(ExpectedConditions.visibilityOf(userbox));
		userbox.sendKeys(user);
		passbox.sendKeys(pass);
		loginButton.click();
	}

	

}