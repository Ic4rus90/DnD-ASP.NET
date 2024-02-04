using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace lootefix.Models;
using Microsoft.Build.Framework;

public class GroupFund
{
    public GroupFund(){}
    
    public GroupFund(int groupInventoryId)
    {
        GroupInventoryId = groupInventoryId;
    }

    public GroupFund(int gold, int silver, int copper)
    {
        Gold = gold;
        Silver = silver;
        Copper = copper;

    }

    [DisplayName("Gold")] public int? Gold { get; set; } = 0;

    [DisplayName("Silver")] public int? Silver { get; set; } = 0;

    [DisplayName("Copper")] public int? Copper { get; set; } = 0;
        
    public int Id { get; set; }
    
    //Foreign key to the GroupInventory model. Configured automatically because of the name.
    public int GroupInventoryId { get; set; }

    //Navigation property to the GroupInventory model. Configured automatically because of the name.
    public GroupInventory? GroupInventory { get; set; } = null!;

   
}