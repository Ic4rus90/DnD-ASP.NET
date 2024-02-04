let Random = (function () {

// https://i.redd.it/3hosqf4eima81.jpg
    function makeid(length = 10, type = "all") {
        let result = '';
        let characters = '';
        if (type === "all")
            characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        else if (type === "numbers")
            characters = '0123456789';
        else if (type === "alphabetic")
            characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        else if (type === "expanded")
            characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_.,!?#%&/()=[]{}';
        let charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() *
                charactersLength));
        }
        return result;
    }
    
    

    // Here you can set what to be public
    return {
        // Name             : Function
        makeid
    };
})();