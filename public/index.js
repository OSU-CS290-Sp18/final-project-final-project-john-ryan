function handleHomeFormSubmit() {
    var untrimInput = document.getElementsByClassName("url-text-input");
    var input = untrimInput[0].value.trim();
    if(!input){
        alert("no input entered");
    } else {
        var request = new XMLHttpRequest();
        
        request.open("GET", "/public/"+input);

        request.addEventListener('load', function(event){
            if (!event.target.status === 200){
                alert("error getting feed page: " + event.target.response);
            }
        });

        request.send();
    }
}

function handleFeedFormSubmit() {
    var untrimInput = document.getElementsByClassName("feed-text");
    var input = untrimInput[0].value.trim();
    if(!input){
        alert("no input entered");
    } else {
        var request = new XMLHttpRequest();

        request.open("POST", input);

        var requestBody = JSON.stringify({
            feedURL: input
        });

        request.addEventListener("load", function(event){
            if(event.target.status === 200){
                location.reload(true);
            } else {
                alert("error adding feed: " + event.target.response);
            }
        });

        request.setRequestHeader('Content-Type', 'application/json');
        request.send(requestBody);
    }
}

document.getElementById("text-input").addEventListener("submit", function(event){
    if (event.target.classList.contains("url-text")){
        handleHomeFormSubmit();
    } else if (event.target.classList.contains("feed-text")){
        handleFeedFormSubmit();
    }
});
