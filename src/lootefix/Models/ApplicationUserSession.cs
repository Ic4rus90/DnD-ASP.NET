namespace lootefix.Models;

public class ApplicationUserSession
{
    

    
    public ApplicationUserSession(int sessionId, string applicationUserId)
    {
        SessionId = sessionId;
        ApplicationUserId = applicationUserId;
    }

    public ApplicationUserSession(Session session, ApplicationUser applicationUser)
    {
        ApplicationUser = applicationUser; 
        Session = session;
    }
    
    
    public int Id { get; set; }
    public int SessionId { get; set; }
    public Session? Session { get; set; }
    
    public string ApplicationUserId { get; set; }
    public ApplicationUser? ApplicationUser { get; set; }

}