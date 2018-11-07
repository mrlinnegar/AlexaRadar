/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk-core');

const Spreadsheet = require("./lib/Spreadsheet");
const Blips = require("./lib/Blips");
const Themes = require("./lib/Themes");
const Responses = require("./lib/Responses");

const db = new Spreadsheet();

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  async handle(handlerInput) {
    let speechText, repromtText = "";
    try {
      let responses = new Responses(db);
      const data = await responses.all();
      speechText = data.Welcome.message;
      repromtText = data.Welcome.reprompt;
    } catch (e) {
      speechText = "Welcome to the Thoughtworks Tech Radar";
      repromtText = "You can ask about themes, or what tools are in assess";
    }

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(repromtText)
      .getResponse();
  },
};

const WhatInIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'WhatInIntent';
  },
  async handle(handlerInput) {

    const slots =    handlerInput.requestEnvelope.request.intent.slots;
    const quadrant = slots.Quadrant.value;
    const ring =     slots.Ring.value;
    let speechText = "";
    let blips = new Blips(db);

    const data = await blips.all();

    console.log(`Filtering ${quadrant} and ${ring}`);
    let filteredData = data.filter((row)=> {
      return (row.quadrant === quadrant && row.ring === ring);
    });

    if(filteredData.length > 0){
      speechText = `${filteredData[0].title} is in ${ring} <break time="1s"/> ${filteredData[0].lead}<break time="2s"/>`;
    } else {
      speechText = `there are currently no ${quadrant} in ${ring}`;
    }

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt("Would you like to know more?")
      .withShouldEndSession(false)
      .getResponse();
  },
};


const WhatThemesIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'WhatThemesIntent';
  },
  async handle(handlerInput) {
    let themes = new Themes(db);
    const data = await themes.all();
    let speech = [];
    let speechText = "";

    data.forEach((theme)=> {
      speech.push( theme.title + '<break time="1s"/>' );
      speech.push( theme.lead + '<break time="1.5s"/>' );
    });

    if(speech.length > 0){
      speechText = speech.join(' ');
    } else {
      speechText = `there are no themes found`;
    }
    return handlerInput.responseBuilder
      .speak(speechText)
      .getResponse();
  },
};

const BlipInformationIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'BlipInformationIntent';
  },
  handle(handlerInput){
    const slots =  handlerInput.requestEnvelope.request.intent.slots;
    const blip = slots.Blip.value;

    return handlerInput.responseBuilder
      .speak(`I would love to tell you more about ${blip} however I cannot respond yet.`)
      .getResponse();
  }
};


const ExplainWhatIntentHander = {
  canHandle(handlerInput){
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'ExplainWhatIntent';
  },
  handle(handlerInput){
    const speechText = "Hello World";
    const responseText = "Hello Hello World";

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(repromptText)
      .getResponse();
  }
};

const WhatIsTheRadarIntentHandler = {
  canHandle(handlerInput){
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'WhatIsTheRadarIntent';
  },
  async handle(handlerInput) {
    let speechText = "";
    try {
      let responses = new Responses(db);
      const data = await responses.all();
      speechText = data.WhatIsTheRadar.message;
    } catch (error) {
      speechText = "The Thoughtworks Tech Radar";
    } finally {
      return handlerInput.responseBuilder
        .speak(speechText)
        .getResponse();
    }
  }
};

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  async handle(handlerInput) {
    let responses = new Responses(db);
    const data = await responses.all();

    const speechText = data.Help.message;
    const repromptText = data.Help.reprompt;

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(repromptText)
      .getResponse();
  },
};

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
        || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {

    const speechText = 'Goodbye!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(error);
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('Sorry, I can\'t understand the command. Please say again.')
      .reprompt('Sorry, I can\'t understand the command. Please say again.')
      .getResponse();
  },
};

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler,
    WhatInIntentHandler,
    ExplainWhatIntentHander,
    BlipInformationIntentHandler,
    WhatIsTheRadarIntentHandler,
    WhatThemesIntentHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
