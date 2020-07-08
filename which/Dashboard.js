import React from "react";

import { connect } from "@dashbling/client/dashbling";
import { Dashboard } from "@dashbling/client/components";
import { Clock } from "@dashbling/client/widgets";
import { HelloWidget } from "./widgets/HelloWidget";
import { GitHubStars } from "./widgets/gitHubStars/GitHubStars";
import { HealthCheck } from "./widgets/HealthCheck";
import { CircleCiStatus } from "./widgets/circleCi/CircleCiStatus";
import { WeatherWidget } from "dashbling-widget-weather";

const DashblingGitHubStars = connect("github-stars-dashbling")(GitHubStars);
const LocalHealthCheck = connect("local-health-check")(HealthCheck);
const DevHealthCheck = connect("dev-health-check")(HealthCheck);
const TestHealthCheck = connect("test-health-check")(HealthCheck);
const PreProdHealthCheck = connect("preprod-health-check")(HealthCheck);
const ProdHealthCheck = connect("prod-health-check")(HealthCheck);
const DashblingCiStatus = connect("dashbling-ci-status")(CircleCiStatus);
const WeatherInAmsterdam = connect("weather-amsterdam")(WeatherWidget);
const BoundHelloWidget = connect("hello")(HelloWidget);

import layout from './styles/whichLayout.scss'

export default props => {
  return (
    <Dashboard layout={layout}>
      <LocalHealthCheck title='Health Local'/>
      <DevHealthCheck title='Health DEV'/>
      <TestHealthCheck title='Health Test'/>
      <PreProdHealthCheck title='Health Pre Prod'/>
      <ProdHealthCheck title='Health Prod'/>
      {/*<Clock*/}
      {/*  tzdata={require("timezone/Europe/Amsterdam")}*/}
      {/*  timezone="Europe/Amsterdam"*/}
      {/*  backgroundColor="#00865A"*/}
      {/*/>*/}
      {/*<BoundHelloWidget />*/}

      {/*<WeatherInAmsterdam title="Amsterdam" />*/}
      {/*<DashblingGitHubStars />*/}
      {/*<DashblingCiStatus />*/}
    </Dashboard>
  );
};
