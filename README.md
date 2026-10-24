# Telemama — Continuous Maternal & Newborn Monitoring and Alert System for Nigeria

Telemama is an Africa-first, low-bandwidth maternal and newborn surveillance and rapid emergency dispatch system designed to address Nigeria's maternal mortality crisis (over 512 maternal deaths per 100,000 live births) by tackling the **"Three Delays"**:
1. **Delay in recognizing danger signs**: Low-literacy daily check-ins with clear icons, simple English, and local Pidgin audio hints.
2. **Delay in reaching healthcare facilities**: Instant automated SMS and voice calls to nominated family guardians + one-tap community Tricycle (Keke) Ambulance dispatch.
3. **Delay in receiving clinical care**: Real-time triage feed for Primary Healthcare Centers (PHC) with WHO-grounded clinical protocols (e.g. Magnesium Sulfate loading dose for preeclampsia, Misoprostol/Oxytocin prep for PPH, Ampicillin/Gentamicin for neonatal sepsis).
4. **Zero-Data Universal Reach**: An interactive USSD feature phone engine (`*384*26#`) enabling rural mothers with $10 basic phones (Nokia, itel, Tecno) to report symptoms and trigger SOS with zero mobile data.

---

## 3-Minute Live Hackathon Pitch Guide

### Step 1: The Mother Experience (1 Minute)
1. Click **"Mother Portal"** in the top navigation.
2. Review the status card: *"You are safe and being watched over"*.
3. Tap on **"Severe Headache / Blurred Vision"** in the daily checklist (or toggle *"Show Simple Pidgin Hints"*).
4. Click **"Submit Check-in Confirmation"**.
5. Notice the instant status escalation to **High Alert / Red**, the simulated SMS toast to husband Babatunde Bello, and notification sent to Alimosho Comprehensive PHC.
6. Alternatively, click the huge red button: **"SEND SOS ALERT NOW"** to see emergency life support triggering with safety countdown!

### Step 2: The Family / Guardian Response (45 Seconds)
1. Click **"Family Support"** in the top navigation.
2. See the incoming critical alert for Amina Bello with plain-language first-aid guidance (*"Keep room dim and quiet. Do not force her to drink water. Prepare to accompany her immediately"*).
3. Click **"Dispatch Tricycle Ambulance (Keke)"** — driver status updates to *EN-ROUTE (ETA: ~12 mins)*.
4. Click **"I Am On My Way"** to ping the clinic and mother.

### Step 3: The Primary Healthcare Center (PHC) Clinic Dashboard (45 Seconds)
1. Click **"Facility Dashboard"**.
2. Review the **Triage Queue**: Red alerts are prioritized on top with exact clinical protocol recommendations (e.g., *Magnesium Sulfate Pritchard Regimen: 4g IV + 10g IM*).
3. Click **"Dispatch CHEW Home Visit"** or **"Mark Case Resolved"** to log clinical intervention.
4. Search the **Mothers Directory** by LGA (e.g. "Alimosho", "Kano", "Ibadan") or filter by risk level.

### Step 4: The Offline USSD Feature Phone Simulator (30 Seconds)
1. Click **"USSD (*384*26#)"**.
2. Click **"Auto-Dial *384*26#"** or use the interactive keypad on the vintage Nokia/itel phone.
3. Type `1` [Send] to run the 3-question daily danger sign check, or type `2` [Send] to trigger emergency panic SOS directly over USSD!

---

## Technical Stack & Architecture
- **Framework**: Angular 21 (Zoneless, Standalone Components, Reactive Signals)
- **Styling**: Tailwind CSS with custom Africa-first palette: Cream (`#F7F1E9`), Terracotta (`#C2410C`), Forest Green (`#15803D`), Charcoal (`#18181B`)
- **Triage Logic**: Pure, deterministic logic decoupled in `src/app/core/utils/triage.ts` with automated unit tests (`node:test`)
- **State Management**: Reactive signals with localStorage persistence in `MaternalStateService`
- **Accessibility**: High contrast, minimum 44px touch targets, screen-reader friendly accessible names, and audio note simulations for low-literacy users.
