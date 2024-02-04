using Microsoft.AspNetCore.Identity;
using Microsoft.Build.Framework;

namespace lootefix.Models;

public class ApplicationUser : IdentityUser
{
    [Required]
    public string Nickname { get; set; } = string.Empty;
    
    
    public ICollection<ApplicationUserSession> ApplicationUserSessions { get; set; }
}