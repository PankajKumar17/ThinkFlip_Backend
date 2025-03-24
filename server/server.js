import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

import { appConfig } from "./config/appConfig.js";
import AuthRouter from './routes/authRouter.js';
import GeminiRouter from './routes/geminiRouter.js';
import HistoryRouter from './routes/historyRouter.js';
import AccuracyRouter from './routes/nlpRoutes.js';


const app = express();
app.use(
  cors({
    origin: appConfig.corsConfig.origin,
    methods: appConfig.corsConfig.methods,
    allowedHeaders: ["Content-Type", "application/json"],
  })
);
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

import dotenv from 'dotenv';
dotenv.config();

import './models/db.js';


const PORT = process.env.PORT;

// Get Gemini API Response
app.use('/gemini', GeminiRouter);
app.use('/auth', AuthRouter);
app.use('/history', HistoryRouter);
app.use('/accuracy', AccuracyRouter);



app.listen(PORT, () => {
  console.log("Gemini AI Server is listening on port number", PORT);
});


