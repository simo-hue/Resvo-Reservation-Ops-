# DOCUMENTATION

Professional documentation of implemented features.

## Index
- [Booking Management](#booking-management)

## Booking Management
The booking management system allows full control over reservation lifecycles.

### New Reservation Popup (Final Design)
The reservation form has been structured to optimize screen usage and logical flow, as per user specification:

**Structure:**
1.  **Top Row (2 Columns)**:
    *   **Left**: **Dati Cliente** (Blue). Focused on who is booking (Name, Phone, Email).
    *   **Right**: **Stato & Note** (Amber). Focused on operational status and special requests.
    *   This arrangement allows the user to quickly see *who* and *how* (status) at a glance.

2.  **Bottom Row (Full Width)**:
    *   **Dettagli Tavolo** (Green). Occupies the entire width of the dialog.
    *   **Internal Layout**: Arranged in 3 columns for maximum efficiency:
        *   Column 1: Date Selection.
        *   Column 2: Service & Time.
        *   Column 3: Guests & Table assignment.

**Responsive Behavior:**
*   **Mobile (<768px)**: Only one column. Cards are stacked vertically: Customer -> Status -> Table Details.
*   **Tablet/Desktop (>=768px)**: The 2-row layout described above activates. The dialog expands to 95vw to provide ample space.

### Pending Reservations
- **Visual Indicator**: Displayed with a "In Attesa" badge (yellow).
- **Confirm**: Click the green "Check" icon to confirm the reservation. This changes the status to "Confirmed" and moves it to the confirmed list.
- **Reschedule**: Click the "Edit" (pencil) icon to open the dialog and change date, time, or other details.
- **Delete**: Click the "Trash" icon to permanently delete the reservation (requires confirmation).

### Confirmed Reservations
- **Edit**: Fully editable via the "Edit" button.
- **Delete**: Can be removed if necessary.

### List Organization & Filters
- **Grouping**: Reservations are now grouped by Date.
- **Quick Filters**: Use the chips (Oggi, Domani, Weekend, etc.) to quickly filter by date range. Default view shows **Tutti** (All Upcoming) for ease of use.
- **Interactive Stats**: Click on "Oggi" or "In Arrivo" cards to apply instant filters.
- **Advanced Filters (Desktop)**: Single-row layout with Search, Service, Status and Reset.
- **Date Filters**: Modern "Segmented Control" style, centered on the page.

### Actions & Safety
- **Confirmation**: All critical actions (Confirm, Delete) require explicit confirmation via dialog.
