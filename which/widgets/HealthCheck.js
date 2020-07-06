import React from 'react';

import '../styles/main.scss';
import '../styles/styles.scss';
import {SmallLabel, MediumLabel, Widget} from "@dashbling/client/Widget";

const bgColor = data => {
  const {healthCheck = [], networkError = false} = data

  if (networkError) {
    return '#ffe414'
  }

  const isIll = healthCheck.filter(({ status }) => status !== 'OK').length > 0;
  return isIll ? '#f42a2a' : '#4cbf55'
};

export const  HealthCheck = (props) => {
  const {data = {}} = props
  const {
    networkError = false,
    updatedAt= undefined,
    title = '',
    build: {
      branch= '',
      buildNumber= '',
      commit= '',
      buildUrl= '',
      nodeVersion= '',
      buildDate= '',
    } = {},
    healthCheck= []}  = data

  let labelStyles = {color: '#333333', padding: '0.2em', textAlign: 'left', fontSize: '12px'};

  return (
      <Widget style={{ backgroundColor: bgColor(data) }}>
        <MediumLabel style={{color: '#fff', marginBottom: '0.5em'}}>{props.title}</MediumLabel>

        {networkError && <SmallLabel>NETWORK ERROR</SmallLabel>}

        <div style={{textAlign: 'left', marginBottom: '0.5em'}}>
          <span style={labelStyles}>Branch: <strong>{branch}</strong></span><hr />
          <span style={labelStyles}>Build #: <strong>{buildNumber}</strong></span><hr />
          <span style={labelStyles}>Commit: <strong>{commit}</strong></span><hr />
          <span style={labelStyles}>Node Version: <strong>{nodeVersion}</strong></span><hr />
          <span style={labelStyles}>Build Date: <strong>{buildDate}</strong></span><hr />
        </div>

        <SmallLabel style={{color: '#fff', marginBottom: '0.5em'}}>CheckList:</SmallLabel>

        {healthCheck.map(({ Name, status }) => {
          return <span style={labelStyles}> - {Name} : <strong>{status}</strong></span>;
        })}
       <hr />

      </Widget>
    );
}
