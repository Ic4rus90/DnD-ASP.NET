using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace lootefix.Models;
using Microsoft.Build.Framework;

public class Item
{
    public Item(){}

    public Item(int groupInventoryId)
    {
            GroupInventoryId = groupInventoryId;
    }

    public Item(string name, int value, string description)
    {
        Name = name;
        Value = value;
        Description = description;
    }
    
    //Full constructor
    public Item(string name, int value, string rarity, string itemType, string description, int charges)
    {
        Name = name;
        Value = value;
        Rarity = rarity;
        ItemType = itemType;
        Description = description;
        Charges = charges;
    }
        
    public int Id { get; set; }
    
    [Required]
    [StringLength(100)]
    [DisplayName("Item name")]
    public string Name { get; set; } = string.Empty;
        
    [DisplayName("Item base value")]
    public int Value { get; set; }
        
    //[Required]
    [StringLength(100)]
    [DisplayName("Item rarity")]
    public string Rarity { get; set; } = string.Empty;
        
    //[Required]
    [StringLength(100)]
    [DisplayName("Item type")]
    public string ItemType { get; set; } = string.Empty;
        
    [Required]
    [StringLength(10000)]
    [DisplayName("ItemDescription")]
    public string Description { get; set; } = string.Empty;
        
        
    [DisplayName("Item charges/uses")]
    public int Charges { get; set; }
    
    
    //Foreign key to the Blog model. Configured automatically because of the name.
    public int GroupInventoryId { get; set; }

    //Navigation property to the GroupInventory model. Configured automatically because of the name.
    public GroupInventory? GroupInventory { get; set; } = null!;
}