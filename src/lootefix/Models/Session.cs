using Microsoft.Build.Framework;

namespace lootefix.Models;

public class Session
{
    [Required]
    public int Id { get; set; }
    
    [Required]
    public string Name { get; set; }
    
    public string? DungeonMaster { get; set; }
    
    
    public ActiveInvitation? ActiveInvitation { get; set; } = null!;
    
    public ICollection<GroupInventory> GroupInventories { get; set; } = new List<GroupInventory>();
    
    
    public ICollection<ApplicationUserSession> ApplicationUserSessions { get; set; } = new List<ApplicationUserSession>();
}