using lootefix.Models;
using Microsoft.AspNetCore.Identity;

namespace lootefix.Data
{
    public class ApplicationDbInitializer
    {
        public static void Initialize(ApplicationDbContext db, UserManager<ApplicationUser> um, RoleManager<IdentityRole> rm)
        {
            // Recreate DB
            db.Database.EnsureDeleted();
            db.Database.EnsureCreated();
            
            // Create roles
            var adminRole = new IdentityRole("Admin");
            rm.CreateAsync(adminRole).Wait();

            var playerRole = new IdentityRole("Player");
            rm.CreateAsync(playerRole).Wait();

            var dmRole = new IdentityRole("DM");
            rm.CreateAsync(dmRole).Wait();

            // Create users
            var admin = new ApplicationUser { UserName = "admin@uia.no", Email = "admin@uia.no", Nickname = "AdminUser"};
            um.CreateAsync(admin, "Password1.").Wait();
            um.AddToRoleAsync(admin, "Admin").Wait();

            var user = new ApplicationUser { UserName = "User1@uia.no", Email = "User1@uia.no", Nickname = "TestUser"};
            um.CreateAsync(user, "User1@uia.no").Wait();
            
            
            //// Users for sensors
                var sensor1 = new ApplicationUser { UserName = "Sensor1@example.com", Email = "Sensor1@example.com", Nickname = "Sensor1"};
                um.CreateAsync(sensor1, "Password1.").Wait();
                var sensor2 = new ApplicationUser { UserName = "Sensor2@example.com", Email = "Sensor2@example.com", Nickname = "Sensor2"};
                um.CreateAsync(sensor2, "Password1.").Wait();
            //// Delete this when project is validated


            // Finally save changes to the database
            db.SaveChanges();

            
            //// Users for sensors
                var sensor1Inventory = new GroupInventory();
                sensor1Inventory.Name = "Group Inventory";
                
                sensor1Inventory.Items = new[]
                {
                    new Item("Bronze helmet",     3,  "Common", "Armor", "A helmet made of bronze. It's very useless", 0),
                    new Item("Fire sword",        16,  "Very Rare", "Weapon", "A sword that hurts to touch", 10),
                    new Item("Stone",             1, "Non-magical","Weapon",  "A stone, what else could it be?", 1),
                    new Item("Healing potion",    3,  "Rare","Potion","Heals 128 HP", 1),
                    new Item("Catification spell",8,  "Very Rare", "Potion", "Drink that turns the player into a cat", 1)
                };
                
                sensor1Inventory.GroupFund = new GroupFund(30, 7, 25);
                db.GroupInventories.AddRange(sensor1Inventory);
                db.SaveChanges();
                
                var sensorSession = new Session();
                sensorSession.Name = "The quest of the lootefix";
                sensorSession.GroupInventories = new [] {sensor1Inventory};
                sensorSession.DungeonMaster = sensor1.Id;
                db.Sessions.Add(sensorSession);
                db.SaveChanges();
                
                var sensorUserSession = new ApplicationUserSession(sensorSession, sensor1);
                db.ApplicationUserSessions.Add(sensorUserSession);
                db.SaveChanges();
            //// Delete this when project is validated
            
            var groupInventory = new GroupInventory();
            groupInventory.Name = "Donkey";
            
            groupInventory.Items = new[]
            {
                new Item("Leaf",              1,  "very rare", "object", "Completely useless object", 4),
                new Item("Fire sword",        6,  "A sword that hurts to touch"),
                new Item("Stone",             1,  "A stone, what else could it be?"),
                new Item("Healing potion",    3,  "Heals 128 HP"),
                new Item("Catification spell",8,  "very rare", "potion", "Drink that turns the player into a cat", 1)
            };
            
            groupInventory.GroupFund = new GroupFund(1, 1, 1);
            db.GroupInventories.AddRange(groupInventory);
            db.SaveChanges();
            
            var groupInventoryTwo = new GroupInventory();
            groupInventoryTwo.Name = "Rucksack";
            
            groupInventoryTwo.Items = new[]
            {
                new Item("Ant",              4, "Common", "Pet", "Tiny edible creature", 0),
                new Item("Stick",        2,  "Wooden stick"),
                new Item("Flower",             3,  "A flower with a nice smell"),
                new Item("Cat",    3,  "A bewitching creature"),
                new Item("Crown of torture",2000,  "A crown that hurts to wear")
            };
            groupInventoryTwo.GroupFund = new GroupFund(3, 2, 9);
            
            
            db.GroupInventories.AddRange(groupInventoryTwo);
            db.SaveChanges();
            
            var session = new Session();
            session.Name = "The quest of the lootefix";
            session.GroupInventories = new [] {groupInventory, groupInventoryTwo};
            session.DungeonMaster = admin.Id;
            db.Sessions.Add(session);
            db.SaveChanges();
            
            var userSession = new ApplicationUserSession(session, admin);
            db.ApplicationUserSessions.Add(userSession);
            db.SaveChanges();
            
            var groupInventoryThree = new GroupInventory();
            groupInventoryThree.Name = "Backpack";
            
            groupInventoryThree.Items = new[]
            {
                new Item("Sjokoladebolle", 25, "Artifact", "Consumable",  "A delicious pastry", 0),
                new Item("Databrus",        35,  "Rare", "Consumable", "Refreshing beverage", 0),
                new Item("Lily of the  valley",             3,  "Poisonous flower"),
                new Item("Dead crow",    1,  "Probably not edible"),
                new Item("Unknown metal lump", 10,  "A glowing lump of metal")
            };
            
            db.GroupInventories.Add(groupInventoryThree);
            db.SaveChanges();
            
            var groupInventoryFour = new GroupInventory();
            groupInventoryFour.Name = "Elf maiden";
            
            groupInventoryFour.Items = new[]
            {
                new Item("Dull sword",            10, "Common", "Equippable",  "A somewhat dull sword", 0),
                new Item("Wooden shield",        10,  "A wooden shield"),
                new Item("Longbow",             10,  "A standard elven longbow"),
                new Item("Arrow",    10,  "An poison coated arrow"),
                new Item("Potion", 10,  "A potion with unknown properties")
            };
            
            db.GroupInventories.Add(groupInventoryFour);
            db.SaveChanges();
            
            
            var sessionTwo = new Session();
            sessionTwo.Name = "The adventure begins";
            sessionTwo.GroupInventories = new [] {groupInventoryThree, groupInventoryFour};
            sessionTwo.DungeonMaster = user.Id;
            db.Sessions.Add(sessionTwo);
            db.SaveChanges();
            
            var userSessionTwo = new ApplicationUserSession(sessionTwo, user);
            db.ApplicationUserSessions.Add(userSessionTwo);
            db.SaveChanges();
            
           var activeInvitationOne = new ActiveInvitation();
            activeInvitationOne.SessionId = session.Id;
            activeInvitationOne.Session = session;
            db.ActiveInvitations.Add(activeInvitationOne);
            db.SaveChanges();
        }
    }
}