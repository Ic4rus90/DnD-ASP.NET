let Session = (function () {
    
    // Global variable within session.ts
    let sessionBox : HTMLElement;
    
    
    // Init for this function
    function init() {
        // Return if no sessionBox id was found
        if (!document.getElementById("sessionBox"))
            return;
        sessionBox = document.getElementById("sessionBox");
        
        // Load event for add button
        let bigAddButton = sessionBox.querySelector("#addSessionCard");
        bigAddButton.addEventListener("click", addSession);
        
    }
    
    

    
    // Function to add html element for setting name, add, cancel
    function addSession(){
        let bigButton = sessionBox.querySelector("#addSessionCard");

        // Creating div
        let div = document.createElement("DIV") as HTMLDivElement;
        div.classList.add("input-group", "rounded-0");
        
        // Creating an unique id for this row
        let tmpId = Random.makeid();
        div.id = tmpId;
        
        // Creating input
        let input = document.createElement("INPUT") as HTMLInputElement;
        input.classList.add("form-control");
        input.type = "text";
        input.placeholder = "Name your campaign...";
        input.id = "SessionName"; // TODO: use model instead
        
        // Creating add button
        let addButton = document.createElement("BUTTON") as HTMLButtonElement;
        addButton.classList.add("btn", "btn-outline-green");
        addButton.type = "button";
        addButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-lg" viewBox="0 0 16 16"><path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"/></svg>`;
        addButton.addEventListener("click", function (){add(tmpId)});

        // Creating cancel button
        let cancelButton = document.createElement("BUTTON") as HTMLButtonElement;
        cancelButton.classList.add("btn", "btn-outline-red");
        cancelButton.type = "button";
        cancelButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16"><path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/></svg>`;
        cancelButton.addEventListener("click", function (){cancel(tmpId)});
        
        
        div.appendChild(input);
        div.appendChild(addButton);
        div.appendChild(cancelButton);
        
        bigButton.before(div);
    }

    /**
     * Cancelling creation of session
     * @param tmpId id of the temporarily created row
     */
    function cancel(tmpId : string){
        let row = document.getElementById(tmpId);
        row.parentElement.removeChild(row);
    }

    /**
     * Sending the add API call
     * @param tmpId id of the temporarily created row
     */
    function add(tmpId : string){
        let row = document.getElementById(tmpId);
        let input = row.querySelector("#SessionName") as HTMLInputElement;
        let name = input.value;

        let json = {
            "Session.Name": name
        };
        
        let query = "/Home/AddSession";
        fetch(query, {
            method: "post",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: jsonToFormData(json)
        }).then((response) => {
            if(!response.ok && !response.redirected){
                alert(response);
                throw new Error(response.status.toString());
            } else return response;
        }).then(x => { return x.json() }).then((data) => {
            console.log(data);
            createRow(tmpId, data);
            cancel(tmpId);
        });
    }

    /**
     * Creating the row itself on the front-end side
     * @param tmpId{string} id of the temporarily created row
     * @param {{id: number, name: string, groupInventories}} data json response of the newly created session
     */
    function createRow(tmpId, data) : void{
        let row = document.getElementById(tmpId);
        let num : number = getNewNum();
        
        // Creating the outer box
        let div = document.createElement("div") as HTMLDivElement;
        div.classList.add("position-relative", "bg-dark", "rounded-0", "p-3");
        div.id = "session-" + data.id;
        //div.href = `/Home/Index/${data["id"]}`;
        
        // Creating the number on the top right
        let span = document.createElement("SPAN");
        span.classList.add("text-muted", "p-2", "top-0", "end-0", "position-absolute", "sessionNum");
        span.innerHTML = `#${num.toString()}`;
        
        // Creating the name text
        let a = document.createElement("a");
        a.href = "/Home/Index/" + data.id.toString();
        a.innerHTML = data["name"];
        a.id = "anchor";

        
        // Create session invite button
        let inviteButton = document.createElement("button") as HTMLButtonElement;
        inviteButton.classList.add("btn", "btn-link", "bottom-0", "px-2", "py-0", "end-0", "position-absolute");
        inviteButton.type = "button";
        inviteButton.addEventListener("click", function (){Invite.create(data.id)});
        inviteButton.id = "createInvitationLinkButton-" + data.id;
        inviteButton.textContent = "Create Invitation Link";
        inviteButton.style.outlineColor = "black";
        inviteButton.style.outlineWidth = "1";
        inviteButton.setAttribute("data-bs-target", "#inviteModal");
        inviteButton.setAttribute("data-bs-toggle", "modal");
        
        
        
        div.appendChild(span);
        div.appendChild(inviteButton);
        div.appendChild(a);
        

        row.before(div);
    }
    
    
    function getNewNum() : number{
        if (!document.getElementsByClassName("sessionNum"))
            return 1;
        
        let numsDivs = document.getElementsByClassName("sessionNum") as HTMLCollectionOf<HTMLDivElement>;
        let num = 1;
        for (let i = 0; i < numsDivs.length; i++) {
            const div = numsDivs[i] as HTMLElement;
            let tmpNum = parseInt(div.innerHTML.replace(/\D/g,''));
            num = tmpNum + 1;
        }
        return num;
    }
    
    // Here you can set what to be public
    return {
        // Name             : Function
        init
    };
})();