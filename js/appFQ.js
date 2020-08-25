window.onload = function() {
    const socket = io();

    var forceQuitButton = document.getElementById('forceQuit');
    
    function sleep(ms) {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    }
    
    // Check if "isRunning" exists in LocalStorage and if it doesn't set it to false.
    
    let isRunning = localStorage.getItem('isRunning');
    
    if (isRunning == null) {
        localStorage.setItem('isRunning', false);
    }
    
    function result(result) {
        let resultText = document.getElementById('resultTextFQ');
    
        resultText.textContent = result;
        console.log(result);
    }
    
    forceQuitButton.addEventListener("click", evt => {
        var discordToken = document.getElementById('tokenFQ').value;
    
        if (discordToken == "" || discordToken == " " || discordToken == null) {
            // No token provided, lets return.
    
            result("No token provided.",true);
        } else {
            // Token provided!
    
            socket.emit('forceEndBot', discordToken);
            
            let isRunning = localStorage.getItem('isRunning');
    
            if (isRunning == true || isRunning == "true") {
                localStorage.removeItem('token');
                localStorage.setItem('isRunning', false);
                result("Successfully ended AutoLevelBot V3.");
            } else {
                result("Error while finding client.");
            }
        }
    });
    
    socket.on('changeResultFQ', async (resultOutput) => {
        await sleep(0050);
        result(resultOutput);
    })
}