const fetch = require("node-fetch");

module.exports = (url, eventId) =>
  async function gitHealthCheck(sendEvent) {
    try {
      const response = await fetch(url);
      const json = await response.json();
      const { build = {}, healthCheck = [] } = json;
      const payload =  { data: { build, healthCheck, networkError: false } };

      sendEvent(eventId, payload);
    } catch (e) {
      console.warn("Failed to fetch GitHub stars", e);
      const payload =  { data: { build: {}, healthCheck:[], networkError: true } };
      sendEvent(eventId, payload);
    }
  };
