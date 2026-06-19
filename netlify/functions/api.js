const serverless = require("serverless-http");
const { app } = require("../../src/server");

const handler = serverless(app, { provider: "aws" });
const BASE = "/.netlify/functions/api";

exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  // Netlify funksiya yo'lini Express ko'radigan "/api/..." ko'rinishiga keltiramiz
  if (event.path && event.path.indexOf(BASE) === 0) {
    event.path = event.path.slice(BASE.length) || "/";
  }
  return handler(event, context);
};
