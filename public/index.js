function handleCheckBoxClick(buttonNum){
    var request = new XMLHttpRequest();
    request.open("POST",'/');
    
    var requestBody = JSON.stringify({
        buttonID: buttonNum
    });

    request.addEventListener("load", function(event){
        if (event.target.status != 200){
            alert("wrong");
        }
    });
}



document.getElementById("chkboxdiv").addEventListener("click", function(event){
    handleCheckBoxClick(event.target.id);
});

document.getElementById("text-input").addEventListener("submit", function(event){

document.getElementById("text-input").addEventListener("click", function(event){

    if (event.target.classList.contains("url-text")){
        handleHomeFormSubmit();
    } else if (event.target.classList.contains("feed-text")){
        handleFeedFormSubmit();
    }
});

