"use strict";

const express=require("express");
const dotenv=require("dotenv");
const morgan=require("morgan");
const bodyParser = require('body-parser');
const session = require("express-session");

const app=express();
dotenv.config();

app.use(session({
    secret: process.env.SESSION_SECRET, // 세션 데이터 암호화를 위한 비밀 키
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false, // HTTPS를 사용하는 경우 true로 설정
      maxAge: 3600000, // 세션 만료 시간 (1시간)
    },
  }));

const home=require("./routes/home");
const accessLogStream=require("./config/log");

app.set("views","./views");
app.set("view engine","ejs");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(`${__dirname}/public`));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(morgan("dev"));
app.use(morgan("common",{stream:accessLogStream}));
app.use("/",home);

module.exports=app;
