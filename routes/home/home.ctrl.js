"use strict";

// const UserStorage=require("../../models/UserStorage");
const User=require("../../models/User");

const output={
    home: (req, res) => {
        res.render("home/index");
    },
    login:(req,res)=>{
        res.render("home/login");
    },
    register:(req,res)=>{
        res.render("home/register");
    },
    calendar:(req,res)=>{
        if (req.session.user) {
            res.render("home/calendar");
        } else {
            res.redirect("/login");
        }
    },
    timer:(req,res)=>{
        if (req.session.user) {
            res.render("home/timer");
        } else {
            res.redirect("/login");
        }
    },
    post:(req,res)=>{
        if (req.session.user) {
            res.render("home/post");
        } else {
            res.redirect("/login");
        }
    },
};

const process={
    login: async (req, res) => {
        const user = new User(req.body);
        const response = await user.login();
    
        if (response.success) {
            req.session.user = {
                id: user.body.id,
                name: user.body.name,
            };
        }
    
        return res.json(response);
    },
    register:async(req,res)=>{
        const user=new User(req.body);
        const response=await user.register();
        return res.json(response);
    },
    logout: (req, res) => {
        req.session.destroy((err) => {
        if (err) {
            console.error("세션 제거 오류:", err);
        }
            res.redirect("/");
        });
    },
}

module.exports={
    output,
    process,
}