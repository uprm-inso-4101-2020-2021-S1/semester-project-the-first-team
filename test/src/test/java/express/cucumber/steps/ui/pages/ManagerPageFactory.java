package express.cucumber.steps.ui.pages;

import java.util.logging.Logger;
import java.util.List;
import express.cucumber.common.Constants;

import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;

import org.junit.Assert;

public class ManagerPageFactory{
	
    private static Logger Log = Logger.getLogger(StylistPageFactory.class.getName());
    WebDriver driver;

	// Elements that identify page
	@FindBy(xpath = "//a[@class='menu-bars']")
	WebElement sidebar;

	@FindBy(xpath = "//a[@class='logout']")
	WebElement logoutButton;
	
	@FindBy(xpath = "//a[@data-rb-event-key='/stylists/userlist']")
	WebElement userTab;

	@FindBy(xpath = "//a[@data-rb-event-key='/stylists/schedule']")
    WebElement viewScheduleTab;
	
	@FindBy(xpath = "//a[@data-rb-event-key='/stylists/schedule/manage']")
	WebElement manageScheduleTab;
	
	@FindBy(xpath = "//a[@data-rb-event-key='/stylists/manageservices']")
	WebElement manageServiceTab;

	private class UserPage{

		// User tab components
		@FindBy(xpath = "//button[@class='btn btn-primary']")
		WebElement createUser;

		@FindBy(xpath = "//input[@name='first_name']")
		WebElement firstnameBox;

		@FindBy(xpath = "//input[@name='last_name']")
		WebElement lastnameBox;

		@FindBy(xpath = "//input[@name='email']")
		WebElement emailBox;

		@FindBy(xpath = "//input[@name='username']")
		WebElement userbox;

		@FindBy(xpath = "//input[@name='password']")
		WebElement passbox;

		@FindBy(xpath = "//input[@name='role']")
		WebElement rolebox;
		
		@FindBy(xpath = "//div[@class='modal-footer']//button[@class='btn btn-primary']")
		WebElement submitButton;

		@FindBy(xpath = "//div[@class='usr-card-body']")
		WebElement userCards;

		public UserPage() {
			// Initialize web elements
			PageFactory.initElements(driver, this);
		}

	}

	private class ManageSchedulePage{

		// User tab components
		@FindBy(xpath = "//div[@class='rbc-day-slot rbc-time-column rbc-now rbc-today']")
		WebElement todaysDate;

		@FindBy(xpath = "//div[@class='rbc-current-time-indicator']")
		WebElement currentTime;
		
		@FindBy(xpath = "//select[@name='stylist']")
		WebElement stylistDropdown;

		@FindBy(xpath = "//button[@type='submit']")
		WebElement submitButton;

		public ManageSchedulePage() {
			// Initialize web elements
			PageFactory.initElements(driver, this);
		}

	}

	private class ViewSchedulePage{

		// User tab components
		@FindBy(xpath = "//div[@class='rbc-day-slot rbc-time-column rbc-now rbc-today']")
		WebElement todaysDate;

		@FindBy(xpath = "//div[@class='rbc-current-time-indicator']")
		WebElement currentTime;
		
		@FindBy(xpath = "//button[@class='dropdown-toggle btn btn-primary']")
		WebElement stylistDropdown;

		@FindBy(xpath = "//button[contains(.,'Week')]")
		WebElement weekButton;

		public ViewSchedulePage() {
			// Initialize web elements
			PageFactory.initElements(driver, this);
		}

	}

	
	private enum SIDEBAR_TABS {
		users("users"),
		manageSchedule("manage schedule"),
		viewSchedule("view schedule"),
		manageServices("manage services");

		private final String tab;

		SIDEBAR_TABS(String tab) {
			this.tab = tab;
		}

		public static SIDEBAR_TABS validateTab(String tab) throws EnumConstantNotPresentException{
			switch(tab){
				case "users":
				return users;
				case "manage schedule":
				return manageSchedule;
				case "view schedule":
				return viewSchedule;
				case "manage services":
				return manageServices;
				default:
					throw new EnumConstantNotPresentException(SIDEBAR_TABS.class, "Invalid tab passed");
			}
		}
		
		public String getTab() {
			return this.tab;
		}
	}

	public static enum ROLES {
		Manager("0"),
		Stylist("1"),
		Customer("2"),
		Admin("3");

		private final String role;

		private ROLES(String role) {
			this.role = role;
		}

		public static ROLES validateRole(String role) throws EnumConstantNotPresentException{
			switch(role){
				case "0":
				return Manager;
				case "1":
				return Stylist;
				case "2":
				return Customer;
				case "3":
				return Admin;
				default:
					throw new EnumConstantNotPresentException(ROLES.class, "Invalid role passed");
			}
		}
		
		public String getRole() {
			return this.role;
		}
	}
	
	// Steps
	public ManagerPageFactory(WebDriver driver) {
		this.driver = driver;

		// Initialize web elements
		PageFactory.initElements(driver, this);
	}

	public void logout(){
		// Create WebDriver wait
	    WebDriverWait wait = new WebDriverWait(driver, Constants.DEFAULT_WEBELEMENT_TIMEOUT);
		wait.until(ExpectedConditions.elementToBeClickable(sidebar));
		sidebar.click();
		wait.until(ExpectedConditions.elementToBeClickable(logoutButton));
		logoutButton.click();
	}

	public boolean verifyLogout(){
		// Create WebDriver wait
	    WebDriverWait wait = new WebDriverWait(driver, Constants.QUICK_WEBELEMENT_TIMEOUT);
		// Wait for URL to be present
		try {
			wait.until(ExpectedConditions.urlContains("/login"));
		} catch (Exception e) {
			return false;
		}
		return true;
	}

	public boolean isLoaded() {
		// Create WebDriver wait
	    WebDriverWait wait = new WebDriverWait(driver, Constants.DEFAULT_WEBELEMENT_TIMEOUT);
		// Wait for URL to be present
		try {
			wait.until(ExpectedConditions.urlContains("/stylists"));
			wait.until(ExpectedConditions.elementToBeClickable(sidebar));
		} catch (Exception e) {
			return false;
		}
		return true;
	}

	public boolean verifyLoaded(String tabPassed){
		SIDEBAR_TABS tab;
		try {
			tab = SIDEBAR_TABS.validateTab(tabPassed);
		} catch (Exception e) {
			System.err.println("Invalid tab passed");
			throw e;
		}
		// Create WebDriver wait
	    WebDriverWait wait = new WebDriverWait(driver, Constants.DEFAULT_WEBELEMENT_TIMEOUT);
		switch(tab){
			case users:
				// Wait for URL to be present
				try {
					wait.until(ExpectedConditions.urlContains("/stylists/userlist"));
				} catch (Exception e) {
					return false;
				}
			break;
			case manageSchedule:
				// Wait for URL to be present
				try {
					wait.until(ExpectedConditions.urlContains("/stylists/schedule/manage"));
				} catch (Exception e) {
					return false;
				}
			break;
			case viewSchedule:
				// Wait for URL to be present
				try {
					wait.until(ExpectedConditions.urlContains("/stylists/schedule"));
				} catch (Exception e) {
					return false;
				}
			break;
			case manageServices:
				// Wait for URL to be present
				try {
					wait.until(ExpectedConditions.urlContains("/stylists/manageservices"));
				} catch (Exception e) {
					return false;
				}
			break;
		}
		return true;
	}

	public void clickTab(String tabPassed){
		SIDEBAR_TABS tab;
		try {
			tab = SIDEBAR_TABS.validateTab(tabPassed);
		} catch (Exception e) {
			System.err.println("Invalid tab passed");
			throw e;
		}
		// Create WebDriver wait
	    WebDriverWait wait = new WebDriverWait(driver, Constants.DEFAULT_WEBELEMENT_TIMEOUT);
		switch(tab){
			case users:
				wait.until(ExpectedConditions.elementToBeClickable(sidebar));
				sidebar.click();
				wait.until(ExpectedConditions.elementToBeClickable(userTab));
				userTab.click();
			break;
			case manageSchedule:
				wait.until(ExpectedConditions.elementToBeClickable(sidebar));
				sidebar.click();
				wait.until(ExpectedConditions.elementToBeClickable(manageScheduleTab));
				manageScheduleTab.click();
			break;
			case viewSchedule:
				wait.until(ExpectedConditions.elementToBeClickable(sidebar));
				sidebar.click();
				wait.until(ExpectedConditions.elementToBeClickable(viewScheduleTab));
				viewScheduleTab.click();
			break;
			case manageServices:
				wait.until(ExpectedConditions.elementToBeClickable(sidebar));
				sidebar.click();
				wait.until(ExpectedConditions.elementToBeClickable(manageServiceTab));
				manageServiceTab.click();
			break;
		}
	}

	public void createAccount(String user, String pass, String first, String last, String email, String role) {
		String roleChosen;
		try {
			roleChosen = ROLES.validateRole(role).getRole();
		} catch (Exception e) {
			System.err.println("Invalid role passed");
			throw e;
		}
		UserPage page = new UserPage();
		// Create WebDriver wait
	    WebDriverWait wait = new WebDriverWait(driver, Constants.DEFAULT_WEBELEMENT_TIMEOUT);
	    // Wait for signup elements to be present
		wait.until(ExpectedConditions.elementToBeClickable(page.createUser));
		page.createUser.click();
		wait.until(ExpectedConditions.visibilityOf(page.userbox));
		page.firstnameBox.sendKeys(first);
		page.lastnameBox.sendKeys(last);
		page.emailBox.sendKeys(email);
		page.userbox.sendKeys(user);
		page.passbox.sendKeys(pass);
		page.rolebox.clear();
		page.rolebox.sendKeys(roleChosen);
		wait.until(ExpectedConditions.elementToBeClickable(page.submitButton));
		page.submitButton.click();
	}

	public boolean verifyUserExists(String first, String last, String email, String role){
		StringBuilder constructedXpath = new StringBuilder();
		constructedXpath.append("//*[contains(.,'");
		constructedXpath.append(first + " " + last);
		constructedXpath.append("') and contains(.,'");
		switch(ROLES.validateRole(role)){
			case Manager:
				constructedXpath.append("Manager");
				break;
			case Stylist:
				constructedXpath.append("Stylist");
				break;
			case Customer:
				constructedXpath.append("Customer");
				break;
			case Admin:
				constructedXpath.append("Admin");
				break;
		}
		constructedXpath.append("') and contains(.,'");
		constructedXpath.append(email);
		constructedXpath.append("')]");
		UserPage page = new UserPage();
		System.out.println(constructedXpath.toString());
		WebElement user = page.userCards.findElement(By.xpath(constructedXpath.toString()));
		// Create WebDriver wait
	    WebDriverWait wait = new WebDriverWait(driver, Constants.DEFAULT_WEBELEMENT_TIMEOUT);
		// Wait for user to be present
		try {
			wait.until(ExpectedConditions.visibilityOf(user));
		} catch (Exception e) {
			return false;
		}
		return true;
	}

	public boolean verifyUserJustCreated(){
		// Create WebDriver wait
	    WebDriverWait wait = new WebDriverWait(driver, Constants.QUICK_WEBELEMENT_TIMEOUT);
		// Wait for user to be present
		try {
			wait.until(ExpectedConditions.alertIsPresent());
		} catch (org.openqa.selenium.TimeoutException e1) {
			return true;
		} catch (Exception e2){
			e2.printStackTrace();
			return false;
		}
		return false;
	}

	public void createSchedule(String name){ // There are 48 time slot elements in each calendar day so we will get the array and arrange it as we must
		// Create schedule for the entire day
		ManageSchedulePage page = new ManageSchedulePage();
		WebDriverWait wait = new WebDriverWait(driver, Constants.DEFAULT_WEBELEMENT_TIMEOUT);
		// Wait for todays date to be present
		wait.until(ExpectedConditions.elementToBeClickable(page.todaysDate));
		List<WebElement> timeslots = page.todaysDate.findElements(By.xpath("//div[@class='rbc-day-slot rbc-time-column rbc-now rbc-today']//div[@class='rbc-time-slot']"));
		Actions action = new Actions(driver);
		action.moveToElement(timeslots.get(0))
			.clickAndHold()
			.moveToElement(timeslots.get(timeslots.size()-1))
			.release()
			.perform();
		wait.until(ExpectedConditions.elementToBeClickable(page.stylistDropdown));
		page.stylistDropdown.click();
		StringBuilder stylistElement = new StringBuilder();
		stylistElement.append("//option[contains(.,'");
		stylistElement.append(name);
		stylistElement.append("')]");
		WebElement stylist = page.stylistDropdown.findElement(By.xpath(stylistElement.toString()));
		wait.until(ExpectedConditions.elementToBeClickable(stylist));
		stylist.click();
		wait.until(ExpectedConditions.elementToBeClickable(page.submitButton));
		page.submitButton.click();
	}

	public boolean verifyScheduleCreated(String name){
		ManageSchedulePage page = new ManageSchedulePage();
		WebDriverWait wait = new WebDriverWait(driver, Constants.DEFAULT_WEBELEMENT_TIMEOUT);
		StringBuilder schedule = new StringBuilder();
		schedule.append("//div[@class='rbc-event' and contains(.,'");
		schedule.append(name);
		schedule.append("')]");
		WebElement scheduleElement = page.todaysDate.findElement(By.xpath(schedule.toString()));
		// Wait for schedule to be present
		try {
			wait.until(ExpectedConditions.visibilityOf(scheduleElement));
		} catch (Exception e) {
			return false;
		}
		return true;
	}

	public boolean seeUserScheduleCreated(String name){
		this.clickTab(SIDEBAR_TABS.viewSchedule.getTab());
		ViewSchedulePage page = new ViewSchedulePage();
		WebDriverWait wait = new WebDriverWait(driver, Constants.DEFAULT_WEBELEMENT_TIMEOUT);
		wait.until(ExpectedConditions.elementToBeClickable(page.stylistDropdown));
		page.stylistDropdown.click();
		StringBuilder stylist = new StringBuilder();
		stylist.append("//a[@class='dropdown-item' and contains(.,'");
		stylist.append(name);
		stylist.append("')]");
		WebElement stylistElement = page.stylistDropdown.findElement(By.xpath(stylist.toString()));
		wait.until(ExpectedConditions.elementToBeClickable(stylistElement));
		stylistElement.click();
		wait.until(ExpectedConditions.elementToBeClickable(page.weekButton));
		page.weekButton.click();
		StringBuilder schedule = new StringBuilder();
		schedule.append("//div[@class='rbc-event' and contains(.,'");
		schedule.append(name);
		schedule.append("')]");
		WebElement scheduleElement = page.todaysDate.findElement(By.xpath(schedule.toString()));
		// Wait for schedule to be present
		try {
			wait.until(ExpectedConditions.visibilityOf(scheduleElement));
		} catch (Exception e) {
			return false;
		}
		return true;
	}

}