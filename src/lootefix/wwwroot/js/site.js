var Funds = (function () {
    function init(inventoryId) {
        if (inventoryId === void 0) { inventoryId = null; }
        var fundBoxes;
        if (inventoryId === null)
            fundBoxes = document.querySelectorAll(".fundsBox");
        else
            fundBoxes = document.querySelectorAll("#fundsBox-".concat(inventoryId));
        var _loop_1 = function (i) {
            // If not Dungeon master
            if (!fundBoxes[i].querySelector("#addFundsBox"))
                return "continue";
            var inventoryId_1 = fundBoxes[i].getAttribute("data-inventoryId");
            var addFundsBox = fundBoxes[i].querySelector("#addFundsBox");
            // Event listener for gold input
            var goldInput = addFundsBox.querySelector("#gold");
            goldInput.addEventListener("keyup", function (e) {
                var label = goldInput.parentElement.querySelector("x");
                goldInput.value = goldInput.value.replace(/\D/g, '');
                if (goldInput.value === "") {
                    setLabel("gold", inventoryId_1);
                }
                else {
                    setLabel("gold", inventoryId_1, label.innerHTML = getFunds(inventoryId_1).gold + " ± " + goldInput.value);
                }
            });
            // Event listener for silver input
            var silverInput = addFundsBox.querySelector("#silver");
            silverInput.addEventListener("keyup", function (e) {
                silverInput.value = silverInput.value.replace(/\D/g, '');
                if (silverInput.value === "") {
                    setLabel("silver", inventoryId_1);
                }
                else {
                    setLabel("silver", inventoryId_1, getFunds(inventoryId_1).silver + " ± " + silverInput.value);
                }
            });
            // Event listener for copper input
            var copperInput = addFundsBox.querySelector("#copper");
            copperInput.addEventListener("keyup", function (e) {
                copperInput.value = copperInput.value.replace(/\D/g, '');
                if (copperInput.value === "") {
                    setLabel("copper", inventoryId_1);
                }
                else {
                    setLabel("copper", inventoryId_1, getFunds(inventoryId_1).copper + " ± " + copperInput.value);
                }
            });
            // Set event listener for adding funds
            var addFundsButton = fundBoxes[i].querySelector("#addFunds");
            addFundsButton.addEventListener("click", function () {
                add(inventoryId_1);
            });
            // Set event listener for subtracting funds
            var subtractFundsButton = fundBoxes[i].querySelector("#removeFunds");
            subtractFundsButton.addEventListener("click", function () {
                subtract(inventoryId_1);
            });
        };
        for (var i = 0; i < fundBoxes.length; i++) {
            _loop_1(i);
        }
    }
    /**
     * Function to change label of the coins
     * @param {('copper'|'silver'|'gold')} coinType
     * @param inventoryId
     * @param value
     */
    function setLabel(coinType, inventoryId, value) {
        if (value === void 0) { value = null; }
        if (!document.querySelector("#fundsBox-".concat(inventoryId)))
            return;
        var fundsBox = document.querySelector("#fundsBox-".concat(inventoryId));
        if (!fundsBox.querySelector("#addFundsBox"))
            return;
        if (value == null)
            value = capitalizeFirstLetter(coinType);
        var addFundsBox = fundsBox.querySelector("#addFundsBox");
        var input = addFundsBox.querySelector("#".concat(coinType));
        var label = input.parentElement.querySelector("x");
        label.innerHTML = value;
    }
    /**
     * Sending the add API call
     * @param inventoryId id of the inventory
     */
    function add(inventoryId) {
        var amount = getNewFunds(inventoryId);
        var json = {
            "GroupFund.Gold": amount.gold,
            "GroupFund.Silver": amount.silver,
            "GroupFund.Copper": amount.copper,
            "GroupFund.GroupInventoryId": inventoryId
        };
        var query = "/Funds/EditFunds";
        fetch(query, {
            method: "post",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: jsonToFormData(json)
        }).then(function (response) {
            if (!response.ok && !response.redirected) {
                alert(response);
                throw new Error(response.status.toString());
            }
            else
                return response;
        }).then(function (x) { return x.json(); }).then(function (data) {
            updateFunds(data, inventoryId);
            clearFields(inventoryId);
        });
    }
    /**
     * Sending the subtract API call
     * @param inventoryId id of the inventory
     */
    function subtract(inventoryId) {
        var amount = getNewFunds(inventoryId);
        var json = {
            "GroupFund.Gold": -amount.gold,
            "GroupFund.Silver": -amount.silver,
            "GroupFund.Copper": -amount.copper,
            "GroupFund.GroupInventoryId": inventoryId
        };
        var query = "/Funds/EditFunds";
        fetch(query, {
            method: "post",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: jsonToFormData(json)
        }).then(function (response) {
            if (!response.ok && !response.redirected) {
                alert(response);
                throw new Error(response.status.toString());
            }
            else
                return response;
        }).then(function (x) { return x.json(); }).then(function (data) {
            updateFunds(data, inventoryId);
            clearFields(inventoryId);
        });
    }
    function updateFunds(data, inventoryId) {
        if (!document.querySelector("#fundsBox-".concat(inventoryId)))
            return;
        var fundsBox = document.querySelector("#fundsBox-".concat(inventoryId));
        if (!fundsBox.querySelector("#activeFunds"))
            return;
        var activeFunds = fundsBox.querySelector("#activeFunds");
        // Getting gold
        var goldFunds = activeFunds.querySelector("#goldFunds");
        goldFunds.setAttribute("data-funds-amount", data.gold.toString());
        var gold = goldFunds.querySelector("x");
        gold.innerHTML = data.gold.toString();
        // Getting silver
        var silverFunds = activeFunds.querySelector("#silverFunds");
        silverFunds.setAttribute("data-funds-amount", data.silver.toString());
        var silver = silverFunds.querySelector("x");
        silver.innerHTML = data.silver.toString();
        // Getting copper
        var copperFunds = activeFunds.querySelector("#copperFunds");
        copperFunds.setAttribute("data-funds-amount", data.copper.toString());
        var copper = copperFunds.querySelector("x");
        copper.innerHTML = data.copper.toString();
    }
    function clearFields(inventoryId) {
        if (!document.querySelector("#fundsBox-".concat(inventoryId)))
            return;
        var fundsBox = document.querySelector("#fundsBox-".concat(inventoryId));
        if (!fundsBox.querySelector("#addFundsBox"))
            return;
        var addFundsBox = fundsBox.querySelector("#addFundsBox");
        // Getting gold
        var goldFunds = addFundsBox.querySelector("#gold");
        goldFunds.value = "";
        // Getting silver
        var silverFunds = addFundsBox.querySelector("#silver");
        silverFunds.value = "";
        // Getting copper
        var copperFunds = addFundsBox.querySelector("#copper");
        copperFunds.value = "";
        setLabel("copper", inventoryId);
        setLabel("silver", inventoryId);
        setLabel("gold", inventoryId);
    }
    function getFunds(inventoryId) {
        var amount = {
            copper: 0,
            silver: 0,
            gold: 0
        };
        if (!document.querySelector("#fundsBox-".concat(inventoryId)))
            return amount;
        var fundsBox = document.querySelector("#fundsBox-".concat(inventoryId));
        if (!fundsBox.querySelector("#activeFunds"))
            return amount;
        var activeFunds = fundsBox.querySelector("#activeFunds");
        // Getting gold
        var goldFunds = activeFunds.querySelector("#goldFunds");
        amount.gold = parseInt(goldFunds.getAttribute("data-funds-amount"));
        // Getting silver
        var silverFunds = activeFunds.querySelector("#silverFunds");
        amount.silver = parseInt(silverFunds.getAttribute("data-funds-amount"));
        // Getting copper
        var copperFunds = activeFunds.querySelector("#copperFunds");
        amount.copper = parseInt(copperFunds.getAttribute("data-funds-amount"));
        return amount;
    }
    function getNewFunds(inventoryId) {
        var amount = {
            copper: 0,
            silver: 0,
            gold: 0
        };
        if (!document.querySelector("#fundsBox-".concat(inventoryId)))
            return amount;
        var fundsBox = document.querySelector("#fundsBox-".concat(inventoryId));
        if (!fundsBox.querySelector("#addFundsBox"))
            return amount;
        var addFundsBox = fundsBox.querySelector("#addFundsBox");
        // Getting gold
        var goldFunds = addFundsBox.querySelector("#gold");
        amount.gold = isNumeric(goldFunds.value) ? parseInt(goldFunds.value) : 0;
        // Getting silver
        var silverFunds = addFundsBox.querySelector("#silver");
        amount.silver = isNumeric(silverFunds.value) ? parseInt(silverFunds.value) : 0;
        // Getting copper
        var copperFunds = addFundsBox.querySelector("#copper");
        amount.copper = isNumeric(copperFunds.value) ? parseInt(copperFunds.value) : 0;
        return amount;
    }
    // Here you can set what to be public
    return {
        // Name             : Function
        init: init
    };
})();
function jsonToFormData(data) {
    var result = [];
    for (var key in data) {
        result.push(encodeURIComponent(key) + "=" + encodeURIComponent(data[key]));
    }
    return result.join("&");
}
function changeDropdownButton(elm) {
    var button = elm.querySelector(".dropdown-toggle");
    var options = elm.querySelectorAll(".dropdown-item");
    var _loop_2 = function (i) {
        options[i].addEventListener("click", function () {
            button.innerHTML = options[i].textContent;
        });
    };
    for (var i = 0; i < options.length; i++) {
        _loop_2(i);
    }
}
/**
 * Function as replacement for !isNaN
 * @param str
 */
function isNumeric(str) {
    if (typeof str != "string")
        return false;
    return !isNaN(str) && !isNaN(parseFloat(str));
}
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
var Inventory = (function () {
    var Attributes = {
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
    };
    /**
     * list of all inventory tables
     */
    var inventories;
    /**
     * The inventory in focus
     */
    var focusInventory = { elm: null, id: "" };
    /**
     * Id of the session
     */
    var sessionId;
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
        if (document.querySelectorAll('button[data-bs-toggle="pill"]')) {
            var tabs_1 = document.querySelectorAll('button[data-bs-toggle="pill"]');
            var _loop_3 = function (i) {
                tabs_1[i].addEventListener('shown.bs.tab', function (e) {
                    var bsTarget = tabs_1[i].getAttribute("data-bs-target");
                    focusInventory.elm = document.querySelector(bsTarget);
                    focusInventory.id = focusInventory.elm.getAttribute("data-giid");
                });
            };
            for (var i = 0; i < tabs_1.length; i++) {
                _loop_3(i);
            }
        }
        // Event for adding inventory
        if (document.getElementById("addInventoryButton")) {
            var addButton = document.getElementById("addInventoryButton");
            addButton.addEventListener("click", addInventory);
            if (addButton.hasAttribute("data-session-id"))
                sessionId = addButton.getAttribute("data-session-id");
        }
        // Set event listener to new item button
        if (document.getElementById("newItem")) {
            var newItems = document.querySelectorAll("#newItem");
            for (var i = 0; i < newItems.length; i++) {
                newItems[i].addEventListener("click", Item.addItem);
            }
        }
        // Events for deleting inventory
        if (document.getElementById("deleteInventoryButton")) {
            var buttons_1 = document.querySelectorAll("#deleteInventoryButton");
            var _loop_4 = function (i) {
                buttons_1[i].addEventListener("click", function (e) {
                    var id = buttons_1[i].getAttribute("data-inventoryId");
                    del(id);
                });
            };
            for (var i = 0; i < buttons_1.length; i++) {
                _loop_4(i);
            }
        }
        // Init items
        Item.init();
        // Init funds
        Funds.init();
    }
    function addInventory() {
        var addInventoryButton = document.getElementById("addInventoryButton");
        // Creating div
        var div = document.createElement("DIV");
        div.classList.add("input-group", "rounded-0");
        // Creating an unique id for this row
        var tmpId = Random.makeid();
        div.id = tmpId;
        // Creating input
        var input = document.createElement("INPUT");
        input.classList.add("form-control");
        input.type = "text";
        input.placeholder = "Name your inventory...";
        input.id = Attributes["name"]["jsID"];
        // Creating add button
        var addButton = document.createElement("BUTTON");
        addButton.classList.add("btn", "btn-outline-green");
        addButton.type = "button";
        addButton.innerHTML = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-check-lg\" viewBox=\"0 0 16 16\"><path d=\"M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z\"/></svg>";
        addButton.addEventListener("click", function () { add(tmpId); });
        // Creating cancel button
        var cancelButton = document.createElement("BUTTON");
        cancelButton.classList.add("btn", "btn-outline-red");
        cancelButton.type = "button";
        cancelButton.innerHTML = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-x-lg\" viewBox=\"0 0 16 16\"><path d=\"M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z\"/></svg>";
        cancelButton.addEventListener("click", function () { cancel(tmpId); });
        div.appendChild(input);
        div.appendChild(addButton);
        div.appendChild(cancelButton);
        addInventoryButton.before(div);
    }
    /**
     * Cancelling creation of inventory
     * @param tmpId id of the temporarily created row
     */
    function cancel(tmpId) {
        var row = document.getElementById(tmpId);
        row.parentElement.removeChild(row);
    }
    /**
     * Sending the delete API call
     */
    function del(inventoryId) {
        var json = {
            "Id": inventoryId
        };
        var query = "/Home/DeleteGroupInventory";
        fetch(query, {
            method: "delete",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: jsonToFormData(json)
        }).then(function (response) {
            if (!response.ok && !response.redirected) {
                alert(response);
                throw new Error(response.status.toString());
            }
            else
                return response;
        }).then(function (data) {
            var inventoryTab = document.getElementById("v-pills-".concat(inventoryId, "-tab"));
            var inventoryContent = document.getElementById("v-pills-".concat(inventoryId));
            var modalBackdrop = document.getElementsByClassName("modal-backdrop");
            inventoryContent.parentElement.removeChild(inventoryContent);
            inventoryTab.parentElement.removeChild(inventoryTab);
            for (var i = 0; i < modalBackdrop.length; i++) {
                modalBackdrop[i].parentElement.removeChild(modalBackdrop[i]);
            }
        });
    }
    /**
     * Sending the add API call
     * @param tmpId id of the temporarily created row
     */
    function add(tmpId) {
        var _a;
        var row = document.getElementById(tmpId);
        var input = row.querySelector("#".concat(Attributes.name.jsID));
        var name = input.value;
        var json = (_a = {},
            _a[Attributes.name.id] = name,
            _a[Attributes.sessionId.id] = sessionId,
            _a);
        var query = "/Home/AddGroupInventory";
        fetch(query, {
            method: "post",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: jsonToFormData(json)
        }).then(function (response) {
            if (!response.ok && !response.redirected) {
                alert(response);
                throw new Error(response.status.toString());
            }
            else
                return response;
        }).then(function (x) { return x.json(); }).then(function (data) {
            createInventory(tmpId, data);
            cancel(tmpId);
        });
    }
    /**
     * Creating the row itself on the front-end side
     * @param tmpId{string} id of the temporarily created row
     * @param {{id: number, name: string, groupInventories}} data json response of the newly created session
     */
    function createInventory(tmpId, data) {
        var row = document.getElementById(tmpId);
        var inventories = document.getElementById("v-pills-tabContent");
        // Creating the selection button
        var button = document.createElement("BUTTON");
        button.id = "v-pills-".concat(data["id"], "-tab");
        button.classList.add("nav-link");
        button.type = "button";
        button.setAttribute("data-bs-toggle", "pill");
        button.setAttribute("data-bs-target", "#v-pills-".concat(data["id"]));
        button.setAttribute("role", "tab");
        button.innerHTML = data["name"];
        row.before(button);
        // Creating the inventory table
        var div = document.createElement("DIV");
        div.id = "v-pills-".concat(data["id"]);
        div.classList.add("tab-pane", "inventory");
        div.setAttribute("data-giid", data["id"]);
        div.setAttribute("role", "tabpanel");
        // Her bruker jeg innerHTML istedenfor å skrive 2000 linjer med kode
        div.innerHTML = "<div class=\"modal fade\" id=\"deleteModal-".concat(data["id"], "\" tabindex=\"-1\" aria-labelledby=\"exampleModalLabel\" aria-hidden=\"true\">\n                             <div class=\"modal-dialog modal-dialog-centered\">\n                                 <div class=\"modal-content\">\n                                     <div class=\"modal-header\">\n                                         <h1 class=\"modal-title fs-5\" id=\"exampleModalLabel\">Delete ").concat(data["name"], "</h1>\n                                         <button type=\"button\" class=\"btn-close\" data-bs-dismiss=\"modal\" aria-label=\"Close\"></button>\n                                     </div>\n                                     <div class=\"modal-body\">\n                                         Are you sure you want to delete ").concat(data["name"], " ?<br/>\n                                         Once it's gone, it's long gone...\n                                     </div>\n                                     <div class=\"modal-footer\">\n                                         <button type=\"button\" class=\"btn btn-dark3\" data-bs-dismiss=\"modal\">Close</button>\n                                         <button type=\"button\" id=\"deleteInventoryButton\" class=\"btn btn-red\" data-inventoryId=\"").concat(data["id"], "\">Delete</button>\n                                     </div>\n                                 </div>\n                             </div>\n                         </div>\n                         \n                         <div class=\"position-relative\">\n                             <a class=\"cursor-pointer text-red position-absolute p-0 bottom-0 end-0\" data-bs-toggle=\"modal\" data-bs-target=\"#deleteModal-").concat(data["id"], "\">Delete inventory</a>\n                             <h1 class=\"old-english text-brown\">").concat(data["name"], "</h1>\n                         </div>\n                         <div id=\"fundsBox-").concat(data["id"], "\" class=\"mb-2 p-3 bg-dark1 fundsBox shadow\" data-inventoryid=\"").concat(data["id"], "\">\n                             <div id=\"activeFunds\" class=\"d-inline-flex\">\n                                 <p id=\"goldFunds\" class=\"me-2 mb-0\" style=\"color: darkgoldenrod\" data-funds-amount=\"0\">\n                                     <svg style=\"vertical-align: baseline\" xmlns=\"http://www.w3.org/2000/svg\" width=\"14\" height=\"14\" fill=\"currentColor\" class=\"bi bi-coin\" viewBox=\"0 0 16 16\">\n                                         <path d=\"M5.5 9.511c.076.954.83 1.697 2.182 1.785V12h.6v-.709c1.4-.098 2.218-.846 2.218-1.932 0-.987-.626-1.496-1.745-1.76l-.473-.112V5.57c.6.068.982.396 1.074.85h1.052c-.076-.919-.864-1.638-2.126-1.716V4h-.6v.719c-1.195.117-2.01.836-2.01 1.853 0 .9.606 1.472 1.613 1.707l.397.098v2.034c-.615-.093-1.022-.43-1.114-.9H5.5zm2.177-2.166c-.59-.137-.91-.416-.91-.836 0-.47.345-.822.915-.925v1.76h-.005zm.692 1.193c.717.166 1.048.435 1.048.91 0 .542-.412.914-1.135.982V8.518l.087.02z\"></path>\n                                         <path d=\"M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z\"></path>\n                                         <path d=\"M8 13.5a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11zm0 .5A6 6 0 1 0 8 2a6 6 0 0 0 0 12z\"></path>\n                                     </svg>\n                                     <x>0</x>\n                                 </p>\n                                 <p id=\"silverFunds\" class=\"me-2 mb-0\" style=\"color: silver\" data-funds-amount=\"0\">\n                                     <svg style=\"vertical-align: baseline\" xmlns=\"http://www.w3.org/2000/svg\" width=\"14\" height=\"14\" fill=\"currentColor\" class=\"bi bi-coin\" viewBox=\"0 0 16 16\">\n                                         <path d=\"M5.5 9.511c.076.954.83 1.697 2.182 1.785V12h.6v-.709c1.4-.098 2.218-.846 2.218-1.932 0-.987-.626-1.496-1.745-1.76l-.473-.112V5.57c.6.068.982.396 1.074.85h1.052c-.076-.919-.864-1.638-2.126-1.716V4h-.6v.719c-1.195.117-2.01.836-2.01 1.853 0 .9.606 1.472 1.613 1.707l.397.098v2.034c-.615-.093-1.022-.43-1.114-.9H5.5zm2.177-2.166c-.59-.137-.91-.416-.91-.836 0-.47.345-.822.915-.925v1.76h-.005zm.692 1.193c.717.166 1.048.435 1.048.91 0 .542-.412.914-1.135.982V8.518l.087.02z\"></path>\n                                         <path d=\"M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z\"></path>\n                                         <path d=\"M8 13.5a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11zm0 .5A6 6 0 1 0 8 2a6 6 0 0 0 0 12z\"></path>\n                                     </svg>\n                                     <x>0</x>\n                                 </p>\n                                 <p id=\"copperFunds\" class=\"me-2 mb-0\" style=\"color: #622F22\" data-funds-amount=\"0\">\n                                     <svg style=\"vertical-align: baseline\" xmlns=\"http://www.w3.org/2000/svg\" width=\"14\" height=\"14\" fill=\"currentColor\" class=\"bi bi-coin\" viewBox=\"0 0 16 16\">\n                                         <path d=\"M5.5 9.511c.076.954.83 1.697 2.182 1.785V12h.6v-.709c1.4-.098 2.218-.846 2.218-1.932 0-.987-.626-1.496-1.745-1.76l-.473-.112V5.57c.6.068.982.396 1.074.85h1.052c-.076-.919-.864-1.638-2.126-1.716V4h-.6v.719c-1.195.117-2.01.836-2.01 1.853 0 .9.606 1.472 1.613 1.707l.397.098v2.034c-.615-.093-1.022-.43-1.114-.9H5.5zm2.177-2.166c-.59-.137-.91-.416-.91-.836 0-.47.345-.822.915-.925v1.76h-.005zm.692 1.193c.717.166 1.048.435 1.048.91 0 .542-.412.914-1.135.982V8.518l.087.02z\"></path>\n                                         <path d=\"M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z\"></path>\n                                         <path d=\"M8 13.5a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11zm0 .5A6 6 0 1 0 8 2a6 6 0 0 0 0 12z\"></path>\n                                     </svg>\n                                     <x>0</x>\n                                 </p>\n                             </div>\n                             <div class=\"mt-3\">\n                                 <i class=\"text-muted\">Add or subtract to inventory funds</i>\n                                 <div id=\"addFundsBox\" class=\"d-flex\">\n                                     <div class=\"form-floating\">\n                                         <input class=\"form-control\" id=\"gold\" placeholder=\"0\" size=\"4\" name=\"gold\">\n                                         <label class=\"form-label\" for=\"gold\">\n                                             <svg style=\"vertical-align: baseline;color: darkgoldenrod\" xmlns=\"http://www.w3.org/2000/svg\" width=\"14\" height=\"14\" fill=\"currentColor\" class=\"bi bi-coin\" viewBox=\"0 0 16 16\">\n                                                 <path d=\"M5.5 9.511c.076.954.83 1.697 2.182 1.785V12h.6v-.709c1.4-.098 2.218-.846 2.218-1.932 0-.987-.626-1.496-1.745-1.76l-.473-.112V5.57c.6.068.982.396 1.074.85h1.052c-.076-.919-.864-1.638-2.126-1.716V4h-.6v.719c-1.195.117-2.01.836-2.01 1.853 0 .9.606 1.472 1.613 1.707l.397.098v2.034c-.615-.093-1.022-.43-1.114-.9H5.5zm2.177-2.166c-.59-.137-.91-.416-.91-.836 0-.47.345-.822.915-.925v1.76h-.005zm.692 1.193c.717.166 1.048.435 1.048.91 0 .542-.412.914-1.135.982V8.518l.087.02z\"></path>\n                                                 <path d=\"M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z\"></path>\n                                                 <path d=\"M8 13.5a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11zm0 .5A6 6 0 1 0 8 2a6 6 0 0 0 0 12z\"></path>\n                                             </svg>\n                                             <x>Gold</x>\n                                         </label>\n                                     </div>\n                                     <div class=\"form-floating\">\n                                         <input class=\"form-control\" id=\"silver\" placeholder=\"0\" size=\"4\" name=\"silver\">\n                                         <label class=\"form-label\" for=\"silver\">\n                                             <svg style=\"vertical-align: baseline;color: silver\" xmlns=\"http://www.w3.org/2000/svg\" width=\"14\" height=\"14\" fill=\"currentColor\" class=\"bi bi-coin\" viewBox=\"0 0 16 16\">\n                                                 <path d=\"M5.5 9.511c.076.954.83 1.697 2.182 1.785V12h.6v-.709c1.4-.098 2.218-.846 2.218-1.932 0-.987-.626-1.496-1.745-1.76l-.473-.112V5.57c.6.068.982.396 1.074.85h1.052c-.076-.919-.864-1.638-2.126-1.716V4h-.6v.719c-1.195.117-2.01.836-2.01 1.853 0 .9.606 1.472 1.613 1.707l.397.098v2.034c-.615-.093-1.022-.43-1.114-.9H5.5zm2.177-2.166c-.59-.137-.91-.416-.91-.836 0-.47.345-.822.915-.925v1.76h-.005zm.692 1.193c.717.166 1.048.435 1.048.91 0 .542-.412.914-1.135.982V8.518l.087.02z\"></path>\n                                                 <path d=\"M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z\"></path>\n                                                 <path d=\"M8 13.5a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11zm0 .5A6 6 0 1 0 8 2a6 6 0 0 0 0 12z\"></path>\n                                             </svg>\n                                             <x>Silver</x>\n                                         </label>\n                                     </div>\n                                     <div class=\"form-floating\">\n                                         <input class=\"form-control\" id=\"copper\" placeholder=\"0\" size=\"4\" name=\"copper\">\n                                         <label class=\"form-label\" for=\"copper\">\n                                             <svg style=\"vertical-align: baseline;color: #622F22\" xmlns=\"http://www.w3.org/2000/svg\" width=\"14\" height=\"14\" fill=\"currentColor\" class=\"bi bi-coin\" viewBox=\"0 0 16 16\">\n                                                 <path d=\"M5.5 9.511c.076.954.83 1.697 2.182 1.785V12h.6v-.709c1.4-.098 2.218-.846 2.218-1.932 0-.987-.626-1.496-1.745-1.76l-.473-.112V5.57c.6.068.982.396 1.074.85h1.052c-.076-.919-.864-1.638-2.126-1.716V4h-.6v.719c-1.195.117-2.01.836-2.01 1.853 0 .9.606 1.472 1.613 1.707l.397.098v2.034c-.615-.093-1.022-.43-1.114-.9H5.5zm2.177-2.166c-.59-.137-.91-.416-.91-.836 0-.47.345-.822.915-.925v1.76h-.005zm.692 1.193c.717.166 1.048.435 1.048.91 0 .542-.412.914-1.135.982V8.518l.087.02z\"></path>\n                                                 <path d=\"M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z\"></path>\n                                                 <path d=\"M8 13.5a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11zm0 .5A6 6 0 1 0 8 2a6 6 0 0 0 0 12z\"></path>\n                                             </svg>\n                                             <x>Copper</x>\n                                         </label>\n                                     </div>\n                                     <button class=\"btn btn-outline-blue\" id=\"addFunds\" type=\"submit\" data-id=\"lootefix.Models.GroupFund\">Add</button>\n                                     <button class=\"btn btn-outline-brown\" id=\"removeFunds\" type=\"submit\">Subtract</button>\n                                 </div>\n                             </div>\n                         </div>\n                         <table id=\"inventory-").concat(data["id"], "\" class=\"table\" data-giid=\"").concat(data["id"], "\">\n                             <thead>\n                             <tr>\n                                 <th scope=\"col\">Name</th>\n                                 <th scope=\"col\">Value</th>\n                                 <th scope=\"col\">Rarity</th>\n                                 <th scope=\"col\">Type</th>\n                                 <th scope=\"col\">Charges</th>\n                                 <th scope=\"col\"></th>\n                             </tr>\n                             </thead>\n                             <tbody></tbody>\n                         </table>\n                         <div>\n                             <button id=\"newItem\" data-giid=\"").concat(data["id"], "\" class=\"btn btn-dark1 rounded-circle d-block m-auto\" style=\"width: 40px; height: 40px\">\n                                 <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-plus-lg\" viewBox=\"0 0 16 16\">\n                                     <path fill-rule=\"evenodd\" d=\"M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z\"/>\n                                 </svg>\n                             </button>\n                         </div>");
        inventories.appendChild(div);
        button.addEventListener('shown.bs.tab', function (e) {
            focusInventory.elm = div;
            focusInventory.id = data["id"];
        });
        // Init add item event
        var newItem = div.querySelector("#newItem");
        newItem.addEventListener("click", Item.addItem);
        // Init delete inventory event
        var deleteModalConfirmation = document.getElementById("deleteModal-".concat(data["id"]));
        var deleteInventoryButton = deleteModalConfirmation.querySelector("#deleteInventoryButton");
        deleteInventoryButton.addEventListener("click", function (e) {
            del(data["id"]);
        });
        // Init add funds event
        Funds.init(data["id"]);
    }
    // Here you can set what to be public
    return {
        // Name             : Function
        init: init,
        allInventories: inventories,
        focusInventory: focusInventory
    };
})();
var Invite = (function () {
    // Typescript code for handling of invitations
    function create(sessionId) {
        // Send POST request to CreateInvitationLink method in HomeController.
        var query = "/Home/CreateInvitationLink/";
        var bodyContent = 'Id='.concat(sessionId.toString());
        fetch(query, {
            method: "post",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: bodyContent
        }).then(function (response) {
            // Om responsen returnerer en feil, throw new error
            if (!response.ok && !response.redirected) {
                alert(response);
                throw new Error(response.status.toString());
            }
            else
                return response.json();
        }).then(function (x) { return x; }).then(function (data) {
            // Requesten er ok
            // Copy invite link to the clipboard
            copyDataToClipboard(data);
            // Show the notification
            showLinkNotification();
        });
    }
    // Litt inspirasjon hentet herfra: https://www.w3schools.com/howto/howto_js_snackbar.asp
    function showLinkNotification() {
        var newNotificationElement = document.createElement("div");
        newNotificationElement.id = "inviteLinkNotification";
        newNotificationElement.className = "display";
        newNotificationElement.textContent = "Invite link copied to clipboard";
        var bodyTag = document.body;
        bodyTag.append(newNotificationElement);
        setTimeout(function () { newNotificationElement.className = newNotificationElement.className.replace("display", ""); newNotificationElement.remove(); }, 2500);
    }
    function copyDataToClipboard(data) {
        navigator.clipboard.writeText(data).then(function () {
            console.log("Invite link: " + data + " copied to clipboard");
        }, function (err) {
            console.log("Invite link was not copied to clipboard");
        });
    }
    // Here you can set what to be public
    return {
        // Name             : Function
        create: create
    };
})();
var Item = (function () {
    /**
     * The item in focus
     */
    // let focusItem : { elm: Element, id : string } = {elm: null, id: ""};
    // Init for this function
    function init() {
        // Set event listeners to delete buttons
        if (document.getElementById("deleteButton")) {
            var deleteButtons = document.querySelectorAll("#deleteButton");
            var _loop_5 = function (i) {
                var id = deleteButtons[i].getAttribute("data-id");
                deleteButtons[i].addEventListener("click", function (e) { confirmDelete(id, e); });
            };
            for (var i = 0; i < deleteButtons.length; i++) {
                _loop_5(i);
            }
        }
        // Set event listeners to edit buttons
        if (document.getElementById("editButton")) {
            var editButton = document.getElementById("editButton");
            editButton.addEventListener("click", function () { editItem(); });
        }
        // Set event listener to edit save button
        var editDetailDiv = document.getElementById("editItemDetails");
        var saveEditButton = editDetailDiv.querySelector("#saveButton");
        saveEditButton.addEventListener("click", function () { edit(); });
        // Set event for dropdowns
        var editRarity = editDetailDiv.querySelector("#itemRarity");
        changeDropdownButton(editRarity);
        var editItemType = editDetailDiv.querySelector("#itemType");
        changeDropdownButton(editItemType);
        // Set event for cancel edit button
        var editCancelButton = editDetailDiv.querySelector("#cancelButton");
        editCancelButton.addEventListener("click", function () { cancelEdit(); });
        // Set event listener to add save button
        var addDetailDiv = document.getElementById("addItemDetails");
        var saveAddButton = addDetailDiv.querySelector("#saveButton");
        saveAddButton.addEventListener("click", function () { add(); });
        // Set event for dropdowns
        var addRarity = addDetailDiv.querySelector("#itemRarity");
        changeDropdownButton(addRarity);
        var addItemType = addDetailDiv.querySelector("#itemType");
        changeDropdownButton(addItemType);
        // Set event for cancel edit button
        var addCancelButton = addDetailDiv.querySelector("#cancelButton");
        addCancelButton.addEventListener("click", function () { hide(); });
        // Set focus item to the first element
        if (document.getElementsByClassName("item").length > 0) {
            var items_1 = document.getElementsByClassName("item");
            var id = items_1[0].id.replace(/\D/g, '');
            var _loop_6 = function (i) {
                var nameDiv = items_1[i].querySelector(".btn-link");
                nameDiv.addEventListener("click", function () {
                    var id = items_1[i].id.replace(/\D/g, '');
                    showDetails(id);
                });
            };
            for (var i = 0; i < items_1.length; i++) {
                _loop_6(i);
            }
        }
    }
    /**
     * Function to get item values given an id
     * @param id
     */
    function getDetails(id) {
        if (!document.getElementById("item-id-".concat(id)))
            return {};
        console.log(id);
        var item = {};
        var row = document.getElementById("item-id-".concat(id));
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
    function showDetails(id) {
        var showDetailDiv = document.getElementById("showItemDetails");
        var editDetailDiv = document.getElementById("editItemDetails");
        var addDetailDiv = document.getElementById("addItemDetails");
        var detailDiv = document.getElementById("itemDetails");
        var charges = showDetailDiv.querySelector("#itemCharges").querySelector("x");
        var value = showDetailDiv.querySelector("#itemValue").querySelector("x");
        var name = showDetailDiv.querySelector("#itemName");
        var description = showDetailDiv.querySelector("#itemDescription");
        var rarity = showDetailDiv.querySelector("#itemRarity");
        var itemType = showDetailDiv.querySelector("#itemType");
        var item = getDetails(id);
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
    function editItem() {
        var showDetailDiv = document.getElementById("showItemDetails");
        var editDetailDiv = document.getElementById("editItemDetails");
        var addDetailDiv = document.getElementById("addItemDetails");
        var itemId = editDetailDiv.getAttribute("data-id");
        var charges = editDetailDiv.querySelector("#itemCharges");
        var value = editDetailDiv.querySelector("#itemValue");
        var name = editDetailDiv.querySelector("#itemName");
        var description = editDetailDiv.querySelector("#itemDescription");
        var rarity = editDetailDiv.querySelector("#itemRarity").querySelector("button");
        var rarityOptions = editDetailDiv.querySelector("#itemRarity").getElementsByClassName("dropdown-item");
        var itemType = editDetailDiv.querySelector("#itemType").querySelector("button");
        var itemTypeOptions = editDetailDiv.querySelector("#itemType").getElementsByClassName("dropdown-item");
        var item = getDetails(itemId);
        charges.value = item["charges"];
        value.value = item["value"];
        name.value = item["name"];
        description.value = item["description"];
        for (var i = 0; i < rarityOptions.length; i++) {
            if (item["rarity"].toLowerCase().trim() === rarityOptions[i].innerHTML.toLowerCase().trim()) {
                rarity.innerHTML = rarityOptions[i].innerHTML.trim();
                break;
            }
        }
        for (var i = 0; i < itemTypeOptions.length; i++) {
            if (item["type"].toLowerCase().trim() === itemTypeOptions[i].innerHTML.toLowerCase().trim()) {
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
        var detailDiv = document.getElementById("itemDetails");
        var showDetailDiv = document.getElementById("showItemDetails");
        var editDetailDiv = document.getElementById("editItemDetails");
        var addDetailDiv = document.getElementById("addItemDetails");
        detailDiv.classList.remove("d-none");
        editDetailDiv.classList.add("d-none");
        addDetailDiv.classList.remove("d-none");
        showDetailDiv.classList.add("d-none");
    }
    function cancelEdit() {
        var editDetailDiv = document.getElementById("editItemDetails");
        var itemId = editDetailDiv.getAttribute("data-id");
        showDetails(itemId);
    }
    function cancelAdd() {
        var addDetailDiv = document.getElementById("addItemDetails");
        var itemId = addDetailDiv.getAttribute("data-id");
        showDetails(itemId);
    }
    function hide() {
        var detailDiv = document.getElementById("itemDetails");
        var showDetailDiv = document.getElementById("showItemDetails");
        var editDetailDiv = document.getElementById("editItemDetails");
        var addDetailDiv = document.getElementById("addItemDetails");
        editDetailDiv.classList.add("d-none");
        addDetailDiv.classList.add("d-none");
        showDetailDiv.classList.add("d-none");
        detailDiv.classList.add("d-none");
    }
    // Add an item
    function add() {
        var addDetailDiv = document.getElementById("addItemDetails");
        // Getting all the elements from the edit section
        var charges = addDetailDiv.querySelector("#itemCharges");
        var value = addDetailDiv.querySelector("#itemValue");
        var name = addDetailDiv.querySelector("#itemName");
        var description = addDetailDiv.querySelector("#itemDescription");
        var rarity = addDetailDiv.querySelector("#itemRarity").querySelector("button");
        var itemType = addDetailDiv.querySelector("#itemType").querySelector("button");
        // Building the body request
        var json = {};
        json["Item.GroupInventoryId"] = Inventory.focusInventory.id;
        json["Item.Charges"] = charges.value;
        json["Item.Value"] = value.value;
        json["Item.Name"] = name.value;
        json["Item.Description"] = description.value;
        json["Item.Rarity"] = rarity.textContent.trim();
        json["Item.ItemType"] = itemType.textContent.trim();
        if (json["Item.ItemType"] === "Item Type") {
            json["Item.ItemType"] = "Miscellaneous";
        }
        if (json["Item.Rarity"] === "Rarity") {
            json["Item.Rarity"] = "Non-magical";
        }
        var query = "/Home/Add";
        fetch(query, {
            method: "post",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: jsonToFormData(json)
        }).then(function (response) {
            delete json["Item.GroupInventoryId"];
            if (!response.ok && !response.redirected) {
                alert(response);
                throw new Error(response.status.toString());
            }
            else
                return response;
        }).then(function (x) { return x.json(); }).then(function (data) {
            var tbody = Inventory.focusInventory.elm.querySelector("tbody");
            var tr = document.createElement("TR");
            tr.id = "item-id-".concat(data["id"]);
            tr.classList.add("item");
            tr.setAttribute("data-item-information", encodeURIComponent(json["Item.Description"]));
            // Creating name
            var thName = document.createElement("TH");
            thName.id = "Item.Name";
            thName.setAttribute("scope", "row");
            var aName = document.createElement("A");
            aName.classList.add("btn", "btn-link", "p-0");
            aName.innerHTML = json["Item.Name"];
            aName.addEventListener("click", function () {
                showDetails(data["id"]);
            });
            thName.appendChild(aName);
            tr.appendChild(thName);
            // Creating value
            var tdValue = document.createElement("TD");
            tdValue.id = "Item.Value";
            tdValue.innerHTML = json["Item.Value"];
            tr.appendChild(tdValue);
            // Creating rarity
            var tdRarity = document.createElement("TD");
            tdRarity.id = "Item.Rarity";
            tdRarity.innerHTML = json["Item.Rarity"];
            tr.appendChild(tdRarity);
            // Creating type
            var tdType = document.createElement("TD");
            tdType.id = "Item.ItemType";
            tdType.innerHTML = json["Item.ItemType"];
            tr.appendChild(tdType);
            // Creating charges
            var tdCharges = document.createElement("TD");
            tdCharges.id = "Item.Charges";
            tdCharges.innerHTML = json["Item.Charges"];
            tr.appendChild(tdCharges);
            // Creating the delete button
            var tdDeleteButton = document.createElement("TD");
            tdDeleteButton.classList.add("px-0");
            var deleteButton = document.createElement("BUTTON");
            deleteButton.id = "deleteButton";
            deleteButton.classList.add("btn", "p-0", "d-block");
            deleteButton.setAttribute("data-id", data["id"]);
            deleteButton.innerHTML = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-x-lg\" viewBox=\"0 0 16 16\"><path d=\"M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z\"/></svg>";
            deleteButton.addEventListener("click", function (e) { confirmDelete(data["id"], e); });
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
    function confirmDelete(id, e) {
        if (!document.getElementById("item-id-".concat(id)))
            return;
        var row = document.getElementById("item-id-".concat(id));
        var deleteButton = row.querySelector("#deleteButton");
        var confirmButton = deleteButton.cloneNode(true);
        confirmButton.id = "confirmDelete";
        confirmButton.innerHTML = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-exclamation-circle-fill\" viewBox=\"0 0 16 16\"><path d=\"M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z\"/></svg>";
        confirmButton.classList.add("text-red");
        confirmButton.title = "Are you sure you want to delete this item?";
        e.stopPropagation();
        e.preventDefault();
        document.body.addEventListener("click", function (e) { cancelDelete(id, e); }, { once: true });
        confirmButton.addEventListener("click", function (e) { del(id); });
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
    function cancelDelete(id, e) {
        if (!document.getElementById("item-id-".concat(id)))
            return;
        var row = document.getElementById("item-id-".concat(id));
        var deleteButton = row.querySelector("#deleteButton");
        var confirmButton = row.querySelector("#confirmDelete");
        if (confirmButton.contains(e.target)) {
            e.stopPropagation();
            return;
        }
        deleteButton.classList.remove("d-none");
        confirmButton.parentElement.removeChild(confirmButton);
    }
    // Delete an item
    function del(id) {
        if (!document.getElementById("item-id-".concat(id)))
            return;
        var row = document.getElementById("item-id-".concat(id));
        var query = "/Home/Delete";
        fetch(query, {
            method: "post",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: "itemId=".concat(id)
        }).then(function (response) {
            if (!response.ok && !response.redirected) {
                alert(response);
                throw new Error(response.status.toString());
            }
            else
                return response;
        }).then(function (x) { return x.text(); }).then(function (data) {
            row.parentNode.removeChild(row);
        });
    }
    /**
     * Send an API call for editing an item
     */
    function edit() {
        var editDetailDiv = document.getElementById("editItemDetails");
        var id = editDetailDiv.getAttribute("data-id");
        var tbody = Inventory.focusInventory.elm.querySelector("tbody");
        var row = tbody.querySelector("#item-id-".concat(id));
        // Getting all the elements from the edit section
        var charges = editDetailDiv.querySelector("#itemCharges");
        var value = editDetailDiv.querySelector("#itemValue");
        var name = editDetailDiv.querySelector("#itemName");
        var description = editDetailDiv.querySelector("#itemDescription");
        var rarity = editDetailDiv.querySelector("#itemRarity").querySelector("button");
        var itemType = editDetailDiv.querySelector("#itemType").querySelector("button");
        // Building the body request
        var json = {};
        json["Item.Id"] = id;
        json["Item.GroupInventoryId"] = Inventory.focusInventory.id;
        json["Item.Charges"] = charges.value;
        json["Item.Value"] = value.value;
        json["Item.Name"] = name.value;
        json["Item.Description"] = description.value;
        json["Item.Rarity"] = rarity.textContent.trim();
        json["Item.ItemType"] = itemType.textContent.trim();
        if (json["Item.ItemType"] === "Item Type") {
            json["Item.ItemType"] = "Miscellaneous";
        }
        if (json["Item.Rarity"] === "Rarity") {
            json["Item.Rarity"] = "Non-magical";
        }
        var query = "/Home/Edit";
        fetch(query, {
            method: "post",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: jsonToFormData(json)
        }).then(function (response) {
            if (!response.ok && !response.redirected) {
                alert(response);
                throw new Error(response.status.toString());
            }
            else
                return response;
        }).then(function (x) { return x.text(); }).then(function (data) {
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
        init: init,
        editItem: editItem,
        addItem: addItem
    };
})();
// This will trigger first
document.addEventListener('DOMContentLoaded', function () {
    // Init inventory
    Inventory.init();
    // Init session
    Session.init();
});
// Wait for everything to load, then set event for
window.addEventListener('load', function () {
});
var Random = (function () {
    // https://i.redd.it/3hosqf4eima81.jpg
    function makeid(length, type) {
        if (length === void 0) { length = 10; }
        if (type === void 0) { type = "all"; }
        var result = '';
        var characters = '';
        if (type === "all")
            characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        else if (type === "numbers")
            characters = '0123456789';
        else if (type === "alphabetic")
            characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        else if (type === "expanded")
            characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_.,!?#%&/()=[]{}';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() *
                charactersLength));
        }
        return result;
    }
    // Here you can set what to be public
    return {
        // Name             : Function
        makeid: makeid
    };
})();
var Session = (function () {
    // Global variable within session.ts
    var sessionBox;
    // Init for this function
    function init() {
        // Return if no sessionBox id was found
        if (!document.getElementById("sessionBox"))
            return;
        sessionBox = document.getElementById("sessionBox");
        // Load event for add button
        var bigAddButton = sessionBox.querySelector("#addSessionCard");
        bigAddButton.addEventListener("click", addSession);
    }
    // Function to add html element for setting name, add, cancel
    function addSession() {
        var bigButton = sessionBox.querySelector("#addSessionCard");
        // Creating div
        var div = document.createElement("DIV");
        div.classList.add("input-group", "rounded-0");
        // Creating an unique id for this row
        var tmpId = Random.makeid();
        div.id = tmpId;
        // Creating input
        var input = document.createElement("INPUT");
        input.classList.add("form-control");
        input.type = "text";
        input.placeholder = "Name your campaign...";
        input.id = "SessionName"; // TODO: use model instead
        // Creating add button
        var addButton = document.createElement("BUTTON");
        addButton.classList.add("btn", "btn-outline-green");
        addButton.type = "button";
        addButton.innerHTML = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-check-lg\" viewBox=\"0 0 16 16\"><path d=\"M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z\"/></svg>";
        addButton.addEventListener("click", function () { add(tmpId); });
        // Creating cancel button
        var cancelButton = document.createElement("BUTTON");
        cancelButton.classList.add("btn", "btn-outline-red");
        cancelButton.type = "button";
        cancelButton.innerHTML = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-x-lg\" viewBox=\"0 0 16 16\"><path d=\"M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z\"/></svg>";
        cancelButton.addEventListener("click", function () { cancel(tmpId); });
        div.appendChild(input);
        div.appendChild(addButton);
        div.appendChild(cancelButton);
        bigButton.before(div);
    }
    /**
     * Cancelling creation of session
     * @param tmpId id of the temporarily created row
     */
    function cancel(tmpId) {
        var row = document.getElementById(tmpId);
        row.parentElement.removeChild(row);
    }
    /**
     * Sending the add API call
     * @param tmpId id of the temporarily created row
     */
    function add(tmpId) {
        var row = document.getElementById(tmpId);
        var input = row.querySelector("#SessionName");
        var name = input.value;
        var json = {
            "Session.Name": name
        };
        var query = "/Home/AddSession";
        fetch(query, {
            method: "post",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: jsonToFormData(json)
        }).then(function (response) {
            if (!response.ok && !response.redirected) {
                alert(response);
                throw new Error(response.status.toString());
            }
            else
                return response;
        }).then(function (x) { return x.json(); }).then(function (data) {
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
    function createRow(tmpId, data) {
        var row = document.getElementById(tmpId);
        var num = getNewNum();
        // Creating the outer box
        var div = document.createElement("div");
        div.classList.add("position-relative", "bg-dark", "rounded-0", "p-3");
        div.id = "session-" + data.id;
        //div.href = `/Home/Index/${data["id"]}`;
        // Creating the number on the top right
        var span = document.createElement("SPAN");
        span.classList.add("text-muted", "p-2", "top-0", "end-0", "position-absolute", "sessionNum");
        span.innerHTML = "#".concat(num.toString());
        // Creating the name text
        var a = document.createElement("a");
        a.href = "/Home/Index/" + data.id.toString();
        a.innerHTML = data["name"];
        a.id = "anchor";
        // Create session invite button
        var inviteButton = document.createElement("button");
        inviteButton.classList.add("btn", "btn-link", "bottom-0", "px-2", "py-0", "end-0", "position-absolute");
        inviteButton.type = "button";
        inviteButton.addEventListener("click", function () { Invite.create(data.id); });
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
    function getNewNum() {
        if (!document.getElementsByClassName("sessionNum"))
            return 1;
        var numsDivs = document.getElementsByClassName("sessionNum");
        var num = 1;
        for (var i = 0; i < numsDivs.length; i++) {
            var div = numsDivs[i];
            var tmpNum = parseInt(div.innerHTML.replace(/\D/g, ''));
            num = tmpNum + 1;
        }
        return num;
    }
    // Here you can set what to be public
    return {
        // Name             : Function
        init: init
    };
})();
