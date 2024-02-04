let Invite = (function () {
    // Typescript code for handling of invitations
    
    function create(sessionId : number)
    {
        // Send POST request to CreateInvitationLink method in HomeController.
        let query = "/Home/CreateInvitationLink/";
        let bodyContent = 'Id='.concat(sessionId.toString());
        
        fetch(query, {
            method: "post",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: bodyContent
            
        }).then((response) => {
            // Om responsen returnerer en feil, throw new error
            if(!response.ok && !response.redirected){
                alert(response);
                throw new Error(response.status.toString());
            } else return response.json();
        }).then(x => { return x }).then((data) => {
            // Requesten er ok
            
            // Copy invite link to the clipboard
            copyDataToClipboard(data);
            
            // Show the notification
            showLinkNotification();
            
        });
    }
    
    
    // Litt inspirasjon hentet herfra: https://www.w3schools.com/howto/howto_js_snackbar.asp
    
    function showLinkNotification() 
    {
        let newNotificationElement = document.createElement("div") as HTMLDivElement;
        newNotificationElement.id = "inviteLinkNotification"
        newNotificationElement.className="display";
        newNotificationElement.textContent = "Invite link copied to clipboard";
        
        
        let bodyTag = document.body;
        
        bodyTag.append(newNotificationElement);
        setTimeout(function(){ newNotificationElement.className = newNotificationElement.className.replace("display", ""); newNotificationElement.remove(); }, 2500);
        
    }
    
    
    function copyDataToClipboard(data)
    {
        navigator.clipboard.writeText(data).then(function()
        {
            console.log("Invite link: " + data + " copied to clipboard");
        }, function(err)
        {
            console.log("Invite link was not copied to clipboard");
        })
    }

    // Here you can set what to be public
    return {
        // Name             : Function
        create
    };
})();