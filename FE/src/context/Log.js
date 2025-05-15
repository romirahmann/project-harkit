import axios from "axios";
import { api } from "./Urlapi";

/* eslint-disable no-unused-vars */
export function AddLog(messege, level) {
  let url = api;
  let log = async () => {
    try {
      let data = {
        messege: messege,
        level: level,
      };
      let result = await axios.post(`${url}/master/log`, data);
      // console.log(result);
    } catch (err) {
      console.log(err);
    }
  };
  log();
}
