# 🚀 PathProof — AI-Powered Career Discovery & Intelligence Platform

<p align="center">
  <strong>Discover Your Potential. Explore Every Career. Build Your Future.</strong>
</p>

<p align="center">
  An intelligent career discovery and guidance platform designed to help students explore global career opportunities, understand their potential, and make informed decisions about their professional futures.
</p>

<p align="center">
  <a href="https://github.com/ttgahty-beep/PathProof">GitHub Repository</a> •
  <a href="https://path-proof-indol.vercel.app/">Live Application</a>
</p>

---

## 📌 Table of Contents

- [Introduction](#-introduction)
- [Problem Statement](#-problem-statement)
- [Project Objectives](#-project-objectives)
- [Key Features](#-key-features)
- [Career Domains](#-career-domains)
- [How PathProof Works](#-how-pathproof-works)
- [System Architecture](#-system-architecture)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Installation and Setup](#-installation-and-setup)
- [Environment Configuration](#-environment-configuration)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Security Considerations](#-security-considerations)
- [Future Enhancements](#-future-enhancements)
- [Project Contributors](#-project-contributors)
- [Acknowledgements](#-acknowledgements)
- [License](#-license)

---

## 🌟 Introduction

**PathProof** is an AI-powered career discovery and intelligence platform developed to address the challenges students face when choosing their educational and professional career paths.

Many students struggle to identify suitable career opportunities because of limited career awareness, fragmented information, uncertainty about required skills, and a lack of personalized guidance.

PathProof aims to bring career exploration and intelligent guidance into one platform.

Instead of limiting students to traditional career options, PathProof is designed to support exploration across multiple professional domains, including technology, healthcare, business, engineering, economics, education, science, creative industries, and other global career fields.

The platform combines career information, intelligent assistance, and career discovery tools to help users make more informed decisions.

## 🎯 Problem Statement

Students frequently encounter the following problems:

- Lack of awareness about career opportunities beyond traditional professions.
- Difficulty identifying career paths aligned with their interests and abilities.
- Limited access to personalized career guidance.
- Uncertainty about the skills and qualifications required for different professions.
- Difficulty understanding career progression and future opportunities.
- Career information scattered across multiple websites and platforms.
- Confusion when comparing different educational and professional pathways.

PathProof addresses these challenges by providing a centralized career discovery and intelligence experience.

## 🎯 Project Objectives

1. Provide students with access to a broad range of global career opportunities.
2. Improve career awareness beyond conventional professional fields.
3. Support informed career exploration and decision-making.
4. Use AI-powered assistance to make career guidance more accessible.
5. Help users understand career requirements and skill development pathways.
6. Create an accessible and organized career discovery experience.
7. Provide a foundation for intelligent and personalized career planning.

## ✨ Key Features

### 1. 🌍 Global Career Discovery

Explore career opportunities across different industries and professional domains.

The platform aims to support a broad career ecosystem rather than focusing exclusively on technology-related professions.

### 2. 🤖 AI-Powered Career Assistance

An intelligent assistant designed to help students understand career options, explore professional pathways, and obtain guidance during their career discovery journey.

### 3. 🧭 Career Exploration

Explore different professional fields and discover opportunities that may align with personal interests, educational backgrounds, and career goals.

### 4. 📚 Career Information

Understand different professions, their requirements, relevant skills, and potential professional development pathways.

### 5. 👤 User Account Management

User authentication and account-related functionality for accessing the platform's personalized experience.

### 6. 📊 Career Intelligence

Support career-related exploration and decision-making through organized information and intelligent guidance.

### 7. 🎓 Student-Centered Experience

Designed with students in mind, making career exploration more accessible, structured, and understandable.

---

## 🌐 Career Domains

PathProof is designed to support career exploration across multiple professional industries.

| Domain | Example Career Paths |
|---|---|
| Technology & IT | Software Engineer, AI Engineer, Cybersecurity Analyst |
| Healthcare & Medicine | Doctor, Nurse, Pharmacist, Medical Researcher |
| Business & Management | Business Analyst, Manager, Entrepreneur |
| Engineering | Civil, Mechanical, Electrical Engineer |
| Economics & Finance | Economist, Financial Analyst, Investment Analyst |
| Education | Teacher, Lecturer, Academic Researcher |
| Law & Legal Studies | Lawyer, Legal Advisor, Judge |
| Science & Research | Biologist, Physicist, Chemist |
| Arts & Design | Graphic Designer, Animator, UX Designer |
| Media & Communication | Journalist, Content Strategist, Media Producer |
| Agriculture & Environment | Agricultural Scientist, Environmental Specialist |
| Social Sciences | Psychologist, Sociologist, Social Researcher |

The career ecosystem is intended to remain expandable as additional professions and industries are introduced.

---

## 🔄 How PathProof Works

The general user journey:

1. **Access the Platform:** Open PathProof through the web application.
2. **Create an Account:** Register or sign in to access account-based functionality.
3. **Explore Careers:** Browse available professional fields and career opportunities.
4. **Discover Opportunities:** Investigate different career paths and their requirements.
5. **Get Intelligent Guidance:** Use available AI-powered assistance for career-related questions.
6. **Make Informed Decisions:** Use the available information to evaluate possible professional directions.

---

## 🏗️ System Architecture

PathProof follows a web-based client-server architecture.

### High-Level Architecture

```text
                 STUDENT / USER
                       |
                       v
                WEB APPLICATION
                       |
                       v
               REACT FRONTEND
                       |
                       v
             APPLICATION BACKEND
                       |
           +-----------+-----------+
           |           |           |
           v           v           v
       AUTH SYSTEM   AI SERVICE   API LAYER
           |           |           |
           v           v           v
       BCRYPT       GEMINI AI    EXPRESS
           |           |           |
           +-----------+-----------+
                       |
                       v
                  MYSQL DATABASE
                       |
                       v
                APPLICATION OUTPUT
                       |
                       v
                  USER INTERFACE
```

*Conceptual architecture overview
