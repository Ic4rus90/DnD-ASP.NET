using System.Diagnostics;
using lootefix.Data;
using lootefix.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace lootefix.Controllers;

public class InviteController: Controller
{
    private ApplicationDbContext _db;
    private UserManager<ApplicationUser> _um;
    private RoleManager<IdentityRole> _rm;
    
    private readonly ILogger<HomeController> _logger;
    

    public InviteController(ApplicationDbContext db, ILogger<HomeController> logger, UserManager<ApplicationUser> um, RoleManager<IdentityRole> rm)
    {
        _logger = logger;
        _db = db;
        _um = um;
        _rm = rm;
    }

    [HttpGet]
    public async Task<IActionResult> AlreadyInCampaign()
    {
        var user = await _um.GetUserAsync(User);
        
        return View(user);
    }
    
    
    [HttpGet]
    public async Task<IActionResult> JoinCampaign(Guid? id)
    {
        if (id == null) return NotFound();
        var invite = await _db.ActiveInvitations.FindAsync(id);
        if (invite == null) return NotFound();

        var session = await _db.Sessions.FindAsync(invite.SessionId);
        if (session == null) return NotFound();

        return View(session);
    }

    [HttpPost]
    /*public async Task<IActionResult> PlayerInSession()
    {
        var player = _um.GetUserAsync(User).Result;
    }*/
    

    
    
    [HttpPost]
    public async Task<IActionResult> JoinCampaign(Guid id)
    {
        var user = await _um.GetUserAsync(User);
        if (user == null) 
        { 
            Response.Cookies.Delete(".AspNetCore.Identity.Application");
            return Redirect("/Identity/Account/Login");
        }
        var invite = await _db.ActiveInvitations.FindAsync(id);
        if (invite == null) return NotFound();
        
        var session = await _db.Sessions.FindAsync(invite.SessionId);
        if (session == null) return NotFound();
        
        if (_db.ApplicationUserSessions.Any(x => x.SessionId == session.Id && x.ApplicationUserId == user.Id))
        {
            return RedirectToAction("AlreadyInCampaign", "Invite");
        }
        
        var applicationUserSession = new ApplicationUserSession(session, user);
        _db.ApplicationUserSessions.Add(applicationUserSession);

        await _db.SaveChangesAsync();

        return RedirectToAction("ChooseCampaign", "Home");
    }
    
    
    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }

    
}