# TO SIMO DO

## Verification
- [ ] **Check Date Filters**: Verify that the "Segmented Control" is centered on Desktop and scrolls smoothly on Mobile.
- [ ] **Test Weekend Logic**: Click "Weekend" and ensure it shows Saturday/Sunday of the *current* week.
- [ ] **Test Confirmations**: Try to "Confirm" a pending reservation and ensure the popup appears.
- [ ] **Mobile Responsiveness**: Resize the browser to mobile width and ensure the filters stack correctly.
- [ ] **Desktop FAB**: Check that the circular "+" button is now visible on the bottom right of the desktop screen and opens the new reservation dialog.
- [ ] **Scroll Padding**: Verify that you can scroll down enough so the last reservation is not covered by the FAB on desktop.
- [ ] **Smart FAB Visibility**: 
    - Verify that the circular "+" button is **HIDDEN** when the "Nuova Prenotazione" button at the top is visible.
    - Verify that the circular "+" button **APPEARS** when you scroll down and the top button goes out of view.
    - Test this on both Desktop and Mobile.
