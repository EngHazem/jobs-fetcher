import { Basic as Image } from "unsplash-js/dist/methods/photos/types";

interface Job {
    id: string;
    status: string;
    data: Image;
  }
   
  export default Job;