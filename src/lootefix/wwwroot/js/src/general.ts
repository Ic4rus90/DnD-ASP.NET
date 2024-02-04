function jsonToFormData(data : object){
    let result = [];
    for (let key in data) {
        result.push(encodeURIComponent(key) + "=" + encodeURIComponent(data[key]));
    }
    
    return result.join("&");
}

function changeDropdownButton(elm : Element){
    let button = elm.querySelector(".dropdown-toggle");
    let options = elm.querySelectorAll(".dropdown-item");
    for (let i = 0; i < options.length; i++) {
        options[i].addEventListener("click", function (){
            button.innerHTML = options[i].textContent;
        })
    }
}

/**
 * Function as replacement for !isNaN
 * @param str
 */
function isNumeric(str) {
    if (typeof str != "string") return false  
    return !isNaN(str as any) && !isNaN(parseFloat(str))
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}