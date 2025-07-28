import axios from "axios";

import { baseApi } from "./api.service";

/* eslint-disable no-unused-vars */
export function AddLog(username, description, status, action) {
  let url = baseApi;
  let log = async () => {
    try {
      let data = {
        username,
        description,
        status,
        action,
      };
      await axios.post(`${url}/master/log`, data);
    } catch (err) {
      console.log(err);
    }
  };
  log();
}
