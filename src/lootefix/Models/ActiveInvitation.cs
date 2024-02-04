using Microsoft.Build.Framework;

namespace lootefix.Models;

public class ActiveInvitation
{

    public ActiveInvitation()
    {
        Id = Guid.NewGuid();
    }
    
    [Required]
    public Guid Id { get; set; }
    
    
    //Foreign key to the session id
    public int? SessionId { get; set; }


    //Navigation property to session
    public Session? Session { get; set; }
}