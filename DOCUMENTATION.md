# DOCUMENTATION

Professional documentation of implemented features.

## Index
- [Booking Management](#booking-management)

## Booking Management
The booking management system allows full control over reservation lifecycles.

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


