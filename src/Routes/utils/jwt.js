const axios = require("axios");
const jwtDecode = require("jwt-decode");

let getToken = (token, callback) => {
  axios
    .post("/api/auth", {
      token
    })
    .then(response => {
      if (response.status === 200) {
        callback(null, response.data.token);
      } else {
        callback(true, null);
      }
    })
    .catch(error => {
      callback(error, null);
    });
};

let checkToken = () => {
  try {
    let decoded = jwtDecode(sessionStorage.getItem("token"));
    if (decoded.exp * 1000 > +new Date()) return true;
    else return false;
  } catch (e) {
    return false;
  }
};

let getDecodedToken = () => {
  return jwtDecode(sessionStorage.getItem("token"));
};

module.exports = {
  getToken,
  checkToken,
  getDecodedToken
};
