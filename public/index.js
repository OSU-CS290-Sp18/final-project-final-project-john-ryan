function checkBoxNotClicked(checkbox){
    return !(checkbox.checked);
}

document.getElementById("checkList").addEventListener("submit", function(event){
    checkboxes = Array.prototype.slice.call(document.getElementsByClassName("feedCheckBox"));
    if (checkboxes.every(checkBoxNotClicked)){
        alert("you must select at least one feed");
    }
});
