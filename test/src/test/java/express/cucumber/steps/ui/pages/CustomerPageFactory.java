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

	@FindBy(xpath = "//a[@data-rb-event-key='/customers/home']")
	WebElement homeTab;

	@FindBy(xpath = "//a[@data-rb-event-key='/customers/reservations']")
    WebElement reservationTab;

	@FindBy(xpath = "//a[@class='logout']")
	WebElement logoutButton;

	private class HomePage{

		@FindBy(xpath = "//span[@class='service-list']")
		WebElement services;

		@FindBy(xpath = "//span[@class='stylist-name']")
		WebElement stylist;

		public HomePage() {
			// Initialize web elements
			PageFactory.initElements(driver, this);
		}

	}

	private class ReserveServicesPage{
		
		@FindBy(xpath = "//*[local-name()='svg' and @class='svg-inline--fa fa-arrow-right fa-w-14 next-arrow']")
		WebElement rightArrow;

		@FindBy(xpath = "//form")
		WebElement servicesContainer;

		String servicePartialXpath = "//*[@class='stretched-link service-content'";

		public ReserveServicesPage() {
			// Initialize web elements
			PageFactory.initElements(driver, this);
		}

	}

	private class ReserveStylistsPage{

		@FindBy(xpath = "//*[local-name()='svg' and @class='svg-inline--fa fa-arrow-left fa-w-14 prev-arrow']")
		WebElement leftArrow;
		
		@FindBy(xpath = "//*[local-name()='svg' and @class='svg-inline--fa fa-arrow-right fa-w-14 next-arrow']")
		WebElement rightArrow;

		@FindBy(xpath = "//form")
		WebElement stylistsContainer;

		String stylistPartialXpath = "//*[@class='stretched-link stylist-content'";

		public ReserveStylistsPage() {
			// Initialize web elements
			PageFactory.initElements(driver, this);
		}

	}

	private class ReserveTimePage{

		@FindBy(xpath = "//*[local-name()='svg' and @class='svg-inline--fa fa-arrow-left fa-w-14 prev-arrow']")
		WebElement leftArrow;
		
		@FindBy(xpath = "//*[local-name()='svg' and @class='svg-inline--fa fa-arrow-right fa-w-14 next-arrow']")
		WebElement rightArrow;

		@FindBy(xpath = "//form")
		WebElement confirmTimeContainer;

		String confirmTimePartialXpath = "//*[@class='stretched-link time-slot-link'";

		public ReserveTimePage() {
			// Initialize web elements
			PageFactory.initElements(driver, this);
		}

	}

	private class ReserveReviewPage{

		@FindBy(xpath = "//*[local-name()='svg' and @class='svg-inline--fa fa-arrow-left fa-w-14 prev-arrow']")
		WebElement leftArrow;

		@FindBy(xpath = "//div[@class='stylist-entry']")
		WebElement stylistContainer;

		@FindBy(xpath = "//div[@class='service-entry']")
		WebElement serviceContainer;

		@FindBy(xpath = "//button[@class='submit-button btn btn-primary btn-lg']")
		WebElement reserveButton;

		String stylistPartialXpath = "//div[@class='stylist-entry']//span[@class='entry-name'";
		String servicePartialXpath = "//div[@class='summary-service-list']//span[@class='entry-name'";

		public ReserveReviewPage() {
			// Initialize web elements
			PageFactory.initElements(driver, this);
		}

	}

	private class ReserveReturnPage{

		@FindBy(xpath = "//*[@class='stretched-link home-link']")
		WebElement returnHome;

		@FindBy(xpath = "//h3[contains(.,'Thank You!')]")
		WebElement thankYouHeader;

		public ReserveReturnPage() {
			// Initialize web elements
			PageFactory.initElements(driver, this);
		}

	}
	
	private enum SIDEBAR_TABS {
		home("home"),
		reservation("reservation");

		private final String tab;

		SIDEBAR_TABS(String tab) {
			this.tab = tab;
		}

		public static SIDEBAR_TABS validateTab(String tab) throws EnumConstantNotPresentException{
			switch(tab){
				case "home":
				return home;
				case "reservation":
				return reservation;
				default:
					throw new EnumConstantNotPresentException(SIDEBAR_TABS.class, "Invalid tab passed");
			}
		}
		
		public String getTab() {
			return this.tab;
		}
	}

	private enum VIEWS {
		home("home"),
		reserveStylist("reserveStylist"),
		reserveService("reserveService"),
		reserveCreate("reserveCreate"),
		reserveConfirm("reserveConfirm"),
		reservation("reservation");

		private final String view;

		VIEWS(String view) {
			this.view = view;
		}

		public static VIEWS validateView(String view) throws EnumConstantNotPresentException{
			switch(view){
				case "home":
				return home;
				case "reserveStylist":
				return reserveStylist;
				case "reserveService":
				return reserveService;
				case "reserveCreate":
				return reserveCreate;
				case "reserveConfirm":
				return reserveConfirm;
				case "reservation":
				return reservation;
				default:
					throw new EnumConstantNotPresentException(VIEWS.class, "Invalid view passed");
			}
		}
		
		public String getView() {
			return this.view;
		}
	}
		
	
	// Steps
	public CustomerPageFactory(WebDriver driver) {
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
			wait.until(ExpectedConditions.urlContains("/customers"));
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
			case home:
				// Wait for URL to be present
				try {
					wait.until(ExpectedConditions.urlContains("/customers/home"));
				} catch (Exception e) {
					return false;
				}
			break;
			case reservation:
				// Wait for URL to be present
				try {
					wait.until(ExpectedConditions.urlContains("/customers/reservations"));
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
			case home:
				wait.until(ExpectedConditions.elementToBeClickable(sidebar));
				sidebar.click();
				wait.until(ExpectedConditions.elementToBeClickable(homeTab));
				homeTab.click();
			break;
			case reservation:
				wait.until(ExpectedConditions.elementToBeClickable(sidebar));
				sidebar.click();
				wait.until(ExpectedConditions.elementToBeClickable(reservationTab));
				reservationTab.click();
			break;
		}
	}

	public void chooseServices(String[] services){
		ReserveServicesPage page = new ReserveServicesPage();
		// Create WebDriver wait
	    WebDriverWait wait = new WebDriverWait(driver, Constants.DEFAULT_WEBELEMENT_TIMEOUT);
		for(int i = 0; i<services.length;i++){
			StringBuilder constructedXpath = new StringBuilder(page.servicePartialXpath);
			constructedXpath.append("and contains(.,'");
			constructedXpath.append(services[i]);
			constructedXpath.append("')]");
			WebElement service = page.servicesContainer.findElement(By.xpath(constructedXpath.toString()));
			wait.until(ExpectedConditions.elementToBeClickable(service));
			service.click();
		}
		wait.until(ExpectedConditions.elementToBeClickable(page.rightArrow));
		page.rightArrow.click();
	}

	public void chooseStylist(String name){
		ReserveStylistsPage page = new ReserveStylistsPage();
		// Create WebDriver wait
	    WebDriverWait wait = new WebDriverWait(driver, Constants.DEFAULT_WEBELEMENT_TIMEOUT);
		StringBuilder constructedXpath = new StringBuilder(page.stylistPartialXpath);
		constructedXpath.append("and contains(.,'");
		constructedXpath.append(name);
		constructedXpath.append("')]");
		WebElement stylist = page.stylistsContainer.findElement(By.xpath(constructedXpath.toString()));
		wait.until(ExpectedConditions.elementToBeClickable(stylist));
		stylist.click();
		wait.until(ExpectedConditions.elementToBeClickable(page.rightArrow));
		page.rightArrow.click();
	}

	public void chooseTime(String stylist){
		ReserveTimePage page = new ReserveTimePage();
		StringBuilder timeXpath = new StringBuilder(page.confirmTimePartialXpath);
		timeXpath.append(" and contains(.,'");
		timeXpath.append(stylist);
		timeXpath.append("')]");
		WebElement time = page.confirmTimeContainer.findElement(By.xpath(timeXpath.toString()));
		WebDriverWait wait = new WebDriverWait(driver, Constants.DEFAULT_WEBELEMENT_TIMEOUT);
		wait.until(ExpectedConditions.elementToBeClickable(time));
		time.click();
		wait.until(ExpectedConditions.elementToBeClickable(page.rightArrow));
		page.rightArrow.click();
	}

	public void confirmReservation(String stylist, String[] services){
		ReserveReviewPage page = new ReserveReviewPage();
		StringBuilder stylistXpath = new StringBuilder(page.stylistPartialXpath);
		stylistXpath.append(" and contains(.,'");
		stylistXpath.append(stylist);
		stylistXpath.append("')]");
		WebElement stylistElement = page.stylistContainer.findElement(By.xpath(stylistXpath.toString()));
		WebDriverWait wait = new WebDriverWait(driver, Constants.DEFAULT_WEBELEMENT_TIMEOUT);
		wait.until(ExpectedConditions.visibilityOf(stylistElement));
		for(int i=0;i<services.length;i++){
			StringBuilder serviceXpath = new StringBuilder(page.servicePartialXpath);
			serviceXpath.append(" and contains(.,'");
			serviceXpath.append(services[i]);
			serviceXpath.append("')]");
			WebElement service = page.serviceContainer.findElement(By.xpath(serviceXpath.toString()));
			wait.until(ExpectedConditions.visibilityOf(service));
		}
		wait.until(ExpectedConditions.elementToBeClickable(page.reserveButton));
		page.reserveButton.click();
	}

	public void returnFromConfirmation(){
		ReserveReturnPage page = new ReserveReturnPage();
		WebDriverWait wait = new WebDriverWait(driver, Constants.DEFAULT_WEBELEMENT_TIMEOUT);
		wait.until(ExpectedConditions.visibilityOf(page.thankYouHeader));
		wait.until(ExpectedConditions.elementToBeClickable(page.returnHome));
		page.returnHome.click();
	}

	public boolean verifyReservationExists(String stylist, String[] services){
		HomePage page = new HomePage();
		// Create WebDriver wait
	    WebDriverWait wait = new WebDriverWait(driver, Constants.DEFAULT_WEBELEMENT_TIMEOUT);
		// Wait for user to be present
		try {
			wait.until(ExpectedConditions.visibilityOf(page.stylist));
			if(!page.stylist.getText().equals(stylist))
				return false;
			wait.until(ExpectedConditions.visibilityOf(page.services));
			String servicesInPage = page.services.getText();
			for(int i=0;i<services.length;i++){
				if(!servicesInPage.contains(services[i]))
					return false;
			}
		} catch (Exception e) {
			return false;
		}
		return true;
	}

}