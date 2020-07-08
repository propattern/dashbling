import {PassThrough} from "stream";
import {EventBus} from "../lib/eventBus";
import {Event} from "../lib/Event";
import {ClientConfig} from "../lib/clientConfig";
import {Request, ResponseToolkit, Server} from "@hapi/hapi";

const { heartbeat } = require("../lib/constants");
const AWS = require('aws-sdk')


interface PassThroughWithHeaders extends PassThrough {
  headers: { [key: string]: string };
}

AWS.config.update({
  region: process.env.AWS_DEFAULT_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  apiVersions: {
    s3: '2006-03-01',
  },
})

const ebsHealthCheck = async (environmentName: string) => {
  const ebs = new AWS.ElasticBeanstalk()
  const params ={
    AttributeNames: [
      "All"
    ],
    EnvironmentName: environmentName
  };
  return await ebs.describeEnvironmentHealth(params).promise()
  // return await ebs.describeInstancesHealth(params).promise()
};

export const install = (
  server: Server,
  eventBus: EventBus,
  clientConfig: ClientConfig
) => {
  server.route({
    method: "GET",
    path: "/events",
    handler: streamEventsHandler(eventBus)
  });

  server.route({
    method: 'GET',
    path: '/aws/health/{env}',
    handler:  function (request, h) {
      try {
        return ebsHealthCheck(request.params.env)
      } catch (e) {
        console.log(111, e)
      }
    }
  });

  server.route({
    method: "POST",
    path: "/events/{id}",
    options: {
      payload: { allow: "application/json" },
      auth: false // disable basic auth, uses custom authToken
    },
    handler: postEventHandler(eventBus, clientConfig.authToken)
  });
};

const streamEventsHandler = (eventBus: EventBus) => (
  _req: Request,
  _h: ResponseToolkit
) => {
  const stream = new PassThrough() as PassThroughWithHeaders;
  stream.headers = {
    "content-type": "text/event-stream",
    "content-encoding": "identity"
  };

  const subscriber = (event: Event) => {
    const outEvent = { ...event } as any;
    outEvent.updatedAt = event.updatedAt.getTime();

    stream.write(`data: ${JSON.stringify(outEvent)}\n\n`);
  };

  const sendHeartBeat = setInterval(() => {
    stream.write(`data: ${heartbeat}\n\n`);
  }, 20 * 1000);

  eventBus.subscribe(subscriber);
  eventBus.replayHistory(subscriber);

  stream.once("close", () => {
    eventBus.unsubscribe(subscriber);
    clearInterval(sendHeartBeat);
  });

  stream.write("\n\n");
  return stream;
};

const postEventHandler = (eventBus: EventBus, token: string) => (
  req: Request,
  h: ResponseToolkit
) => {
  const validAuthHeaders = [`Bearer ${token}`, `bearer ${token}`];
  if (!validAuthHeaders.includes(req.headers.authorization)) {
    return h.response("Unauthorized").code(401);
  }

  eventBus.publish(req.params.id, req.payload);
  return "OK";
};
