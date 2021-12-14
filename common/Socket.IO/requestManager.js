const axios = require("axios");
const proxyURL = "";
const apiPrefixURL = "/api/2.0";
const apiTimeout = 30000;

getBasePath = (req) => "http://localhost:8092";

module.exports = (options) => {
  //console.log("socket", socket.client.request.headers);

  const basePath = getBasePath();
  const url = `${basePath}${apiPrefixURL}${options.url}`;

  const axiosOptions = {
    baseURL: url,
    responseType: "json",
    timeout: apiTimeout,
    headers: options.headers,
  };

  const getResponseError = (res) => {
    if (!res) return;

    if (res.data && res.data.error) {
      return res.data.error.message;
    }

    if (res.isAxiosError && res.message) {
      return res.message;
    }
  };

  const onSuccess = (response) => {
    const error = getResponseError(response);
    if (error) throw new Error(error);

    if (!response || !response.data || response.isAxiosError) return null;
    if (response.request.responseType === "text") return response.data;

    //return response.data;
    return response.data.response;
  };

  const onError = (error) => {
    const errorText = error.response
      ? getResponseError(error.response)
      : error.message;
    return Promise.reject(errorText || error);
  };

  const request = axios.create(axiosOptions);
  return request().then(onSuccess).catch(onError);
};
