require('dotenv').config();
const express = require('express');
const cron = require('node-cron');
const nodemailer = require('nodemailer');
const { connectionDb } = require('../db');
const AlertModel = require('../models/NewsAlertModel');
const axios = require("axios");

connectionDb();

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const fetchNewsFromCurrentsAPI = async () => {
    try {
        const response = await axios.get(
            `https://newsapi.org/v2/top-headlines?country=us&apikey=${process.env.NEWS_API_KEY}`
        );
        return response.data.articles || [];
    } catch (error) {
        console.error('Error fetching news', error);
        return []
    }
};

const sendEmailNotification = async (user, news) => {
    const mailOptions = {
        from: process.env.EMAIL_USERNAME,
        to: user.email,
        subject: `Breaking News:${news.title}`,
        text: news.description || "No description available."
    };
    try {
        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully to", user.email)
    } catch (e) {
        console.error("Error sending email:", e);
    }
};

const sendNewsAlert = async (news) => {
    const users = await AlertModel.find({});
    users.forEach(async (user) => {
        if (user.preferences.notifications.includes("email")) {
            const filteredNews = news.filter((n) =>
                user.preferences.categories.includes(n.category || "general")
            );
            filteredNews.forEach(async (newsItem) => {
                await sendEmailNotification(user, newsItem);
                user.notificationsHistory.push({
                    title: newsItem.title,
                    category: newsItem.category || "general",
                    timeStamp: new Date(),
                    status: "sent",
                });
                await user.save();
            });
        }
    });
};

cron.schedule("0 * * * *", async () => {
  console.log("Fetching News....");
  const news = await fetchNewsFromCurrentsAPI();
  await sendNewsAlert(news);
});

module.exports = {
  sendNewsAlert,
  fetchNewsFromCurrentsAPI,
};