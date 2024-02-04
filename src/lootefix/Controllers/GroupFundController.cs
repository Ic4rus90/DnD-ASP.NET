using lootefix.Data;
using lootefix.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace lootefix.Controllers;

public class FundsController : Controller
{
    private ApplicationDbContext _db;
    private UserManager<ApplicationUser> _um;
    private RoleManager<IdentityRole> _rm;
    
    private readonly ILogger<HomeController> _logger;

    public FundsController(ApplicationDbContext db, ILogger<HomeController> logger, UserManager<ApplicationUser> um, RoleManager<IdentityRole> rm)
    {
        _logger = logger;
        _db = db;
        _um = um;
        _rm = rm;
    }
    
    // Something something it works
    [HttpPost]
    public async Task<IActionResult> EditFunds([Bind("Gold, Silver, Copper, GroupInventoryId")] GroupFund groupFund)
    {
        if (!ModelState.IsValid) return BadRequest(400);

        var id = groupFund.GroupInventoryId;
        
        var gi = await _db.GroupInventories.FindAsync(id);
        if (gi == null) return NotFound();
        
        var oldGroupFund = await _db.GroupFunds.FindAsync(id);
        if (oldGroupFund == null) return NotFound();
        oldGroupFund.GroupInventory = gi;
        
        oldGroupFund.GroupInventory = gi;
        oldGroupFund.Id = id;
        
        // Adding the new amount of copper
        oldGroupFund.Copper += groupFund.Copper;
        oldGroupFund.Silver += groupFund.Silver;
        oldGroupFund.Gold += groupFund.Gold;

        _db.GroupFunds.Update(oldGroupFund);
        await _db.SaveChangesAsync();
        return Json(new { oldGroupFund.Copper, oldGroupFund.Gold, oldGroupFund.Silver });
    }
}