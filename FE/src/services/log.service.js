import axios from "axios";

import { baseApi } from "./api.service";

/* eslint-disable no-unused-vars */
export function AddLog(messege, level) {
  let url = baseApi;
  let log = async () => {
    try {
      let data = {
        messege: messege,
        level: level,
      };
      let result = await axios.post(`${url}/master/log`, data);
    } catch (err) {
      console.log(err);
    }
  };
  log();
}
