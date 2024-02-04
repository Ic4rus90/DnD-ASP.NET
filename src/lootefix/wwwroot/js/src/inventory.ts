let Inventory = (function () {

    let Attributes = {
        name: {
            id: "GroupInventory.Name",
            jsID: "groupInventoryName",
            type: String,
            placeholder: "Inventory name",
            min: 1,
            max: 45,
            required: true
        },
        sessionId: {
            id: "GroupInventory.SessionId",
            jsID: "groupInventorySessionId",
            type: Number,
            placeholder: "Value",
            // max: 45,
            // min: 10,
            required: true
        }
    }

    /**
     * list of all inventory tables
     */
    let inventories : HTMLCollectionOf<Element>;
    
    /**
     * The inventory in focus
     */
    let focusInventory : { elm: Element, id : string } = {elm: null, id: ""};

    /**
     * Id of the session
     */
    let sessionId : string;
    
    
    // Init for this function
    function init() {
        // Return if no groupInventory id was found
        if (!document.getElementById("groupInventory"))
            return;
        
        if (document.getElementsByClassName("inventory").length > 0) {
            inventories = document.getElementsByClassName("inventory");
            focusInventory["elm"] = inventories[0];
            focusInventory["id"] = focusInventory.elm.getAttribute("data-giid");
        }

        // Set event for switching tab
        // https://getbootstrap.com/docs/5.2/components/navs-tabs/#events
        if(document.querySelectorAll('button[data-bs-toggle="pill"]')){
            let tabs = document.querySelectorAll('button[data-bs-toggle="pill"]');
            for (let i = 0; i < tabs.length; i++) {
                tabs[i].addEventListener('shown.bs.tab', e => {
                    let bsTarget = tabs[i].getAttribute("data-bs-target")
                    focusInventory.elm = document.querySelector(bsTarget);
                    focusInventory.id = focusInventory.elm.getAttribute("data-giid");
                })
            }
        }
        
        // Event for adding inventory
        if (document.getElementById("addInventoryButton")){
            let addButton = document.getElementById("addInventoryButton") as HTMLButtonElement;
            addButton.addEventListener("click", addInventory);
            if (addButton.hasAttribute("data-session-id"))
                sessionId = addButton.getAttribute("data-session-id");
        }

        // Set event listener to new item button
        if (document.getElementById("newItem")) {
            let newItems = document.querySelectorAll("#newItem");
            for (let i = 0; i < newItems.length; i++) {
                newItems[i].addEventListener("click", Item.addItem);
            }
        }
        
        // Events for deleting inventory
        if (document.getElementById("deleteInventoryButton")) {
            let buttons = document.querySelectorAll("#deleteInventoryButton");
            for (let i = 0; i < buttons.length; i++) {
                buttons[i].addEventListener("click", function (e){
                    let id = buttons[i].getAttribute("data-inventoryId");
                    del(id);
                });
            }
        }

        // Init items
        Item.init();

        // Init funds
        Funds.init();
    }
    
    
    function addInventory(){
        let addInventoryButton = document.getElementById("addInventoryButton");

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
        input.placeholder = "Name your inventory...";
        input.id = Attributes["name"]["jsID"];

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

        addInventoryButton.before(div);
    }

    /**
     * Cancelling creation of inventory
     * @param tmpId id of the temporarily created row
     */
    function cancel(tmpId : string){
        let row = document.getElementById(tmpId);
        row.parentElement.removeChild(row);
    }

    /**
     * Sending the delete API call
     */
    function del(inventoryId){
        let json = {
            "Id": inventoryId
        };

        let query = "/Home/DeleteGroupInventory";
        fetch(query, {
            method: "delete",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: jsonToFormData(json)
        }).then((response) => {
            if(!response.ok && !response.redirected){
                alert(response);
                throw new Error(response.status.toString());
            } else return response;
        }).then((data) => {
            let inventoryTab = document.getElementById(`v-pills-${inventoryId}-tab`);
            let inventoryContent = document.getElementById(`v-pills-${inventoryId}`);
            let modalBackdrop = document.getElementsByClassName("modal-backdrop");
            inventoryContent.parentElement.removeChild(inventoryContent);
            inventoryTab.parentElement.removeChild(inventoryTab);
            for (let i = 0; i < modalBackdrop.length; i++) {
                modalBackdrop[i].parentElement.removeChild(modalBackdrop[i]);
            }
        });
    }

    /**
     * Sending the add API call
     * @param tmpId id of the temporarily created row
     */
    function add(tmpId : string){
        let row = document.getElementById(tmpId);
        let input = row.querySelector(`#${Attributes.name.jsID}`) as HTMLInputElement;
        let name = input.value;

        let json = {
            [Attributes.name.id]: name,
            [Attributes.sessionId.id]: sessionId
        };

        let query = "/Home/AddGroupInventory";
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
            createInventory(tmpId, data);
            cancel(tmpId);
        });
    }

    /**
     * Creating the row itself on the front-end side
     * @param tmpId{string} id of the temporarily created row
     * @param {{id: number, name: string, groupInventories}} data json response of the newly created session
     */
    function createInventory(tmpId, data) : void{
        let row = document.getElementById(tmpId);
        let inventories = document.getElementById("v-pills-tabContent");
        
        // Creating the selection button
        let button = document.createElement("BUTTON") as HTMLButtonElement;
        button.id = `v-pills-${data["id"]}-tab`;
        button.classList.add("nav-link");
        button.type = "button";
        button.setAttribute("data-bs-toggle", "pill");
        button.setAttribute("data-bs-target", `#v-pills-${data["id"]}`);
        button.setAttribute("role", "tab");
        button.innerHTML = data["name"];
        

        row.before(button);
        
        // Creating the inventory table
        let div = document.createElement("DIV");
        div.id = `v-pills-${data["id"]}`;
        div.classList.add("tab-pane", "inventory");
        div.setAttribute("data-giid", data["id"]);
        div.setAttribute("role", "tabpanel");
        // Her bruker jeg innerHTML istedenfor å skrive 2000 linjer med kode
        div.innerHTML = `<div class="modal fade" id="deleteModal-${data["id"]}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                             <div class="modal-dialog modal-dialog-centered">
                                 <div class="modal-content">
                                     <div class="modal-header">
                                         <h1 class="modal-title fs-5" id="exampleModalLabel">Delete ${data["name"]}</h1>
                                         <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                     </div>
                                     <div class="modal-body">
                                         Are you sure you want to delete ${data["name"]} ?<br/>
                                         Once it's gone, it's long gone...
                                     </div>
                                     <div class="modal-footer">
                                         <button type="button" class="btn btn-dark3" data-bs-dismiss="modal">Close</button>
                                         <button type="button" id="deleteInventoryButton" class="btn btn-red" data-inventoryId="${data["id"]}">Delete</button>
                                     </div>
                                 </div>
                             </div>
                         </div>
                         
                         <div class="position-relative">
                             <a class="cursor-pointer text-red position-absolute p-0 bottom-0 end-0" data-bs-toggle="modal" data-bs-target="#deleteModal-${data["id"]}">Delete inventory</a>
                             <h1 class="old-english text-brown">${data["name"]}</h1>
                         </div>
                         <div id="fundsBox-${data["id"]}" class="mb-2 p-3 bg-dark1 fundsBox shadow" data-inventoryid="${data["id"]}">
                             <div id="activeFunds" class="d-inline-flex">
                                 <p id="goldFunds" class="me-2 mb-0" style="color: darkgoldenrod" data-funds-amount="0">
                                     <svg style="vertical-align: baseline" xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-coin" viewBox="0 0 16 16">
                                         <path d="M5.5 9.511c.076.954.83 1.697 2.182 1.785V12h.6v-.709c1.4-.098 2.218-.846 2.218-1.932 0-.987-.626-1.496-1.745-1.76l-.473-.112V5.57c.6.068.982.396 1.074.85h1.052c-.076-.919-.864-1.638-2.126-1.716V4h-.6v.719c-1.195.117-2.01.836-2.01 1.853 0 .9.606 1.472 1.613 1.707l.397.098v2.034c-.615-.093-1.022-.43-1.114-.9H5.5zm2.177-2.166c-.59-.137-.91-.416-.91-.836 0-.47.345-.822.915-.925v1.76h-.005zm.692 1.193c.717.166 1.048.435 1.048.91 0 .542-.412.914-1.135.982V8.518l.087.02z"></path>
                                         <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"></path>
                                         <path d="M8 13.5a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11zm0 .5A6 6 0 1 0 8 2a6 6 0 0 0 0 12z"></path>
                                     </svg>
                                     <x>0</x>
                                 </p>
                                 <p id="silverFunds" class="me-2 mb-0" style="color: silver" data-funds-amount="0">
                                     <svg style="vertical-align: baseline" xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-coin" viewBox="0 0 16 16">
                                         <path d="M5.5 9.511c.076.954.83 1.697 2.182 1.785V12h.6v-.709c1.4-.098 2.218-.846 2.218-1.932 0-.987-.626-1.496-1.745-1.76l-.473-.112V5.57c.6.068.982.396 1.074.85h1.052c-.076-.919-.864-1.638-2.126-1.716V4h-.6v.719c-1.195.117-2.01.836-2.01 1.853 0 .9.606 1.472 1.613 1.707l.397.098v2.034c-.615-.093-1.022-.43-1.114-.9H5.5zm2.177-2.166c-.59-.137-.91-.416-.91-.836 0-.47.345-.822.915-.925v1.76h-.005zm.692 1.193c.717.166 1.048.435 1.048.91 0 .542-.412.914-1.135.982V8.518l.087.02z"></path>
                                         <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"></path>
                                         <path d="M8 13.5a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11zm0 .5A6 6 0 1 0 8 2a6 6 0 0 0 0 12z"></path>
                                     </svg>
                                     <x>0</x>
                                 </p>
                                 <p id="copperFunds" class="me-2 mb-0" style="color: #622F22" data-funds-amount="0">
                                     <svg style="vertical-align: baseline" xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-coin" viewBox="0 0 16 16">
                                         <path d="M5.5 9.511c.076.954.83 1.697 2.182 1.785V12h.6v-.709c1.4-.098 2.218-.846 2.218-1.932 0-.987-.626-1.496-1.745-1.76l-.473-.112V5.57c.6.068.982.396 1.074.85h1.052c-.076-.919-.864-1.638-2.126-1.716V4h-.6v.719c-1.195.117-2.01.836-2.01 1.853 0 .9.606 1.472 1.613 1.707l.397.098v2.034c-.615-.093-1.022-.43-1.114-.9H5.5zm2.177-2.166c-.59-.137-.91-.416-.91-.836 0-.47.345-.822.915-.925v1.76h-.005zm.692 1.193c.717.166 1.048.435 1.048.91 0 .542-.412.914-1.135.982V8.518l.087.02z"></path>
                                         <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"></path>
                                         <path d="M8 13.5a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11zm0 .5A6 6 0 1 0 8 2a6 6 0 0 0 0 12z"></path>
                                     </svg>
                                     <x>0</x>
                                 </p>
                             </div>
                             <div class="mt-3">
                                 <i class="text-muted">Add or subtract to inventory funds</i>
                                 <div id="addFundsBox" class="d-flex">
                                     <div class="form-floating">
                                         <input class="form-control" id="gold" placeholder="0" size="4" name="gold">
                                         <label class="form-label" for="gold">
                                             <svg style="vertical-align: baseline;color: darkgoldenrod" xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-coin" viewBox="0 0 16 16">
                                                 <path d="M5.5 9.511c.076.954.83 1.697 2.182 1.785V12h.6v-.709c1.4-.098 2.218-.846 2.218-1.932 0-.987-.626-1.496-1.745-1.76l-.473-.112V5.57c.6.068.982.396 1.074.85h1.052c-.076-.919-.864-1.638-2.126-1.716V4h-.6v.719c-1.195.117-2.01.836-2.01 1.853 0 .9.606 1.472 1.613 1.707l.397.098v2.034c-.615-.093-1.022-.43-1.114-.9H5.5zm2.177-2.166c-.59-.137-.91-.416-.91-.836 0-.47.345-.822.915-.925v1.76h-.005zm.692 1.193c.717.166 1.048.435 1.048.91 0 .542-.412.914-1.135.982V8.518l.087.02z"></path>
                                                 <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"></path>
                                                 <path d="M8 13.5a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11zm0 .5A6 6 0 1 0 8 2a6 6 0 0 0 0 12z"></path>
                                             </svg>
                                             <x>Gold</x>
                                         </label>
                                     </div>
                                     <div class="form-floating">
                                         <input class="form-control" id="silver" placeholder="0" size="4" name="silver">
                                         <label class="form-label" for="silver">
                                             <svg style="vertical-align: baseline;color: silver" xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-coin" viewBox="0 0 16 16">
                                                 <path d="M5.5 9.511c.076.954.83 1.697 2.182 1.785V12h.6v-.709c1.4-.098 2.218-.846 2.218-1.932 0-.987-.626-1.496-1.745-1.76l-.473-.112V5.57c.6.068.982.396 1.074.85h1.052c-.076-.919-.864-1.638-2.126-1.716V4h-.6v.719c-1.195.117-2.01.836-2.01 1.853 0 .9.606 1.472 1.613 1.707l.397.098v2.034c-.615-.093-1.022-.43-1.114-.9H5.5zm2.177-2.166c-.59-.137-.91-.416-.91-.836 0-.47.345-.822.915-.925v1.76h-.005zm.692 1.193c.717.166 1.048.435 1.048.91 0 .542-.412.914-1.135.982V8.518l.087.02z"></path>
                                                 <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"></path>
                                                 <path d="M8 13.5a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11zm0 .5A6 6 0 1 0 8 2a6 6 0 0 0 0 12z"></path>
                                             </svg>
                                             <x>Silver</x>
                                         </label>
                                     </div>
                                     <div class="form-floating">
                                         <input class="form-control" id="copper" placeholder="0" size="4" name="copper">
                                         <label class="form-label" for="copper">
                                             <svg style="vertical-align: baseline;color: #622F22" xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-coin" viewBox="0 0 16 16">
                                                 <path d="M5.5 9.511c.076.954.83 1.697 2.182 1.785V12h.6v-.709c1.4-.098 2.218-.846 2.218-1.932 0-.987-.626-1.496-1.745-1.76l-.473-.112V5.57c.6.068.982.396 1.074.85h1.052c-.076-.919-.864-1.638-2.126-1.716V4h-.6v.719c-1.195.117-2.01.836-2.01 1.853 0 .9.606 1.472 1.613 1.707l.397.098v2.034c-.615-.093-1.022-.43-1.114-.9H5.5zm2.177-2.166c-.59-.137-.91-.416-.91-.836 0-.47.345-.822.915-.925v1.76h-.005zm.692 1.193c.717.166 1.048.435 1.048.91 0 .542-.412.914-1.135.982V8.518l.087.02z"></path>
                                                 <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"></path>
                                                 <path d="M8 13.5a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11zm0 .5A6 6 0 1 0 8 2a6 6 0 0 0 0 12z"></path>
                                             </svg>
                                             <x>Copper</x>
                                         </label>
                                     </div>
                                     <button class="btn btn-outline-blue" id="addFunds" type="submit" data-id="lootefix.Models.GroupFund">Add</button>
                                     <button class="btn btn-outline-brown" id="removeFunds" type="submit">Subtract</button>
                                 </div>
                             </div>
                         </div>
                         <table id="inventory-${data["id"]}" class="table" data-giid="${data["id"]}">
                             <thead>
                             <tr>
                                 <th scope="col">Name</th>
                                 <th scope="col">Value</th>
                                 <th scope="col">Rarity</th>
                                 <th scope="col">Type</th>
                                 <th scope="col">Charges</th>
                                 <th scope="col"></th>
                             </tr>
                             </thead>
                             <tbody></tbody>
                         </table>
                         <div>
                             <button id="newItem" data-giid="${data["id"]}" class="btn btn-dark1 rounded-circle d-block m-auto" style="width: 40px; height: 40px">
                                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-lg" viewBox="0 0 16 16">
                                     <path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"/>
                                 </svg>
                             </button>
                         </div>`;
        inventories.appendChild(div);

        button.addEventListener('shown.bs.tab', e => {
            focusInventory.elm = div;
            focusInventory.id = data["id"];
        });
        
        // Init add item event
        let newItem = div.querySelector("#newItem");
        newItem.addEventListener("click", Item.addItem);
        
        // Init delete inventory event
        let deleteModalConfirmation = document.getElementById(`deleteModal-${data["id"]}`);
        let deleteInventoryButton = deleteModalConfirmation.querySelector("#deleteInventoryButton");
        deleteInventoryButton.addEventListener("click", function (e){
            del(data["id"]);
        });
        
        // Init add funds event
        Funds.init(data["id"]);
    }
    
    
    // Here you can set what to be public
    return {
        // Name             : Function
        init,
        allInventories : inventories,
        focusInventory
    };
})();