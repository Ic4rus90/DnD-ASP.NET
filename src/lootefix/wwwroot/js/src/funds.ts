let Funds = (function () {
    
    function init(inventoryId = null){
        let fundBoxes;
        if (inventoryId === null)
            fundBoxes = document.querySelectorAll(".fundsBox");
        else
            fundBoxes = document.querySelectorAll(`#fundsBox-${inventoryId}`);
        
        for (let i = 0; i < fundBoxes.length; i++) {
            // If not Dungeon master
            if (!fundBoxes[i].querySelector("#addFundsBox"))
                continue;
            
            let inventoryId = fundBoxes[i].getAttribute("data-inventoryId");
            let addFundsBox = fundBoxes[i].querySelector("#addFundsBox");
            
            // Event listener for gold input
            let goldInput = addFundsBox.querySelector("#gold") as HTMLInputElement;
            goldInput.addEventListener("keyup", function(e){
                let label = goldInput.parentElement.querySelector("x");
                goldInput.value = goldInput.value.replace(/\D/g,'');
                if (goldInput.value === ""){
                    setLabel("gold", inventoryId);
                }else{
                    setLabel("gold", inventoryId, label.innerHTML = getFunds(inventoryId).gold + " ± " + goldInput.value);
                }
            });

            // Event listener for silver input
            let silverInput = addFundsBox.querySelector("#silver") as HTMLInputElement;
            silverInput.addEventListener("keyup", function(e){
                silverInput.value = silverInput.value.replace(/\D/g,'');
                if (silverInput.value === ""){
                    setLabel("silver", inventoryId);
                }else{
                    setLabel("silver", inventoryId, getFunds(inventoryId).silver + " ± " + silverInput.value);
                }
            });

            // Event listener for copper input
            let copperInput = addFundsBox.querySelector("#copper") as HTMLInputElement as HTMLInputElement;
            copperInput.addEventListener("keyup", function(e){
                copperInput.value = copperInput.value.replace(/\D/g,'');
                if (copperInput.value === ""){
                    setLabel("copper", inventoryId);
                }else{
                    setLabel("copper", inventoryId, getFunds(inventoryId).copper + " ± " + copperInput.value);
                }
            });
            
            // Set event listener for adding funds
            let addFundsButton = fundBoxes[i].querySelector("#addFunds");
            addFundsButton.addEventListener("click", function () {
                add(inventoryId);
            });

            // Set event listener for subtracting funds
            let subtractFundsButton = fundBoxes[i].querySelector("#removeFunds");
            subtractFundsButton.addEventListener("click", function () {
                subtract(inventoryId);
            });
        }
    }

    /**
     * Function to change label of the coins
     * @param {('copper'|'silver'|'gold')} coinType
     * @param inventoryId
     * @param value
     */
    function setLabel(coinType, inventoryId, value = null){
        if (!document.querySelector(`#fundsBox-${inventoryId}`))
            return;

        let fundsBox = document.querySelector(`#fundsBox-${inventoryId}`);
        if (!fundsBox.querySelector("#addFundsBox"))
            return;
        
        if (value == null)
            value = capitalizeFirstLetter(coinType);

        let addFundsBox = fundsBox.querySelector("#addFundsBox");
        let input = addFundsBox.querySelector(`#${coinType}`) as HTMLInputElement as HTMLInputElement;
        let label = input.parentElement.querySelector("x");
        label.innerHTML = value;
    }

    /**
     * Sending the add API call
     * @param inventoryId id of the inventory
     */
    function add(inventoryId){
        let amount = getNewFunds(inventoryId);
        let json = {
            "GroupFund.Gold": amount.gold,
            "GroupFund.Silver": amount.silver,
            "GroupFund.Copper": amount.copper,
            "GroupFund.GroupInventoryId": inventoryId
        };

        let query = "/Funds/EditFunds";
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
            }
            else return response;
        }).then(x => { return x.json() }).then((data) => {
            updateFunds(data, inventoryId);
            clearFields(inventoryId);
        });
    }

    /**
     * Sending the subtract API call
     * @param inventoryId id of the inventory
     */
    function subtract(inventoryId){
        let amount = getNewFunds(inventoryId);
        let json = {
            "GroupFund.Gold": -amount.gold,
            "GroupFund.Silver": -amount.silver,
            "GroupFund.Copper": -amount.copper,
            "GroupFund.GroupInventoryId": inventoryId
        };

        let query = "/Funds/EditFunds";
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
            updateFunds(data, inventoryId);
            clearFields(inventoryId);
        });
    }

    function updateFunds(data : {copper: number, silver: number, gold: number}, inventoryId){
        if (!document.querySelector(`#fundsBox-${inventoryId}`))
            return;

        let fundsBox = document.querySelector(`#fundsBox-${inventoryId}`);
        if (!fundsBox.querySelector("#activeFunds"))
            return;

        let activeFunds = fundsBox.querySelector("#activeFunds");

        // Getting gold
        let goldFunds = activeFunds.querySelector("#goldFunds");
        goldFunds.setAttribute("data-funds-amount", data.gold.toString());
        let gold = goldFunds.querySelector("x");
        gold.innerHTML = data.gold.toString();

        // Getting silver
        let silverFunds = activeFunds.querySelector("#silverFunds");
        silverFunds.setAttribute("data-funds-amount", data.silver.toString());
        let silver = silverFunds.querySelector("x");
        silver.innerHTML = data.silver.toString();

        // Getting copper
        let copperFunds = activeFunds.querySelector("#copperFunds");
        copperFunds.setAttribute("data-funds-amount", data.copper.toString());
        let copper = copperFunds.querySelector("x");
        copper.innerHTML = data.copper.toString();
    }
    
    function clearFields(inventoryId){
        if (!document.querySelector(`#fundsBox-${inventoryId}`))
            return;

        let fundsBox = document.querySelector(`#fundsBox-${inventoryId}`);
        if (!fundsBox.querySelector("#addFundsBox"))
            return;

        let addFundsBox = fundsBox.querySelector("#addFundsBox");

        // Getting gold
        let goldFunds = addFundsBox.querySelector("#gold") as HTMLInputElement;
        goldFunds.value = "";

        // Getting silver
        let silverFunds = addFundsBox.querySelector("#silver") as HTMLInputElement;
        silverFunds.value = "";

        // Getting copper
        let copperFunds = addFundsBox.querySelector("#copper") as HTMLInputElement;
        copperFunds.value = "";
        
        setLabel("copper", inventoryId);
        setLabel("silver", inventoryId);
        setLabel("gold", inventoryId);
    }
    
    
    function getFunds(inventoryId){
        let amount = {
            copper: 0,
            silver: 0,
            gold: 0
        }
        
        if (!document.querySelector(`#fundsBox-${inventoryId}`))
            return amount;
        
        let fundsBox = document.querySelector(`#fundsBox-${inventoryId}`);
        if (!fundsBox.querySelector("#activeFunds"))
            return amount;
        
        let activeFunds = fundsBox.querySelector("#activeFunds");
        
        // Getting gold
        let goldFunds = activeFunds.querySelector("#goldFunds");
        amount.gold = parseInt(goldFunds.getAttribute("data-funds-amount"));
        
        // Getting silver
        let silverFunds = activeFunds.querySelector("#silverFunds");
        amount.silver = parseInt(silverFunds.getAttribute("data-funds-amount"));
        
        // Getting copper
        let copperFunds = activeFunds.querySelector("#copperFunds");
        amount.copper = parseInt(copperFunds.getAttribute("data-funds-amount"));
        
        return amount;
    }
    
    function getNewFunds(inventoryId){
        let amount = {
            copper: 0,
            silver: 0,
            gold: 0
        }

        if (!document.querySelector(`#fundsBox-${inventoryId}`))
            return amount;

        let fundsBox = document.querySelector(`#fundsBox-${inventoryId}`);
        if (!fundsBox.querySelector("#addFundsBox"))
            return amount;

        let addFundsBox = fundsBox.querySelector("#addFundsBox");

        // Getting gold
        let goldFunds = addFundsBox.querySelector("#gold") as HTMLInputElement;
        amount.gold = isNumeric(goldFunds.value) ? parseInt(goldFunds.value) : 0;

        // Getting silver
        let silverFunds = addFundsBox.querySelector("#silver") as HTMLInputElement;
        amount.silver = isNumeric(silverFunds.value) ? parseInt(silverFunds.value) : 0;

        // Getting copper
        let copperFunds = addFundsBox.querySelector("#copper") as HTMLInputElement;
        amount.copper = isNumeric(copperFunds.value) ? parseInt(copperFunds.value) : 0;
        
        return amount;
    }
    
    
    // Here you can set what to be public
    return {
        // Name             : Function
        init
    };
})();