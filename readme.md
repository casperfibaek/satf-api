# Savings at the Frontiers - Application Programming Interface (REST)

This is the API for the SATF tool and communication with the database.

The API is built using Typescript and ExpressJS.

_Author_: **Casper Fibaek**

_Copyright_: **NIRAS A/S and Casper Fibaek**

_License_: **Undisclosed**

# File descriptions

### **server.ts**

Defines the server, port, cache and headers for the API.

### **index.ts**

Holds all the routes (endpoints) used by the API. Everything uses the async/await syntax.

### **validators.ts**

A range of validators for the input data. Eg. test if input is really a coordinate.

# Installation

Steps for installation:
Running at http://satf-api.azurewebsites.net/

    1. Compile the typescript using npm run build
    2. Deploy the server to azure using the app-service functionality.

# Building:

    1. Run npm run build (requires typescript installed globally)
