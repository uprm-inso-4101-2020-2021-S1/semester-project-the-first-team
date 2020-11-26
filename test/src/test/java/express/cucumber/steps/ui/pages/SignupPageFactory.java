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

public class SignupPageFactory{
	
    private static Logger Log = Logger.getLogger(LoginPageFactory.class.getName());
    WebDriver driver;

	// Elements that identify page
	@FindBy(xpath = "//input[@name='first-name']")
    WebElement firstnameBox;

    @FindBy(xpath = "//input[@name='last-name']")
	WebElement lastnameBox;

	@FindBy(xpath = "//input[@name='email']")
    WebElement emailBox;

    @FindBy(xpath = "//input[@name='username']")
	WebElement userbox;

	@FindBy(xpath = "//input[@name='password']")
	WebElement passbox;
	
	@FindBy(xpath = "//button[@class='signup-submit-button btn btn-primary btn-lg']")
	WebElement signupButton;
	
	@FindBy(xpath = "//a[@class='signup-submit-button btn btn-primary btn-lg']")
	WebElement loginButton;
		
	
	// Steps
	public SignupPageFactory(WebDriver driver) {
		this.driver = driver;

		// Initialize web elements
		PageFactory.initElements(driver, this);
	}

	public void createAccount(String user, String pass, String first, String last, String email) {
		// Create WebDriver wait
	    WebDriverWait wait = new WebDriverWait(driver, Constants.DEFAULT_WEBELEMENT_TIMEOUT);
	    // Wait for signup elements to be present
		wait.until(ExpectedConditions.visibilityOf(userbox));
		firstnameBox.sendKeys(first);
		lastnameBox.sendKeys(last);
		emailBox.sendKeys(email);
		userbox.sendKeys(user);
		passbox.sendKeys(pass);
		signupButton.click();
	}

	public void login() {
		// Sleep to give chance for page to load
		try {
			Thread.sleep(Constants.QUICK_TIMEOUT);
		} catch (Exception e) {
			System.err.println("Error when sleeping");
		}
		// Create WebDriver wait
	    WebDriverWait wait = new WebDriverWait(driver, Constants.DEFAULT_WEBELEMENT_TIMEOUT);
		// Wait for URL to be present
		wait.until(ExpectedConditions.elementToBeClickable(loginButton));
		loginButton.click();
	}

	public boolean verifyLoggingIn() {
		// Sleep to give chance for page to load
		try {
			Thread.sleep(Constants.QUICK_TIMEOUT);
		} catch (Exception e) {
			System.err.println("Error when sleeping");
		}
		// Create WebDriver wait
	    WebDriverWait wait = new WebDriverWait(driver, Constants.DEFAULT_WEBELEMENT_TIMEOUT);
		// Wait for URL to be present
		try {
			wait.until(ExpectedConditions.urlContains("/login"));
		} catch (Exception e) {
			return false;
		}
		return true;
	}

	public boolean verifySignedup() {
		// Sleep to give chance for page to load
		try {
			Thread.sleep(Constants.QUICK_TIMEOUT);
		} catch (Exception e) {
			System.err.println("Error when sleeping");
		}
		// Create WebDriver wait
	    WebDriverWait wait = new WebDriverWait(driver, Constants.DEFAULT_WEBELEMENT_TIMEOUT);
		// Wait for URL to be present
		try {
			wait.until(ExpectedConditions.elementToBeClickable(loginButton));
		} catch (Exception e) {
			return false;
		}
		return true;
	}

	public boolean isLoaded() {
		// Sleep to give chance for page to load
		try {
			Thread.sleep(Constants.QUICK_TIMEOUT);
		} catch (Exception e) {
			System.err.println("Error when sleeping");
		}
		// Create WebDriver wait
	    WebDriverWait wait = new WebDriverWait(driver, Constants.DEFAULT_WEBELEMENT_TIMEOUT);
		// Wait for URL to be present
		try {
			wait.until(ExpectedConditions.urlContains("/sign-up"));
		} catch (Exception e) {
			return false;
		}
		return true;
	}

	

}