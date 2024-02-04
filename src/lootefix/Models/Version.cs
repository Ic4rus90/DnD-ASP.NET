using Microsoft.Extensions.Hosting.Internal;

namespace lootefix.Models;

public static class Version
{
    public static string getVersionNumber()
    {
        try
        {
            var version = File.ReadAllText("version.txt");
            return version;
        }

        catch
        {
            // If for some reason the file cannot be loaded/read, just return an empty string. 
            return "";
        }

    }
}


