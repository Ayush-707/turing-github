import { commonRequest }  from "./api";
//import { BACKEND_URL } from "../helper";


export const sendInput = async(data) => {
    return await commonRequest("POST", `/api/data/`, data)
}