function handleHomeFormSubmit() {
    var input = document.getElementById("home-text-input").value.trim();
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
    var input = document.getElementById("feed-text-input").value.trim();
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
    if (event.target.classList.includes("home-text-input")){
        handleHomeFormSubmit();
    } else if (event.target.classList.includes("feed-text-input")){
        handleFeedFormSubmit();
    }
});
