let Item = (function () {

    /**
     * The item in focus
     */
    // let focusItem : { elm: Element, id : string } = {elm: null, id: ""};


    // Init for this function
    function init() {

        // Set event listeners to delete buttons
        if (document.getElementById("deleteButton")) {
            let deleteButtons = document.querySelectorAll("#deleteButton");
            for (let i = 0; i < deleteButtons.length; i++) {
                let id = deleteButtons[i].getAttribute("data-id");
                deleteButtons[i].addEventListener("click", function (e){confirmDelete(id, e)});
            }
        }

        // Set event listeners to edit buttons
        if (document.getElementById("editButton")) {
            let editButton = document.getElementById("editButton");
            editButton.addEventListener("click", function (){editItem()});
        }
        
        // Set event listener to edit save button
        let editDetailDiv = document.getElementById("editItemDetails");
        let saveEditButton = editDetailDiv.querySelector("#saveButton");
        saveEditButton.addEventListener("click", function (){edit()});
        
        // Set event for dropdowns
        let editRarity = editDetailDiv.querySelector("#itemRarity");
        changeDropdownButton(editRarity);
        let editItemType = editDetailDiv.querySelector("#itemType");
        changeDropdownButton(editItemType);
        
        // Set event for cancel edit button
        let editCancelButton = editDetailDiv.querySelector("#cancelButton");
        editCancelButton.addEventListener("click", function (){cancelEdit()});
        
        // Set event listener to add save button
        let addDetailDiv = document.getElementById("addItemDetails");
        let saveAddButton = addDetailDiv.querySelector("#saveButton");
        saveAddButton.addEventListener("click", function (){add()});

        // Set event for dropdowns
        let addRarity = addDetailDiv.querySelector("#itemRarity");
        changeDropdownButton(addRarity);
        let addItemType = addDetailDiv.querySelector("#itemType");
        changeDropdownButton(addItemType);

        // Set event for cancel edit button
        let addCancelButton = addDetailDiv.querySelector("#cancelButton");
        addCancelButton.addEventListener("click", function (){hide()});
        
        
        // Set focus item to the first element
        if (document.getElementsByClassName("item").length > 0){
            let items = document.getElementsByClassName("item");
            let id = items[0].id.replace(/\D/g,'');
            for (let i = 0; i < items.length; i++) {
                let nameDiv = items[i].querySelector(".btn-link");
                nameDiv.addEventListener("click", function (){
                    let id = items[i].id.replace(/\D/g,'');
                    showDetails(id);
                });
            }
        }
    }

    /**
     * Function to get item values given an id
     * @param id
     */
    function getDetails(id: string){
        if (!document.getElementById(`item-id-${id}`))
            return {};
        
        console.log(id);
        let item = {};
        let row = document.getElementById(`item-id-${id}`);
        console.log(row);
        
        // Getting name
        item["name"] = row.querySelector("#Item\\.Name").textContent;
        // Getting value
        item["value"] = row.querySelector("#Item\\.Value").textContent;
        // Getting rarity
        item["rarity"] = row.querySelector("#Item\\.Rarity").textContent;
        // Getting type
        item["type"] = row.querySelector("#Item\\.ItemType").textContent;
        // Getting charges
        item["charges"] = row.querySelector("#Item\\.Charges").textContent;
        // Getting description
        item["description"] = decodeURIComponent(row.getAttribute("data-item-information"));
        
        return item;
    }
    
    function showDetails(id: string){
        let showDetailDiv = document.getElementById("showItemDetails");
        let editDetailDiv = document.getElementById("editItemDetails");
        let addDetailDiv = document.getElementById("addItemDetails");
        let detailDiv = document.getElementById("itemDetails");
        
        let charges = showDetailDiv.querySelector("#itemCharges").querySelector("x");
        let value = showDetailDiv.querySelector("#itemValue").querySelector("x");
        let name = showDetailDiv.querySelector("#itemName");
        let description = showDetailDiv.querySelector("#itemDescription");
        let rarity = showDetailDiv.querySelector("#itemRarity");
        let itemType = showDetailDiv.querySelector("#itemType");
        
        let item = getDetails(id);
        charges.innerHTML = item["charges"];
        value.innerHTML = item["value"];
        description.innerHTML = item["description"].replaceAll("&#xA;", "<br>"); // &#xA; er aspnet sin versjon av newline
        name.innerHTML = item["name"];
        rarity.innerHTML = item["rarity"];
        itemType.innerHTML = item["type"];
        editDetailDiv.setAttribute("data-id", id);

        detailDiv.classList.remove("d-none");
        showDetailDiv.classList.remove("d-none");
        editDetailDiv.classList.add("d-none");
        addDetailDiv.classList.add("d-none");
    }

    /**
     * Function to edit an item
     */
    function editItem(){
        let showDetailDiv = document.getElementById("showItemDetails");
        let editDetailDiv = document.getElementById("editItemDetails");
        let addDetailDiv = document.getElementById("addItemDetails");
        
        let itemId = editDetailDiv.getAttribute("data-id");

        let charges = editDetailDiv.querySelector("#itemCharges") as HTMLInputElement;
        let value = editDetailDiv.querySelector("#itemValue") as HTMLInputElement;
        let name = editDetailDiv.querySelector("#itemName") as HTMLInputElement;
        let description = editDetailDiv.querySelector("#itemDescription") as HTMLTextAreaElement;
        let rarity = editDetailDiv.querySelector("#itemRarity").querySelector("button");
        let rarityOptions = editDetailDiv.querySelector("#itemRarity").getElementsByClassName("dropdown-item");
        let itemType = editDetailDiv.querySelector("#itemType").querySelector("button");
        let itemTypeOptions = editDetailDiv.querySelector("#itemType").getElementsByClassName("dropdown-item");
        
        let item = getDetails(itemId);
        charges.value = item["charges"];
        value.value = item["value"];
        name.value = item["name"];
        description.value = item["description"];
        for (let i = 0; i < rarityOptions.length; i++) {
            if (item["rarity"].toLowerCase().trim() === rarityOptions[i].innerHTML.toLowerCase().trim()){
                rarity.innerHTML = rarityOptions[i].innerHTML.trim();
                break;
            }
        }
        for (let i = 0; i < itemTypeOptions.length; i++) {
            if (item["type"].toLowerCase().trim() === itemTypeOptions[i].innerHTML.toLowerCase().trim()){
                itemType.innerHTML = itemTypeOptions[i].innerHTML.trim();
                break;
            }
        }
        
        editDetailDiv.classList.remove("d-none");
        addDetailDiv.classList.add("d-none");
        showDetailDiv.classList.add("d-none");
    }
    
    /**
     * Function to add an item
     */
    function addItem() {
        let detailDiv = document.getElementById("itemDetails");
        let showDetailDiv = document.getElementById("showItemDetails");
        let editDetailDiv = document.getElementById("editItemDetails");
        let addDetailDiv = document.getElementById("addItemDetails");


        detailDiv.classList.remove("d-none");
        editDetailDiv.classList.add("d-none");
        addDetailDiv.classList.remove("d-none");
        showDetailDiv.classList.add("d-none");
    }

    function cancelEdit(){
        let editDetailDiv = document.getElementById("editItemDetails");
        let itemId = editDetailDiv.getAttribute("data-id");
        
        showDetails(itemId);
    }

    function cancelAdd(){
        let addDetailDiv = document.getElementById("addItemDetails");
        let itemId = addDetailDiv.getAttribute("data-id");

        showDetails(itemId);
    }
    
    function hide(){
        let detailDiv = document.getElementById("itemDetails");
        let showDetailDiv = document.getElementById("showItemDetails");
        let editDetailDiv = document.getElementById("editItemDetails");
        let addDetailDiv = document.getElementById("addItemDetails");



        editDetailDiv.classList.add("d-none");
        addDetailDiv.classList.add("d-none");
        showDetailDiv.classList.add("d-none");
        detailDiv.classList.add("d-none");
    }

    // Add an item
    function add(){
        let addDetailDiv = document.getElementById("addItemDetails");

        // Getting all the elements from the edit section
        let charges = addDetailDiv.querySelector("#itemCharges") as HTMLInputElement;
        let value = addDetailDiv.querySelector("#itemValue") as HTMLInputElement;
        let name = addDetailDiv.querySelector("#itemName") as HTMLInputElement;
        let description = addDetailDiv.querySelector("#itemDescription") as HTMLTextAreaElement;
        let rarity = addDetailDiv.querySelector("#itemRarity").querySelector("button");
        let itemType = addDetailDiv.querySelector("#itemType").querySelector("button");

        // Building the body request
        let json = {};
        json["Item.GroupInventoryId"] = Inventory.focusInventory.id;
        json["Item.Charges"] = charges.value;
        json["Item.Value"] = value.value;
        json["Item.Name"] = name.value;
        json["Item.Description"] = description.value;
        json["Item.Rarity"] = rarity.textContent.trim();
        json["Item.ItemType"] = itemType.textContent.trim();

        if (json["Item.ItemType"] === "Item Type"){
            json["Item.ItemType"] = "Miscellaneous";
        }
        if (json["Item.Rarity"] === "Rarity"){
            json["Item.Rarity"] = "Non-magical";
        }

        let query = "/Home/Add";
        fetch(query, {
            method: "post",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: jsonToFormData(json)
        }).then((response) => {
            delete json["Item.GroupInventoryId"];
            if(!response.ok && !response.redirected){
                alert(response);
                throw new Error(response.status.toString());
            } else return response;
        }).then(x => { return x.json() }).then((data) => {
            let tbody = Inventory.focusInventory.elm.querySelector("tbody");
            let tr = document.createElement("TR");
            tr.id = `item-id-${data["id"]}`;
            tr.classList.add("item");
            tr.setAttribute("data-item-information", encodeURIComponent(json["Item.Description"]));
            
            // Creating name
            let thName = document.createElement("TH");
            thName.id = "Item.Name";
            thName.setAttribute("scope", "row");
            let aName = document.createElement("A");
            aName.classList.add("btn", "btn-link", "p-0");
            aName.innerHTML = json["Item.Name"];
            aName.addEventListener("click", function (){
                showDetails(data["id"]);
            });
            thName.appendChild(aName);
            tr.appendChild(thName);
            
            // Creating value
            let tdValue = document.createElement("TD");
            tdValue.id = "Item.Value";
            tdValue.innerHTML = json["Item.Value"];
            tr.appendChild(tdValue);
            
            // Creating rarity
            let tdRarity = document.createElement("TD");
            tdRarity.id = "Item.Rarity";
            tdRarity.innerHTML = json["Item.Rarity"];
            tr.appendChild(tdRarity);

            // Creating type
            let tdType = document.createElement("TD");
            tdType.id = "Item.ItemType";
            tdType.innerHTML = json["Item.ItemType"];
            tr.appendChild(tdType);

            // Creating charges
            let tdCharges = document.createElement("TD");
            tdCharges.id = "Item.Charges";
            tdCharges.innerHTML = json["Item.Charges"];
            tr.appendChild(tdCharges);

            // Creating the delete button
            let tdDeleteButton = document.createElement("TD");
            tdDeleteButton.classList.add("px-0");
            let deleteButton = document.createElement("BUTTON");
            deleteButton.id = "deleteButton";
            deleteButton.classList.add("btn", "p-0", "d-block");
            deleteButton.setAttribute("data-id", data["id"]);
            deleteButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16"><path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/></svg>`;
            deleteButton.addEventListener("click", function (e){confirmDelete(data["id"], e)});
            tdDeleteButton.appendChild(deleteButton);

            charges.value = "";
            value.value = "";
            name.value = "";
            description.value = "";
            rarity.innerHTML = "Rarity";
            itemType.innerHTML = "Item Type";
            
            tr.appendChild(tdDeleteButton);
            tbody.appendChild(tr);
            showDetails(data["id"]);
        });
    }

    /**
     * Confirmation before actually deleting
     * @param id id of the <tr> row to be deleted
     * @param e The click event itself
     */
    function confirmDelete(id: string, e){
        if (!document.getElementById(`item-id-${id}`))
            return;

        let row = document.getElementById(`item-id-${id}`);
        let deleteButton = row.querySelector("#deleteButton");
        let confirmButton = deleteButton.cloneNode(true) as HTMLButtonElement;
        confirmButton.id = "confirmDelete";
        confirmButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-exclamation-circle-fill" viewBox="0 0 16 16"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/></svg>`;
        confirmButton.classList.add("text-red");
        confirmButton.title = "Are you sure you want to delete this item?";
        e.stopPropagation();
        e.preventDefault();
        document.body.addEventListener("click", function (e){cancelDelete(id, e)}, {once: true});
        confirmButton.addEventListener("click", function (e){del(id)});

        // Hide delete button
        deleteButton.classList.add("d-none");

        // Creating confirmation button
        deleteButton.after(confirmButton);
    }

    /**
     * In case of abort of deletion
     * @param id id of the <tr> row to be deleted
     * @param e the event itself
     */
    function cancelDelete(id: string, e){
        if (!document.getElementById(`item-id-${id}`))
            return;

        let row = document.getElementById(`item-id-${id}`);
        let deleteButton = row.querySelector("#deleteButton");
        let confirmButton = row.querySelector("#confirmDelete");
        
        if (confirmButton.contains(e.target)){
            e.stopPropagation();
            return;
        }

        deleteButton.classList.remove("d-none");
        confirmButton.parentElement.removeChild(confirmButton);
    }

    // Delete an item
    function del(id: string){
        if (!document.getElementById(`item-id-${id}`))
            return;

        let row = document.getElementById(`item-id-${id}`);
        let query = "/Home/Delete";
        fetch(query, {
            method: "post",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `itemId=${id}`
        }).then((response) => {
            if(!response.ok && !response.redirected){
                alert(response);
                throw new Error(response.status.toString());
            } else return response;
        }).then(x => { return x.text() }).then((data) => {
            row.parentNode.removeChild(row);
        });
    }

    /**
     * Send an API call for editing an item
     */
    function edit(){
        let editDetailDiv = document.getElementById("editItemDetails");
        let id = editDetailDiv.getAttribute("data-id");
        
        let tbody = Inventory.focusInventory.elm.querySelector("tbody");
        
        let row = tbody.querySelector(`#item-id-${id}`);
        
        // Getting all the elements from the edit section
        let charges = editDetailDiv.querySelector("#itemCharges") as HTMLInputElement;
        let value = editDetailDiv.querySelector("#itemValue") as HTMLInputElement;
        let name = editDetailDiv.querySelector("#itemName") as HTMLInputElement;
        let description = editDetailDiv.querySelector("#itemDescription") as HTMLTextAreaElement;
        let rarity = editDetailDiv.querySelector("#itemRarity").querySelector("button");
        let itemType = editDetailDiv.querySelector("#itemType").querySelector("button");
        

        // Building the body request
        let json = {};
        json["Item.Id"] = id;
        json["Item.GroupInventoryId"] = Inventory.focusInventory.id;
        json["Item.Charges"] = charges.value;
        json["Item.Value"] = value.value;
        json["Item.Name"] = name.value;
        json["Item.Description"] = description.value;
        json["Item.Rarity"] = rarity.textContent.trim();
        json["Item.ItemType"] = itemType.textContent.trim();
        
        if (json["Item.ItemType"] === "Item Type"){
            json["Item.ItemType"] = "Miscellaneous";
        }
        if (json["Item.Rarity"] === "Rarity"){
            json["Item.Rarity"] = "Non-magical";
        }
        
        let query = "/Home/Edit";
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
        }).then(x => { return x.text() }).then((data) => {
            row.querySelector("#Item\\.Charges").innerHTML = json["Item.Charges"];
            row.querySelector("#Item\\.Value").innerHTML = json["Item.Value"];
            row.querySelector("#Item\\.Name").querySelector("A").innerHTML = json["Item.Name"];
            row.setAttribute("data-item-information", encodeURIComponent(json["Item.Description"]));
            row.querySelector("#Item\\.Rarity").innerHTML = json["Item.Rarity"];
            row.querySelector("#Item\\.ItemType").innerHTML = json["Item.ItemType"];
            showDetails(id);
        });
    }


    // Here you can set what to be public
    return {
        // Name             : Function
        init,
        editItem,
        addItem
    };
})();