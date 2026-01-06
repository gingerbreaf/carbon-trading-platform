# TechTrek 2026
## Hackathon Readiness Clinic

---

## DBS TechTrek 2026 – Hackathon Readiness Clinic

### Introduction

Climate change is one of the biggest challenges facing our planet today. One of the key strategies to combat climate change is reducing greenhouse gas emissions, particularly carbon dioxide (CO₂). Carbon credits are a market-based solution to help businesses offset their carbon emissions by investing in projects that reduce or capture CO₂, such as renewable energy or reforestation projects.

As the demand for carbon credits grows, it becomes essential to create an efficient, transparent, and user-friendly platform that enables businesses to trade carbon credits seamlessly. This platform should foster trust, ensure fair pricing, and help users track and manage their carbon offsets effectively.

### Challenge Statement

Your task is to design and develop a carbon credit trading platform that allows users, such as companies, to trade carbon credits. The application should offer essential features such as viewing their available carbon credits, purchasing additional carbon credits from other companies, and selling carbon credits to other companies. This must be a web application.

All the requirements included below are meant to be a guideline to guide your team on how to tackle this challenge statement. While going through the requirements think about the following guiding questions:

- What are the features to prioritise and implement?
- How will you implement them?
- What are your considerations?

---

## Requirements

*For each module, there will be a Frontend task and an accompanying Backend task as illustrated by the table below.*

### Module: Login

| Component | Requirements |
|-----------|--------------|
| **[1] Frontend** | Users must be able to login |
| **[1] Backend** | Server must be able to authenticate a user's identity using JSON Web Tokens for authentication |

### Module: Landing Page

| Component | Requirements |
|-----------|--------------|
| **[2] Frontend** | Display company's outstanding balances for:<br>• Carbon Credits<br>• Cash Balances |
| **[2] Backend** | Return user's balance details from `companyAccountBalance` and `company` table:<br>`companyName`, `carbonBalance` and `cashBalance` |
| **[3] Frontend** | Display all outstanding requests made by your company with the following details:<br>• Request Date<br>• Company Name<br>• Carbon Price (SGD/Tonnes)<br>• Carbon Quantity<br>• Requesting Reason<br>• Request Type (Buy/Sell) |
| **[3] Backend** | Return a list of outstanding requests from the `outstandingRequest` and `company` tables:<br>`companyName`, `requestDate`, `carbonUnitPrice`, `carbonQuantity`, `requestReason` and `RequestType` |
| **[4] Frontend** | Insert/Edit/Delete requests made to another company with the following details:<br>• Request Date<br>• Company Name<br>• Carbon Price (SGD/Tonnes)<br>• Carbon Quantity<br>• Requesting Reason<br>• Request Type (Buy/Sell) |
| **[4] Backend** | Able to create new requests, edit the request and delete the request from `outstandingRequest` table. Creating requests should also update the `requestReceived` table |

### Module: Requests Received Page

| Component | Requirements |
|-----------|--------------|
| **[5] Frontend** | Display all outstanding requests made from other companies with the following details:<br>• Request Date<br>• Requestor Company Name<br>• Carbon Price (SGD/Tonnes)<br>• Carbon Quantity<br>• Requesting Reason<br>• Request Type (Buy/Sell) |
| **[5] Backend** | Return a list of outstanding requests from the `outstandingRequest` and `company` tables:<br>`requestorCompanyName`, `requestDate`, `carbonUnitPrice`, `carbonQuantity`, `requestReason` and `RequestType` |
| **[6] Frontend** | Create a button to Accept / Reject as well as checkbox to Bulk Accept / Reject requests made from other companies |
| **[6] Backend** | Update the database for `outstandingRequest` table to indicate accept / reject status. Updates the corresponding account balances in `companyAccountBalance` table |
| **[7] Frontend** | Functionality upon entering the page to alert users via pop-up message for overdue requests (defined as 7 days after request date) |
| **[7] Backend** | Returns and updates alerts as well as its view status stored within the `requestReceived` Table |

---

## Bonus Challenges

### Creating a Dashboard / Visualisation(s) to provide insights to companies:

#### Dashboard

| Component | Requirements |
|-----------|--------------|
| **[B1] Frontend** | Display Data Visualisation tables or charts |
| **[B1] Backend** | Come up with simple visualisations deemed appropriate. E.g. Time series of requests in a particular month, time series of settlement prices, charts of request approval rates |
| **[B2] Frontend** | Display useful insights from data |
| **[B2] Backend** | Provide insights from the data visualized and corresponding recommendations for the company. You may incorporate external datasets for real carbon transactions |

### Creating a Multi-Layer Approval Workflows for requests:

#### Multi-Layer Approval Workflow

| Component | Requirements |
|-----------|--------------|
| **[B3] Frontend** | Requires for multiple approvers to approve a single request before it can be processed |
| **[B3] Backend** | Modify the workflow and tables to require more than one approver before the request is set to approved and is processed |

---

## Basic Application Requirements (Integrate)

- Integration is a crucial requirement for this hackathon. The frontend and backend components should be integrated seamlessly.

## Basic Application Requirements (Frontend)

- You must render a login page
  - User must be able to login **[1]**
- You must render a landing page
  - Display user's current balances **[2]**
  - Display user's existing requests **[3]**
    - Company Name
    - Request Type
    - Carbon Price
    - Carbon Quantity
    - Requesting Reason
    - Request Date Timestamp
- User must be able to:
  - Create new Buy/Sell requests **[4]**
  - Edit existing requests made by their companies **[4]**
    - Edit one or more Buy/Sell requests from the landing page
    - User should not be able to edit requests of completed requests
  - Remove (Delete) pending requests made by their companies **[4]**
    - Remove one or more existing Buy/Sell requests
  - View requests made from other companies to them **[5]**
  - Accept/Reject requests made from other companies **[6]**
  - Be alerted of overdue requests **[7]**

## Basic Application Requirements (Backend)

- You must set up a valid authentication API
  - Server must be able to authenticate a user's identity **[1]**
- You must set up the respective API with the following functionalities:
  - Return user's current balances **[2]**
  - Display user's outstanding requests from the `outstandingRequests` table **[3]**
  - Insert requests provided by backend into the `outstandingRequests` and `requestsReceived` table **[4]**
  - Edit outstanding requests made by user's company in the `outstandingRequests` table and ensure it is updated for each change **[4]**
  - Delete requests from `outstandingRequests` table **[4]**
  - View requests made from other companies from the `outstandingRequests` table **[5]**
  - Accept/Reject requests made from other companies and update the `outstandingRequests` table accordingly **[5] [6]**
  - Update companies' account balances accordingly in the `companyAccountBalances` table **[5]**
  - Provide alerts for overdue requests from the `requestReceived` table **[7]**