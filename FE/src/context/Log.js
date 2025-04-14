import axios from "axios";

/* eslint-disable no-unused-vars */
export function AddLog(messege, level) {
  let url = "http://192.168.9.192:3002/api";
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
