using lootefix.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace lootefix.Data;

public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }
    
    
    public DbSet<Session> Sessions => Set<Session>();
    public DbSet<GroupInventory> GroupInventories => Set<GroupInventory>();
    public DbSet<Item> Items => Set<Item>();
    public DbSet<GroupFund> GroupFunds => Set<GroupFund>();
    
    public DbSet<ActiveInvitation> ActiveInvitations => Set<ActiveInvitation>();
    
    public DbSet<ApplicationUserSession> ApplicationUserSessions => Set<ApplicationUserSession>();
    
    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        
        builder.Entity<ApplicationUserSession>()
            .HasOne(pt => pt.ApplicationUser)
            .WithMany(p => p.ApplicationUserSessions)
            .HasForeignKey(pt => pt.ApplicationUserId);
        
        builder.Entity<ApplicationUserSession>()
            .HasOne(pt => pt.Session)
            .WithMany(t => t.ApplicationUserSessions)
            .HasForeignKey(pt => pt.SessionId);
    }

}