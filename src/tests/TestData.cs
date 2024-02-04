using System;
using System.Net.Security;

namespace tests;

using System.Collections.Generic;

public static class TestData
{
    public static readonly string siteAddress = "http://localhost:7268";
    
    public static readonly string homeTitleLoggedIn = "Choose your session";

    public static readonly string homeTitleNotLoggedIn = "Log in - lootefix";

    public static readonly string loginButtonTitle = "Login";

    public static readonly string loginTitle = "Log in - lootefix";

    public static readonly string registerTitle = "Register - lootefix";

    private static readonly string[] validPasswords = { "Test1234.", "MyCat123.", "Norway1814!" };

    private static readonly string[] invalidPasswords = { "Test", "MyCatsName", "MyMaidenName", "MyAddressPlusMyBirthDate", "GreatPassword" };



    public static string GetRandomValidPassword()
    {
        Random randomObj = new Random();
        int randomInt = randomObj.Next(0, validPasswords.Length - 1);

        return validPasswords[randomInt];
    }
    public static string GetRandomInvalidPassword()
    {
        Random randomObj = new Random();
        int randomInt = randomObj.Next(0, invalidPasswords.Length - 1);

        return invalidPasswords[randomInt];
    }

}