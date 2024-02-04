using System.Diagnostics;
using lootefix.Data;
using Microsoft.AspNetCore.Mvc;
using lootefix.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.CodeAnalysis.Diagnostics;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace lootefix.Controllers;

public class HomeController : Controller
{
    private ApplicationDbContext _db;
    private UserManager<ApplicationUser> _um;
    private RoleManager<IdentityRole> _rm;
    
    private readonly ILogger<HomeController> _logger;
    

    public HomeController(ApplicationDbContext db, ILogger<HomeController> logger, UserManager<ApplicationUser> um, RoleManager<IdentityRole> rm)
    {
        _logger = logger;
        _db = db;
        _um = um;
        _rm = rm;
    }
    
    [AllowAnonymous]
    public IActionResult LandingPage()
    {
        return View();
    }

    [Authorize]
    public IActionResult ChooseCampaign()
    {
        var user = _um.GetUserAsync(User);
        if (user == null)
        { 
            Response.Cookies.Delete(".AspNetCore.Identity.Application");
            return Redirect("/Identity/Account/Login");
        }
        var userId = user.Result.Id;
        
        var userSessions = new List<Session>();
        foreach (var a in _db.ApplicationUserSessions)
        {
            if (a.ApplicationUserId == userId)
            {
                userSessions.Add(_db.Sessions.Find(a.SessionId));
            }
        }
        return View(userSessions);

    }

    public async Task<IActionResult> Index(int? id)
    {
        if (id == 0 || id == null)
            return NotFound();
        
        var user = await _um.GetUserAsync(User);
        if (user == null) 
        { 
            Response.Cookies.Delete(".AspNetCore.Identity.Application");
            return Redirect("/Identity/Account/Login");
        }
        
        if (_db.ApplicationUserSessions.Any(a => a.ApplicationUserId == user.Id && a.SessionId == id))
        {
            var session = await _db.Sessions.FindAsync(id);
            if (session == null) return NotFound();

            session.GroupInventories = await _db.GroupInventories
                .Include(s => s.Items)
                .Include(s => s.GroupFund)
                .Where(s => s.SessionId == id)
                .ToListAsync();
            return View(session);
        }
        return NotFound();
    }

    public async Task<IActionResult> About()
    {
        return View();
    }


    // Her hadde vi [ValidateAntiforgeryToken] attributt, men vi kan ikke ha den når vi skal sende requesten fra Javascript (tror jeg...?)
    [HttpPost]
    public async Task<IActionResult> CreateInvitationLink(int? id)
    {
        var exists = _db.ActiveInvitations.Any(a => a.SessionId == id);
        var activeInvitation = new ActiveInvitation();

        if (!exists)
        {
            activeInvitation.SessionId = id;
            activeInvitation.Session = await _db.Sessions.FindAsync(id);
        
            if (!ModelState.IsValid) return BadRequest(400);

            _db.Add(activeInvitation);
            await _db.SaveChangesAsync();
        }
        else
        {
            activeInvitation = await _db.ActiveInvitations.Where(a => a.SessionId == id).FirstOrDefaultAsync();
        }
       
        return Json(Url.Action(
            action: "JoinCampaign", controller: "Invite", values: new {id = activeInvitation.Id}, protocol: "https"));
    }
    
    //Add session to the database
    [Authorize]
    [HttpPost]
    public async Task<IActionResult> AddSession([Bind("Name")] Session session)
    {
        if (!ModelState.IsValid) return BadRequest(400);    
        var user = await _um.GetUserAsync(User);
        if (user == null)
        {
            Response.Cookies.Delete(".AspNetCore.Identity.Application");
            return Redirect("/Identity/Account/Login");
        }
        
        session.DungeonMaster = user.Id;
        var applicationUserSession = new ApplicationUserSession(session, user);
        _db.ApplicationUserSessions.Add(applicationUserSession);
        _db.Sessions.Add(session);
        await _db.SaveChangesAsync();
        
        return Json(new { session.Id, session.Name });
    }

    //Add group inventory to the database
    [HttpPost]
    public async Task<IActionResult> AddGroupInventory([Bind("Name, SessionId")] GroupInventory groupInventory)
    {
        if (!ModelState.IsValid) return BadRequest(400);
        _db.GroupInventories.Add(groupInventory);
        await _db.SaveChangesAsync();
        
        return Json(new { groupInventory.Id, groupInventory.Name });
    }
    
    //Add group inventory to the database
    [HttpDelete]
    public async Task<IActionResult> DeleteGroupInventory(int id)
    {
        var gi = new GroupInventory();
        gi = await _db.GroupInventories.FindAsync(id);
        
        if (gi == null) return NotFound();
        _db.GroupInventories.Remove(gi);
        await _db.SaveChangesAsync();

        return Ok();
    }

    //Add item to the group inventory
    [HttpPost]
    public async Task<IActionResult> Add([Bind("Name, Value, Rarity, ItemType, Description, Charges, GroupInventoryId")] Item item)
    {
        if (!ModelState.IsValid) return BadRequest(400);
        
        _db.Add(item);
        await _db.SaveChangesAsync();
        return Json(item);
    }

    //Edit item in database
    [HttpPost]
    public async Task<IActionResult> Edit([Bind("Id, Name, Value, Rarity, ItemType, Description, Charges, GroupInventoryId")]Item item)
    {
        if (!ModelState.IsValid) return BadRequest(400);
        
        _db.Update(item);
        await _db.SaveChangesAsync();
        return RedirectToAction(nameof(Index));
    }
    
    //Delete item from database
    [HttpPost]
    public async Task<IActionResult> Delete(int itemId)
    {
        var item = await _db.Items.FindAsync(itemId);
        
        if (item == null)
        {
            return NotFound();
        }
        
        _db.Remove(item);
        await _db.SaveChangesAsync();
        return RedirectToAction(nameof(Index));
    }

    public IActionResult Privacy()
    {
        return View();
    }


    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}