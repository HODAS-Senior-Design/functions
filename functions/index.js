const functions = require('firebase-functions');
const cors = require('cors')({ origin: true });
const admin = require('firebase-admin');
const twilio = require('twilio');
const fetch = require("node-fetch");
const { serviceAccount } = require('./config');
const projectId = process.env.GCLOUD_PROJECT;
const region = 'us-central1';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const { SessionsClient } = require('dialogflow');

exports.dialogflowGateway = functions.https.onRequest((request, response) => {
  cors(request, response, async () => {
    const { queryInput, sessionId } = request.body;
    const sessionClient = new SessionsClient({ credentials: serviceAccount });
    const session = sessionClient.sessionPath(projectId, sessionId);
    const responses = await sessionClient.detectIntent({ session, queryInput });
    const result = responses[0].queryResult;
    response.send(result);
  });
});

const { WebhookClient } = require('dialogflow-fulfillment');

exports.dialogflowWebhook = functions.https.onRequest(async (request, response) => {
  const agent = new WebhookClient({ request, response });
  const result = request.body.queryResult;

  // Add your intent functionality here
  async function userOnboardingHandler(agent) {
    agent.add(`Welcome aboard my friend!`);
  }

  let intentMap = new Map();

  // Add your intent here
  intentMap.set('UserOnboarding', userOnboardingHandler);
  agent.handleRequest(intentMap);
});

exports.reply = functions.https.onRequest((req, res) => {
  const MessagingResponse = twilio.twiml.MessagingResponse;
  let isValid = true;
  if (process.env.NODE_ENV === 'production') {
    isValid = twilio.validateExpressRequest(req, process.env.TWILIO_AUTH_TOKEN, {
      url: `https://${region}-${projectId}.cloudfunctions.net/reply`
    });
  }
  if (!isValid) {
    res.type('text/plain').status(403).send('Twilio Request Validation Failed.').end();
    return;
  }
  const response = new MessagingResponse();
  sendMessage(req.body.From, req.body.Body, dfResponse => {
    response.message(dfResponse !== "" ? dfResponse : "Sorry, i'm experiencing difficulties.");
    res.status(200).type('text/xml').end(response.toString());
  })
});

var sendMessage = (sessionID, inputText, callback) => {
  fetch(
    `https://${region}-${projectId}.cloudfunctions.net/dialogflowGateway`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sessionId: sessionID,
        queryInput: {
          text: {
            text: inputText,
            languageCode: "en-US",
          }
        },
      }),
    }
  )
    .then((response) => response.text())
    .then((text) => (text.length ? JSON.parse(text) : {}))
    .then(responseJson => {
      callback(responseJson.fulfillmentText);
      return
    })
    .catch((error) => {
      callback("");
      return
    });
}
