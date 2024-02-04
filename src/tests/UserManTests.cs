using NuGet.ContentModel;
using OpenQA.Selenium.DevTools.V105.Audits;

namespace tests;
using Microsoft.CodeAnalysis.FlowAnalysis;
using Xunit.Abstractions;
using OpenQA.Selenium;
using OpenQA.Selenium.Firefox;
using OpenQA.Selenium.Chrome;
using OpenQA.Selenium.DevTools.V107.CSS;
using OpenQA.Selenium.Remote;
using System.Runtime;
using System;
using System.Threading;
using System.Collections.Generic;
using Xunit;
using Xunit.Extensions.Ordering;
using System.ComponentModel;
using System.IO.Enumeration;
using System.Linq;



public class UserManTests : IDisposable
{

    private IWebDriver _driver;
    private ITestOutputHelper _output;

    public void Dispose()
    {
        _driver.Quit();
        _driver.Dispose();
    }

    // Constructor
    public UserManTests(ITestOutputHelper output)
    {
        ChromeOptions chrOpt = new ChromeOptions();
        chrOpt.AddArgument("--ignore-certificate-errors");
        chrOpt.AddArgument("--headless");
        chrOpt.AddArgument("--disable-ipv6");
        chrOpt.AddArgument("--log-level=0");
        chrOpt.AddArgument("--no-sandbox");
        chrOpt.AddArgument("--disable-dev-shm-usage");
        chrOpt.AcceptInsecureCertificates = true;
        _driver = new ChromeDriver(chrOpt);
        _output = output;
    }

    public static IEnumerable<object[]> TestUsersToLogin => new List<object[]>
    {
        new object[] { "LabbeLuring", "labbe1982@gmail.com", "Test12345." },
        new object[] { "InvincibleIvar", "ika@hotmail.no", "Test12345." },
        new object[] { "FireSteinar", "steinar.lauritz@live.no", "Test12345." },
        new object[] { "DesirableDragon", "per.oyvind@yahoo.com", "Test12345." },
    };

    public static IEnumerable<object[]> TestUsersToRegister => new List<object[]>
    {
        new object[] { "LabbeLuring", "labbe1982@gmail.com", "Test12345." },
        new object[] { "InvincibleIvar", "ika@hotmail.no", "Test12345." },
        new object[] { "FireSteinar", "steinar.lauritz@live.no", "Test12345." },
        new object[] { "DesirableDragon", "per.oyvind@yahoo.com", "Test12345." },
    };


    public static IEnumerable<object[]> TestUsersToNotRegister => new List<object[]>
    {
        new object[] { "DragonFire", "dannyboy@gmail.com", "Test12345." },
        new object[] { "KuleKaare", "kk1984@gmail.com", "Test12345." },
        new object[] { "LimitlessLeif", "leif.vangen@utmarka.no", "Test12345." },
        new object[] { "RetroReidar", "datafiks.grimstad@hotmail.no", "Test12345." },
    };
    

    // Tests //

    // Test for TC-1.1
    [Theory, Trait("Priority", "1")]
    [Trait("Category", "MyUnitTasting")]
    [MemberData(nameof(TestUsersToRegister))]
    public void RegisterUser(string nickname, string email, string password)
    {
        this._driver.Navigate().GoToUrl(TestData.siteAddress);

        Assert.Contains(TestData.homeTitleNotLoggedIn, _driver.Title);
        this._driver.FindElement(By.LinkText("Register")).Click();
        Assert.Contains("Register", _driver.Title);

        IWebElement nicknameInput = _driver.FindElement(By.Id("Input_Nickname"));
        IWebElement emailInput = _driver.FindElement(By.Id("Input_Email"));
        IWebElement passwordInput = _driver.FindElement(By.Id("Input_Password"));
        IWebElement confirmPasswordInput = _driver.FindElement(By.Id("Input_ConfirmPassword"));
        IWebElement submit = _driver.FindElement(By.Id("registerSubmit"));


        nicknameInput.SendKeys(nickname);
        emailInput.SendKeys(email);
        passwordInput.SendKeys(password);
        confirmPasswordInput.SendKeys(password);

        submit.Click();
    

        try
        {
            Assert.DoesNotContain("is already taken.", _driver.PageSource);
        }

        catch
        {
            Assert.True(false, "User " + email + " is already registered.");
        }


        Assert.Contains(TestData.homeTitleLoggedIn, _driver.Title);
        Assert.Contains("Hello " + nickname, _driver.PageSource);





        this._driver.Quit();

    }


    // Test for TC-2.1
    // RegisterUser (TC-1.1) should be run first)
    // The test will try to log in with an already existing user
    [Theory, Trait("Priority", "2")]
    [MemberData(nameof(TestUsersToLogin))]
    public void LoginUser(string nickname, string email, string password, bool quit = true)
    {
        this._driver.Navigate().GoToUrl(TestData.siteAddress);

        Assert.Contains(TestData.homeTitleNotLoggedIn, _driver.Title);

        IWebElement loginButton = _driver.FindElement(By.LinkText("Login"));
        loginButton.Click();

        Assert.Contains("Log in", _driver.Title);

        IWebElement emailInput = _driver.FindElement(By.Id("Input_Email"));
        IWebElement passwordInput = _driver.FindElement(By.Id("Input_Password"));
        IWebElement submitButton = _driver.FindElement(By.Id("login-submit"));

        emailInput.SendKeys(email);
        passwordInput.SendKeys(password);
        submitButton.Click();


        // Check if user is successfully logged in
        Assert.Contains(TestData.homeTitleLoggedIn, _driver.Title);
        Assert.Contains("Hello " + nickname, _driver.PageSource);


        if (quit == true)
        {
            this._driver.Quit();
        }

    }

    // Test for TC-1.3
    // The test will try to register an account with missing nickname
    [Theory, Trait("Priority", "3")]
    [MemberData(nameof(TestUsersToNotRegister))]
    public void RegisterUserWithMissingNick(string nickname, string email, string password)
    {
        this._driver.Navigate().GoToUrl(TestData.siteAddress);

        Assert.Contains(TestData.homeTitleNotLoggedIn, _driver.Title);

        this._driver.FindElement(By.LinkText("Register")).Click();

        Assert.Contains("Register", _driver.Title);

        IWebElement emailInput = _driver.FindElement(By.Id("Input_Email"));
        IWebElement passwordInput = _driver.FindElement(By.Id("Input_Password"));
        IWebElement confirmPasswordInput = _driver.FindElement(By.Id("Input_ConfirmPassword"));
        IWebElement submit = _driver.FindElement(By.Id("registerSubmit"));

        emailInput.SendKeys(email);
        passwordInput.SendKeys(password);
        confirmPasswordInput.SendKeys(password);

        submit.Click();

        // Check if the registration was denied due to missing nickname
        Assert.Contains("Register", _driver.Title);
        Assert.Contains("The Nickname field is required", _driver.PageSource);

        this._driver.Quit();


    }


    [Theory, Trait("Priority", "4")]
    [MemberData(nameof(TestUsersToNotRegister))]
    public void RegisterUserWithMissingEmail(string nickname, string email, string password)
    {

        this._driver.Navigate().GoToUrl(TestData.siteAddress);
        Assert.Contains(TestData.homeTitleNotLoggedIn, _driver.Title);
        this._driver.FindElement(By.LinkText("Register")).Click();
        Assert.Contains("Register", _driver.Title);
        IWebElement nicknameInput = _driver.FindElement(By.Id("Input_Nickname"));
        IWebElement passwordInput = _driver.FindElement(By.Id("Input_Password"));
        IWebElement confirmPasswordInput = _driver.FindElement(By.Id("Input_ConfirmPassword"));
        IWebElement submit = _driver.FindElement(By.Id("registerSubmit"));

        nicknameInput.SendKeys(nickname);
        passwordInput.SendKeys(password);
        confirmPasswordInput.SendKeys(password);
        submit.Click();
        // Check if the registration was denied due to missing email
        Assert.Contains("Register", _driver.Title);
        Assert.Contains("The Email field is required", _driver.PageSource);
        this._driver.Quit();
    }


    // This will change the password of an already logged in user
    private void ChangePassword(string nickname, string oldPassword, string newPassword)
    {
        Assert.Contains("Hello " + nickname, _driver.PageSource);

        _driver.FindElement(By.LinkText("Hello " + nickname)).Click();

        Assert.Contains("Manage your account", _driver.PageSource);

        _driver.FindElement(By.LinkText("Password")).Click();

        Assert.Contains("Change password", _driver.PageSource);

        // Get input fields
        IWebElement oldPasswordInput = _driver.FindElement(By.Id("Input_OldPassword"));
        IWebElement newPasswordInput = _driver.FindElement(By.Id("Input_NewPassword"));
        IWebElement confirmNewPasswordInput = _driver.FindElement(By.Id("Input_ConfirmPassword"));

        IWebElement submitButton = _driver.FindElement(By.XPath("//button[text()=\"Update password\"]"));

        oldPasswordInput.SendKeys(oldPassword);
        newPasswordInput.SendKeys(newPassword);
        confirmNewPasswordInput.SendKeys(newPassword);
        submitButton.Click();

        try
        {
            Assert.Contains("Your password has been changed.", _driver.PageSource);
            _output.WriteLine("Password successfully changed");
        }

        catch
        {
            Assert.True(false, "Password was not changed. Test failed");
        }

    }


    // Test for TC-1.2
    // RegisterUser (TC-1.1) should already be run before this one.
    [Theory, Trait("Priority", "5")]
    [MemberData(nameof(TestUsersToRegister))]
    public void RegisterExistingUser(string nickname, string email, string password)
    {
        this._driver.Navigate().GoToUrl(TestData.siteAddress);

        // Check if we are on the front page
        Assert.Contains(TestData.homeTitleNotLoggedIn, _driver.Title);

        // Locate Register button and navigate to Register page
        _driver.FindElement(By.LinkText("Register")).Click();

        Assert.Contains(TestData.registerTitle, _driver.Title);

        // Get inputs fields from the form
        IWebElement nicknameInput = _driver.FindElement(By.Id("Input_Nickname"));
        IWebElement emailInput = _driver.FindElement(By.Id("Input_Email"));
        IWebElement passwordInput = _driver.FindElement(By.Id("Input_Password"));
        IWebElement confirmPasswordInput = _driver.FindElement(By.Id("Input_ConfirmPassword"));
        IWebElement submit = _driver.FindElement(By.Id("registerSubmit"));


        nicknameInput.SendKeys(nickname);
        emailInput.SendKeys(email);
        passwordInput.SendKeys(password);
        confirmPasswordInput.SendKeys(password);
        submit.Click();

        // Check if the site throws an error, saying that the username(email) is already taken.
        Assert.Contains("Username '" + email + "' is already taken.", _driver.PageSource);

        // Test was successful, print output
        _output.WriteLine("User was not able to register a new account with an existing username/email: " + email);
        _output.WriteLine("Test successful!");
    }

    // Test for TC-2.3
    // RegisterUser(TC-1.1) should already be run
    [Theory, Trait("Priority", "6")]
    [MemberData(nameof(TestUsersToRegister))]
    public void LoginWithWrongPassword(string nickname, string email, string password)
    {
        this._driver.Navigate().GoToUrl(TestData.siteAddress);

        // Check that we are on the front page
        Assert.Contains(TestData.homeTitleNotLoggedIn, _driver.Title);

        // Navigate to the login page
        _driver.FindElement(By.LinkText("Login")).Click();
        Assert.Contains(TestData.loginTitle, _driver.Title);

        // Get input fields from the login form
        IWebElement emailInput = _driver.FindElement(By.Id("Input_Email"));
        IWebElement passwordInput = _driver.FindElement(By.Id("Input_Password"));
        IWebElement submitButton = _driver.FindElement(By.Id("login-submit"));


        // Enter correct username(email), but fill in an incorrect password
        emailInput.SendKeys(email);
        passwordInput.SendKeys("RandomPassword1234.");
        submitButton.Click();

        // Check if the login is denied, with an error telling the user that the login was incorrect
        Assert.Contains("Invalid login attempt.", _driver.PageSource);

        _output.WriteLine("User " + email + " was not able to log in with the wrong password");
        _output.WriteLine("Test successful!");
    }

    // Test for TC-3.2
    // RegisterUser(TC-1.1) should already be run

    // This test will try to change a logged in users password to an invalid one (e.g. too few characters)
    [Theory, Trait("Priority", "7")]
    [MemberData(nameof(TestUsersToRegister))]
    public void ChangeToInvalidPassword(string nickname, string email, string password)
    {
        _driver.Navigate().GoToUrl(TestData.siteAddress);

        Assert.Contains(TestData.homeTitleNotLoggedIn, _driver.Title);

        // Get a user from the TestUsersEnumerable and use that to log in
        var user = TestUsersToRegister.First();

        LoginUser(nickname, email, password, false);

        Assert.Contains(nickname, _driver.PageSource);

        _driver.Navigate().GoToUrl(TestData.siteAddress);
        // Click the nickname to go the user control panel
        _driver.FindElement(By.LinkText("Hello " + nickname)).Click();

        // Check that we are on the control panel
        Assert.Contains("Manage your account", _driver.PageSource);

        _driver.FindElement(By.Id("change-password")).Click();

        Assert.Contains("Change password", _driver.PageSource);

        // Get change password input fields
        IWebElement oldPasswordInput = _driver.FindElement(By.Id("Input_OldPassword"));
        IWebElement newPasswordInput = _driver.FindElement(By.Id("Input_NewPassword"));
        IWebElement confirmPasswordInput = _driver.FindElement(By.Id("Input_ConfirmPassword"));
        IWebElement submitButton = _driver.FindElement(By.XPath("//button[text()=\"Update password\"]"));

        string invalidPassword = TestData.GetRandomInvalidPassword();
        oldPasswordInput.SendKeys(password);
        newPasswordInput.SendKeys(invalidPassword);
        confirmPasswordInput.SendKeys(invalidPassword);

        submitButton.Click();

        // Check if the 'Your password has been changed' message is shown or not.
        // If not shown, the password change request was denied and the test is successful
        Assert.DoesNotContain("Your password has been changed", _driver.PageSource);

        _output.WriteLine("User " + email + " was not able change their password to " + invalidPassword);
        _output.WriteLine("Test successful!");

        _driver.Quit();
    }

    // Test for TC-3.3

    // This test will try to change the password and then log in with the old password.
    [Theory, Trait("Priority", "30")]
    [MemberData(nameof(TestUsersToRegister))]
    public void LoginWithOldPassword(string nickname, string email, string password)
    {
        _driver.Navigate().GoToUrl(TestData.siteAddress);

        try
        {
            // Check to see that the user is not logged in.
            Assert.Contains(TestData.homeTitleNotLoggedIn, _driver.Title);
            _output.WriteLine("User not logged in, continuing...");
        }

        catch
        {
            // If not, log out the user and navigate to landing page
            _output.WriteLine("User was already logged in, logging out first...");
            _driver.FindElement(By.XPath("//button[text()=\"Logout\"]"));
            _driver.Navigate().GoToUrl(TestData.siteAddress);
        }

        _driver.FindElement(By.LinkText("Login")).Click();

        Assert.Contains(TestData.loginTitle, _driver.Title);
        _output.WriteLine("At login page");


        // Login user
        LoginUser(nickname, email, password, false);

        Assert.Contains("Hello " + nickname, _driver.PageSource);
        _output.WriteLine("User logged in successfully");

        string newPassword = TestData.GetRandomValidPassword();

        ChangePassword(nickname, password, newPassword);

        try
        {
            Assert.Contains("Hello " + nickname, _driver.PageSource);
            _output.WriteLine("User logged in, logging out first...");
            _driver.FindElement(By.LinkText("Logout")).Click();
        }

        catch
        {
            _output.WriteLine("User already logged out, proceeding...");
        }

        try
        {
            LoginUser(nickname, email, password, false);
            _output.WriteLine("User " + email + " was able to log in with their old password: " + password);
        }

        catch
        {
            _output.WriteLine("User " + email + " was not able to log in with their old password.\nTest successful");
        }
        
        // Change back to previous password before ending test
        ChangePassword(nickname, newPassword, password);



    }
}