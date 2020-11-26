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

public class CustomerPageFactory{
	
    private static Logger Log = Logger.getLogger(CustomerPageFactory.class.getName());
    WebDriver driver;

	// Elements that identify page
	@FindBy(xpath = "//a[@class='menu-bars']")
    WebElement sidebar;
		
	
	// Steps
	public CustomerPageFactory(WebDriver driver) {
		this.driver = driver;

		// Initialize web elements
		PageFactory.initElements(driver, this);
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
			wait.until(ExpectedConditions.urlContains("/customers"));
			wait.until(ExpectedConditions.elementToBeClickable(sidebar));
		} catch (Exception e) {
			return false;
		}
		return true;
	}

	

}