/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk-core');

const Spreadsheet = require("./lib/Spreadsheet");

const Blips = require("./lib/models/Blips");
const Themes = require("./lib/models/Themes");
const Responses = require("./lib/models/Responses");

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
    const search = { quadrant, ring };
    const data = await blips.find(search);

    if(data.length === 0){
      speechText = `there are currently no ${quadrant} in ${ring}`;
    } else if(data.length === 1) {
      speechText = `${data[0].title} is in ${ring} <break time="1s"/> ${data[0].lead}`;
    } else {
      let responses = [`there are currently ${data.length} ${quadrant} in ${ring}. They are: `];

      data.forEach((blip)=> {
        responses.push(`${blip.title}, `);
      });
      responses.push(". What would you like to know more about?");

      speechText = responses.join(' ');
    }

    return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(`You can say, 'Tell me about ${data[0].title}' for more information`)
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
  async handle(handlerInput){
    const slots =  handlerInput.requestEnvelope.request.intent.slots;
    const name = slots.Blip.value;
    const blips = new Blips(db);
    const data = await blips.find({ name });

    if(data.length < 1){
      speechText = `I would love to tell you more about ${name}, however I cannot find anything in my database.`;
    } else {
      speechText = `${data[0].name} is in ${data[0].ring}. <break time="1s"/> ${data[0].lead}`;
    }

    return handlerInput.responseBuilder
      .speak(speechText)
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

const NewIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'NewIntent';
  },
  async handle(handlerInput){
    let speechText = "This is the new blip intent";
    let search = '';
    const slots =  handlerInput.requestEnvelope.request.intent.slots;

    const quadrant = slots.Quadrant.value;
    const ring = slots.Ring.value;

    let filter = {
      "new" : "TRUE"
    };

    if(quadrant) {
      filter['quadrant'] = quadrant;
      search = quadrant;
    } else if(ring) {
      filter['ring'] = quadrant;
      search = quadrant;
    }

    const blips = new Blips(db);
    const data = await blips.find(filter);

    if(data.length === 0){
      speechText = `there are currently no new blips in ${search}`;
    } else {
      speechText = `${data[0].title} is a new blip in ${search} <break time="1s"/> ${data[0].lead}`;
    }

    return handlerInput.responseBuilder
      .speak(speechText)
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
      .speak('I\'m sorry, my responses are limited. You must ask the right questions.')
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
    NewIntentHandler,
    WhatIsTheRadarIntentHandler,
    WhatThemesIntentHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
