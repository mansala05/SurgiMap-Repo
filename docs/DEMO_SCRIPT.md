# SurgiMap Demo Walkthrough Script

## 1. Introduction

Hello, we are Team Shadow Stack, and our project is SurgiMap.

SurgiMap is a healthcare prototype designed to help patients and relatives quickly find nearby pharmacies that have urgent surgical kits available.

During medical emergencies, families often have to call or physically visit many pharmacies to check whether a required surgical kit is available. This wastes time and increases stress. SurgiMap tries to reduce this problem by giving users one simple search platform.

## 2. Solution Overview

Our system allows a user to search for a surgical kit name. Then the platform shows nearby pharmacies where that kit is either Available or Low Stock.

Each result shows the pharmacy name, address, distance, last updated time, availability status, and contact options such as Call, WhatsApp, and Map.

For this hackathon MVP, we simulate pharmacy inventory systems using 10 dummy SQLite databases. A Python Local Sync Agent reads those pharmacy databases, normalizes item names using a master catalog, and sends the inventory data to a FastAPI backend.

The React frontend then allows users to search this centralized inventory data.

## 3. Architecture Explanation

Our architecture has five main parts.

First, we have 10 dummy SQLite pharmacy databases. These represent independent pharmacy inventory systems.

Second, we have the Python Local Sync Agent. It reads the pharmacy stock data, converts different local item names into standard surgical kit names, calculates the stock status, and sends the data to the backend.

Third, we have the FastAPI backend. It receives the synced inventory data, records searches, filters out zero stock, and provides the search API.

Fourth, we have the central database. PostgreSQL is used for the proposal-aligned setup, while SQLite remains available as a zero-setup fallback for the local demo.

Fifth, we have the React frontend. This is the user-facing interface where patients or relatives can search for surgical kits, view results on a map, and contact pharmacies.

## 4. Live Demo Flow

Now we will show the working demo.

First, we start the FastAPI backend.

Then we run the Python Sync Agent. The sync agent reads all 10 pharmacy databases and sends 50 inventory records to the backend.

Now we open the React frontend.

Let us search for “caesarean”.

The browser asks for location permission. When we allow it, the backend calculates distance and returns the nearest matching pharmacies first. If location is unavailable, the core search still works using stock-level ordering.

The system shows only pharmacies where the Caesarean Surgical Kit is Available or Low Stock. Pharmacies where the item is Not Available are hidden from the user.

Each pharmacy card shows the availability badge, address, distance, last updated time, and contact buttons.

The interface intentionally shows the simple Available or Low Stock status instead of exposing complex inventory quantities. If an update is older than one hour, SurgiMap warns the user to call before travelling.

The user can call the pharmacy, contact through WhatsApp, or open the map location before travelling.

## 5. Master Catalog Feature

Different pharmacies may use different names for the same surgical kit. For example, one pharmacy may call it “C Section Kit”, while another may call it “Cesarean Kit”.

Our master catalog maps these different local names into one standard name: “Caesarean Surgical Kit”.

This makes the search more reliable and user-friendly.

## 6. Sync Update Demonstration

Now we demonstrate the sync behavior.

We update the stock quantity of one item in a local pharmacy database.

After that, we run the Sync Agent again.

The backend receives the updated inventory data.

When we search again in the frontend, the result list changes according to the updated stock status.

This shows how the system can simulate pharmacy inventory updates through the sync agent.

## 7. Impact

SurgiMap can reduce the time and stress involved in finding urgent surgical kits.

Instead of calling many pharmacies one by one, users can search once, find possible pharmacies, and verify availability before travelling.

This can support faster decision-making during medical emergencies.

## 8. Future Improvements

In the future, this prototype can be improved by connecting real pharmacy inventory systems using safe read-only access.

We can also add secure role-based pharmacy/admin authentication, pharmacy dashboards, more medical items, demand analytics, and real read-only pharmacy connectors. Those operational portals are intentionally kept outside this patient-search MVP so the demo does not present mock login behavior as a finished security feature.

## 9. Closing

SurgiMap is not just a pharmacy listing website. It demonstrates a practical inventory-sync approach for emergency healthcare supply discovery.

Thank you.
