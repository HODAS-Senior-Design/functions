[![Build Status](https://travis-ci.com/HODAS-Senior-Design/functions.svg?token=tbxfz8apJpLfkPg1Qtiz&branch=master)](https://travis-ci.com/HODAS-Senior-Design/functions)
# Cloud Functions
## Description
Deployment pipeline for all webhook cloud functions deployed on Firebase project. Currently includes:
- Twilio Webhook (reply)
- Dialogflow Gateway (dialogflowGateway)
- Dialogflow fulfillment (dialogflowWebhook)

## Dialogflow
To see/edit Dialogflow intents, visit the [Dialogflow console](https://dialogflow.cloud.google.com/#/agent/hodas-f14c5/intents). To edit fulfillments, edit the `dialogflowWebhook` function by adding an async function to the `intentMap`.

## Deployment / Configuration
Chat bot is deployed on the number: `(818) 308-1069` to chat with.
Deploys directly to TravisCI and status of build is indicated on ticker above. To see deployment script, view `.travis.yml`. Means any commit to master will be reflected in deployment.
Access [Firebase project](https://console.firebase.google.com/project/hodas-f14c5/overview) to edit others aspects of project including realtime database, GoogleML, etc. Everyone should be admin users at Stevens email.
