# News & News Alert System

## Overview
A **Node.js-based API** using **Express.js** and **MongoDB**, designed to fetch news, store favorites, and send automated email alerts.

## Features
- **News Retrieval** (`/api/news`) – Fetch top headlines via external API
- **User Authentication** (`/api/auth`) – Signup/Login functionality
- **Subscription System** (`/alert/subscribe`) – Users can subscribe for news updates
- **Favorite News Storage** (`/api/favorites`) – Users can save & manage favorite articles
- **Automated News Alerts** – Emails breaking news updates via `node-cron`
