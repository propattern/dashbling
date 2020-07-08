import React from 'react';

import {Label, SmallLabel, MediumLabel, Widget} from "@dashbling/client/Widget";

const bgColor = data => {
  const {healthCheck = [], networkError = false} = data;

  if (networkError) {
    return '#ffe414'
  }

  const isIll = healthCheck.filter(({ status }) => status !== 'OK').length > 0;
  return isIll ? '#f42a2a' : '#4cbf55'
};

export const  HealthCheck = (props) => {
  const {applicationHealth = {}, environmentHealth = {}, updatedAt} = props;
  const {
    networkError = false,
    build: {
      branch= '',
      buildNumber= '',
      commit= '',
      buildUrl= '',
      nodeVersion= '',
      buildDate= '',
    } = {},
    healthCheck= []}  = applicationHealth;

  const {HealthStatus = '', Status = '', InstancesHealth = {}} = environmentHealth;

  let labelStyles = {color: '#333333', padding: '0.2em', textAlign: 'left', fontSize: '10px'};

  return (
      <Widget style={{ backgroundColor: bgColor(applicationHealth) }}>
        <MediumLabel style={{color: '#fff', marginBottom: '0.5em'}}>{props.title}</MediumLabel>

        {networkError && <SmallLabel style={{color: 'red'}}>NETWORK ERROR</SmallLabel>}

        <span style={labelStyles}>Branch: <strong>{branch}</strong></span><hr />
        <span style={labelStyles}>Build #: <strong>{buildNumber}</strong></span><hr />
        <span style={labelStyles}>Commit: <strong>{commit}</strong></span><hr />
        <span style={labelStyles}>Node Version: <strong>{nodeVersion}</strong></span><hr />
        <span style={labelStyles}>Build Date: <strong>{buildDate}</strong></span><hr />

        <Label style={{color: '#fff', marginBottom: '0.5em'}}>Application Checks:</Label>

        {healthCheck.map(({ Name, status }) => {
          const listItem = status !== 'OK' ? 'flashing' : '';
          return <span className={listItem} style={labelStyles}> - {Name} : <strong>{status}</strong></span>;
        })}
       <hr />

        <Label style={{color: '#fff', marginBottom: '0.5em'}}>Environment Health:</Label>
        <span style={labelStyles}>Instances Count (Health):
          <strong>
            {Object.keys(InstancesHealth).map((key) => {
              const value = InstancesHealth[key]
              return value? `${key} : ${InstancesHealth[key]}, `: ''
            })}
          </strong></span><hr />
        <span style={labelStyles}>Health Status: <strong>{HealthStatus}</strong></span><hr />
        <span style={labelStyles}>Status: <strong>{Status}</strong></span><hr />
        {updatedAt && <span style={{ fontSize: '14px', marginTop: 10}}>{updatedAt}</span>}
      </Widget>
    );
};
