import axios from "axios";
import 'dotenv/config';


//STILL FIGURING OUT SPOTIFY API STUFF T.T
const spotifyService = {
    authenticate: async () => {
        const response = await axios({
            method: 'post',
            url: 'https://accounts.spotify.com/api/token',
            headers: {
                'Content-Type' : 'application/'
            }
        })
    }
}

export default spotifyService;