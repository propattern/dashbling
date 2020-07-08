const fetch = require("node-fetch");
const moment =  require('moment');

const getApplicationHealth = async (applicationHealthUrl) => {
  try {
    const json = await (await fetch(applicationHealthUrl)).json();
    const {build = {}, healthCheck = []} = json;
    return {applicationHealth: {build, healthCheck, networkError: false}};
  } catch (e) {
    console.warn("Failed to fetch Application Health", e);
    return {applicationHealth: {build: {}, healthCheck: [], networkError: true}};
  }
};

const getEnvironmentHealth = async (environmentHealthUrl) => {
  try {
    return await (await fetch(environmentHealthUrl)).json();
  } catch (e) {
    console.warn("Failed to fetch Environment Health", e);
    return {};
  }
};

module.exports = (applicationHealthUrl, environmentHealthUrl, eventId) =>
  async function getHealthCheck(sendEvent) {
    const applicationPayload = await getApplicationHealth(applicationHealthUrl);
    const environmentHealth = await getEnvironmentHealth(environmentHealthUrl);
    const updatedAt = moment().format('D/M/YYYY h:mm:ss');

    sendEvent(eventId, {...applicationPayload, updatedAt, environmentHealth})
  };
