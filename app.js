const express = require('express');
require('dotenv').config();
const cors = require('cors');
const app = express();
const axios = require('axios');
const PORT = process.env.port;

app.use(express.json());
app.use(cors({ origin: "*" }));

const LoanHistoryRouter = require('./loanHistory.js');
const LoanRequestRouter = require('./loanRequest.js');
const LoanResponseRouter = require('./loanResponse.js');
const LoanPendingRouter = require('./loanPending.js');

app.use('/loan_history', LoanHistoryRouter);
app.use('/loan_request', LoanRequestRouter);
app.use('/loan_response', LoanResponseRouter);
app.use('/loan_pending', LoanPendingRouter);

app.listen(PORT, async () => {
    console.log(`Listening on port ${PORT}`);

    try {
        let serviceRegisterUrl = String(process.env.serviceRegistryUrl) + "/register";
    
        await axios.post(serviceRegisterUrl, {
          name: process.env.selfName,
          url: process.env.selfUrl,
        });
        console.log("Service registered successfully");
      } catch (error) {
        console.error("Failed to register service:", error);
        process.exit(1);
      }
});

const deregisterService = async () => {
    try {
      let serviceRegisterUrl =
        String(process.env.serviceRegistryUrl) + "/deregister";
      await axios.post(serviceRegisterUrl, { name: process.env.selfName });
      console.log("Service de-registered successfully");
    } catch (error) {
      console.log("Failed to de-register service:", error);
      process.exit(1);
    }
  };

const gracefulShutdown = async () => {
    await deregisterService();
    process.exit(0);
};

process.on('SIGTERM', gracefulShutdown); // For termination signal
process.on('SIGINT', gracefulShutdown); // For interrupt signal
process.on('uncaughtException', gracefulShutdown); // For uncaught exceptions