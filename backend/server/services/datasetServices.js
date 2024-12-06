import axios from "axios";
import 'dotenv/config';


const datasetServices = {
    getRecommendations: async (genres) => {
        try {
          const response = await axios.post("http://localhost:8000/get-songs", {
            genres,
          });
          return response.data;
        } catch (error) {
          console.error("Error communicating with FastAPI:", error.message);
          throw error;
        }
      },
      
};

export default datasetServices;

