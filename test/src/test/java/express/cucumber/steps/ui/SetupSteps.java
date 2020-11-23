package express.cucumber.steps.ui;

import java.awt.AWTException;
import java.awt.Robot;
import java.awt.Toolkit;
import java.awt.datatransfer.Clipboard;
import java.awt.datatransfer.StringSelection;
import java.awt.event.KeyEvent;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.PrintWriter;
import java.net.MalformedURLException;
import java.util.Calendar;
import java.util.Date;
import java.util.concurrent.TimeUnit;
import java.util.logging.Level;
import java.net.URL;
import java.rmi.UnexpectedException;
import java.text.SimpleDateFormat;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.logging.LogType;
import org.openqa.selenium.logging.LoggingPreferences;
import org.openqa.selenium.remote.RemoteWebDriver;
import org.openqa.selenium.remote.CapabilityType;
import org.openqa.selenium.remote.DesiredCapabilities;
import cucumber.api.java.After;
import cucumber.api.Scenario;
import cucumber.api.java.Before;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.apache.commons.io.FileUtils;
import org.openqa.selenium.logging.LogEntries;
import org.openqa.selenium.logging.LogEntry;
import org.openqa.selenium.Dimension;


public class SetupSteps {
	
	private static boolean localTest;
	
	/*Uncomment line bellow for production testing */
	// protected static WebDriver driver;
	
	/*Uncomment 2 lines bellow for local testing */
	public static WebDriver driver;
	private final String browser = "chrome"; 
		
	/**
	 * Setup browser's driver, page timeouts, page waits and pass the URL we are going to test to the driver.
	 * For production testing it gets env vars for the broser type, selenium hub name, and the apphost name.
	 * @throws MalformedURLException
	 * @throws InterruptedException
	 */
	@Before()
	public void setup() throws MalformedURLException, InterruptedException {
        // Verify that variables are correctly established
		if(System.getenv("EXPRESS_UI_URL")==null)
            throw new IllegalAccessError("Must specify EXPRESS_UI_URL");
        
        // Verify if we are testing locally or with Selenium Hub
		if (System.getenv("SELENIUM_HUB_URL")==null){
			System.out.println("Testing Locally");
			localTest=true;
		}
		else {
			System.out.println("Testing on Hub");
			localTest=false;
        }
        
		System.out.println("Setting up selenium");
		StringBuilder url=new StringBuilder(System.getenv("EXPRESS_UI_URL"));
		if(localTest) {
			/* for local testing */
			URL localChrome=new URL("http://localhost:9515");
			driver = new RemoteWebDriver(localChrome, DesiredCapabilities.chrome());
			driver.manage().window().setSize(new Dimension(1920,1080));
			driver.manage().timeouts().pageLoadTimeout(60, TimeUnit.SECONDS);
			driver.manage().timeouts().implicitlyWait(20, TimeUnit.SECONDS);
            driver.get(url.toString());
		} else {
			/* for hub testing */
			String seleniumHubURL = System.getenv("SELENIUM_HUB_URL");
            DesiredCapabilities dc;
            // Set all logs we can get
			LoggingPreferences logs = new LoggingPreferences();
			logs.enable(LogType.BROWSER, Level.ALL);
			logs.enable(LogType.CLIENT, Level.ALL);
			logs.enable(LogType.DRIVER, Level.ALL);
			logs.enable(LogType.PERFORMANCE, Level.ALL);
			logs.enable(LogType.PROFILER, Level.ALL);
            logs.enable(LogType.SERVER, Level.ALL);
            // Set capabilities to be chrome
            dc = DesiredCapabilities.chrome();
            dc.setBrowserName("chrome");
			dc.setCapability(CapabilityType.LOGGING_PREFS, logs);
            dc.setCapability (CapabilityType.ACCEPT_SSL_CERTS, true);
            // Set hub
			driver = new RemoteWebDriver(new URL(seleniumHubURL), dc);
			driver.manage().window();//.maximize();
			driver.manage().timeouts().pageLoadTimeout(60, TimeUnit.SECONDS);
			driver.manage().timeouts().implicitlyWait(30, TimeUnit.SECONDS);
			driver.get(url.toString());
			driver.manage().window().setSize(new Dimension(1920,1080));
		}
		System.out.println("Finished Set up");
	}
	
	public static WebDriver getWebDriver(){
		return driver;
	}
	
	@After
	public void tearDown(Scenario scenario) {
		try{
			if(scenario.isFailed()){
				if(!localTest) {
					String timeStamp = new SimpleDateFormat("yyyy-MM-dd_HH-mm-ss").format(Calendar.getInstance().getTime());
					try {
						LogEntries logs = driver.manage().logs().get(LogType.BROWSER);
						FileWriter fw = new FileWriter("/output/reports/logs.txt", true);
					    BufferedWriter bw = new BufferedWriter(fw);
					    PrintWriter out = new PrintWriter(bw);
					    out.println("Error for "+browser+" at "+timeStamp);
						out.println("Browser Logs");
						for (LogEntry entry : logs) {
							out.println(new Date(entry.getTimestamp()) + " " + entry.getLevel() + " " + entry.getMessage());
							} 
						logs = driver.manage().logs().get(LogType.SERVER);
						out.println("Server Logs");
						for (LogEntry entry : logs) {
							out.println(new Date(entry.getTimestamp()) + " " + entry.getLevel() + " " + entry.getMessage());
							} 
						out.println();
						out.println("-------------------------------------------------------------------------------------");
						out.println("-------------------------------------------------------------------------------------");
						out.close();
					} catch (Exception e) {
						System.out.println("Couldnt get logs for failure");
					}
					try {
						File screenshotFile = ((TakesScreenshot)driver).getScreenshotAs(OutputType.FILE);
						String browser=((RemoteWebDriver) driver).getCapabilities().getBrowserName();
						FileUtils.copyFile(screenshotFile, new File("/output/reports/"+browser+"error"+timeStamp+".png"));
					} catch (Exception e) {
						System.out.println("Couldnt get screenshot for failure");
					}
				}
			}
		}catch(Exception e){
            // Print exception to debug
			e.printStackTrace();
		}finally{
			// Quit the driver after each test
			if(driver != null)
				driver.quit();
		}
	}

}