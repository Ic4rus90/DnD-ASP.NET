using Microsoft.Build.Framework;

namespace lootefix.Models;

public class GroupInventory
{
    [Required]
    public int Id { get; set; }
    
    [Required]
    public string Name { get; set; }
    
    [Required]
    public ICollection<Item> Items { get; set; } = new List<Item>();

    public GroupFund GroupFund { get; set; } = new GroupFund();
    
    //Foreign key to the Session model. Configured automatically because of the name.
    public int? SessionId { get; set; }

    //Navigation property to the Session model. Configured automatically because of the name.
    public Session? Session { get; set; } = null!;
    
    
    
    
}