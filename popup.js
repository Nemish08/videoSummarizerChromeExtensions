document.getElementById("sendBtn").addEventListener("click",async function() {
    let url = document.getElementById("youtubeUrl").value.trim();
    let chatbox = document.getElementById("chatbox");

   
    const mp3Url = await get_youtube_mp3(url);
    if(mp3Url !== undefined)
        await sendToBackend(mp3Url)
});


async function get_youtube_mp3(youtubeUrl){
    const urlID = getYouTubeVideoID(youtubeUrl);
    const url = `https://youtube-mp36.p.rapidapi.com/dl?id=${urlID}`;
    // const url = youtubeUrl
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': '137c4c4794msh068d55bc7d3a0b9p19af27jsnb239dfca3248',
            'x-rapidapi-host': 'youtube-mp36.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);
        let result = await response.json();
        console.log(result)
        result = result['link'];
        console.log(result);
        return result

    } catch (error) {
        console.error(error);
    }
}


async function sendToBackend(mp3url) {
    chatbox.innerHTML = `<p><strong>Bot:</strong> Uploading MP3 to backend...</p>`;

    try {
    
        const response = await fetch("https://backend-i7vt.onrender.com/upload-mp3", { // Update with your actual backend URL
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                youtubeUrl : mp3url
              })
        });

        if (!response.ok) throw new Error("Failed to upload to backend.");
        console.log(response)
        const result = await response.json(); // Assuming backend sends JSON response
        chatbox.innerHTML += `<p><strong>Bot:</strong> Gemini AI Response: ${result.message}</p>`;
        chatbox.innerHTML += marked.parse(result.message);
    } catch (error) {
        chatbox.innerHTML += `<p style='color: red;'>Error: ${error.message}</p>`;
    }
}


function getYouTubeVideoID(url) {
    const regexString = "(?:youtube\\.com\\/(?:[^\\/]+\\/.*|(?:v|e(?:mbed)?)\\/|.*[?&]v=)|youtu\\.be\\/|youtube\\.com\\/shorts\\/)([^\"&?\\/\\s]+)";
    const regex = new RegExp(regexString);
    
    const match = url.match(regex);
    return match ? match[1] : null;
}