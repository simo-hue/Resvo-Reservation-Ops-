# TO_SIMO.md - Operazioni Manuali

### ✅ FASE 2: Restaurant Settings (COMPLETATA)

**Prerequisito**: Devi essere loggato!

#### Test 2.1: Caricamento Dati Iniziali
**Passi:**
1. Login per la prima volta (o dopo aver svuotato il DB)
2. Vai su `/settings/restaurant`
3. Tab "Generale"

**Risultato Atteso:**
- ✅ Form precompilato con dati default o esistenti
- ✅ Nome ristorante visibile
- ✅ Capacità pranzo: 80, Cena: 100
- ✅ Durata media tavolo: 120 minuti

#### Test 2.2: Modifica Settings Generali
**Passi:**
1. Tab Generale" in `/settings/restaurant`
2. Cambia nome ristorante (es: "Il Mio Ristorante")
3. Cambia capacità pranzo a 60
4. Cambia capacità cena a 90
5. Click "Salva Modifiche"

**Risultato Atteso:**
- ✅ Toast verde "Impostazioni salvate con successo!"
- ✅ Se ricarichi la pagina (F5), i dati sono ancora lì
- ✅ Controlla su Supabase Dashboard → Table Editor → `restaurants`

#### Test 2.3: Verifica Persistenza su Supabase
**Passi:**
1. Dopo aver salvato modifiche al ristorante
2. Vai su **Supabase Dashboard**
3. Table Editor → `restaurants`
4. Verifica il record

**Risultato Atteso:**
- ✅ C'è 1 record nella tabella `restaurants`
- ✅ `user_id` corrisponde al tuo user ID
- ✅ `name` è quello che hai inserito
- ✅ `max_capacity_lunch` e `max_capacity_dinner` corretti

---

### ✅ FASE 3: Gestione Spazi (COMPLETATA)

**Prerequisito**: Login + vai su `/settings/restaurant` → Tab "Tavoli"

#### Test 3.1: Visualizzazione Spazi Predefiniti
**Passi:**
1. Vai al tab "Tavoli"
2. Cerca la sezione "Gestione Spazi"

**Risultato Atteso:**
- ✅ Vedi 3 spazi predefiniti:
  - Interno (badge "Predefinito")
  - Esterno (badge "Predefinito")
  - Veranda (badge "Predefinito")
- ✅ Ogni spazio mostra "X tavoli" (10 totali dal seed)

#### Test 3.2: Creazione Spazio Custom
**Passi:**
1. Click "Aggiungi Spazio"
2. Nome Spazio: "Terrazza"
3. Valore Identificativo: "terrazza"
4. Click "Crea Spazio"

**Risultato Atteso:**
- ✅ Toast verde "Spazio aggiunto!"
- ✅ Il nuovo spazio appare nella lista
- ✅ NON ha badge "Predefinito"

#### Test 3.3: Modifica Spazio Custom
**Passi:**
1. Click icona "✏️" su "Terrazza"
2. Cambia nome in "Giardino"
3. Cambia valore in "giardino"
4. Click "Aggiorna Spazio"

**Risultato Atteso:**
- ✅ Toast verde "Spazio aggiornato!"
- ✅ Nome cambiato visibile immediatamente

#### Test 3.4: Tentativo Modifica Spazio Predefinito
**Passi:**
1. Click "✏️" su "Interno" (predefinito)
2. Prova a cambiare il valore identificativo
3. Nota che il campo è disabilitato

**Risultato Atteso:**
- ✅ Puoi cambiare solo il "label" (nome visualizzato)
- ✅ Il campo "valore" è disabilitato (grigio)
- ✅ Messaggio: "Il valore degli spazi predefiniti non può essere modificato"

#### Test 3.5: Eliminazione Spazio (senza tavoli)
**Passi:**
1. Click "🗑️" su "Terrazza" (custom, senza tavoli)
2. Conferma eliminazione

**Risultato Atteso:**
- ✅ Toast verde "Spazio eliminato!"
- ✅ Spazio rimosso dalla lista

#### Test 3.6: Tentativo Eliminazione Spazio con Tavoli
**Passi:**
1. Crea uno spazio "Test"
2. Crea un tavolo assegnato a "Test"
3. Click "🗑️" su spazio "Test"

**Risultato Atteso:**
- ✅ Toast rosso: "Impossibile eliminare lo spazio: ci sono X tavoli"
- ✅ Spazio NON eliminato
- ✅ Prima devi spostare/eliminare i tavoli

---

### ✅ FASE 4: Gestione Tavoli (COMPLETATA)

**Prerequisito**: Login + `/settings/restaurant` → Tab "Tavoli"

#### Test 4.1: Visualizzazione Tavoli Iniziali
**Passi:**
1. Guarda la sezione "Gestione Tavoli"

**Risultato Atteso:**
- ✅ Vedi 10 tavoli creati dal seed data
- ✅ Raggruppati per posizione (Interno, Esterno, Veranda)
- ✅ Statistiche in alto:
  - Tavoli Totali: 10
  - Posti Totali: somma capacità
  - Tavoli Attivi: 10

#### Test 4.2: Creazione Nuovo Tavolo
**Passi:**
1. Click "Aggiungi Tavolo"
2. Numero Tavolo: "11"
3. Capacità: 4
4. Posizione: "Interno"
5. Click "Crea Tavolo"

**Risultato Atteso:**
- ✅ Toast verde "Tavolo aggiunto!"
- ✅ Tavolo 11 appare nella sezione "Interno"
- ✅ Statistiche aggiornate (Tavoli Totali: 11)

#### Test 4.3: Modifica Tavolo
**Passi:**
1. Click "✏️" su tavolo esistente
2. Cambia capacità da 2 a 4
3. Cambia posizione da "Interno" a "Esterno"
4. Click "Aggiorna Tavolo"

**Risultato Atteso:**
- ✅ Toast verde "Tavolo aggiornato!"
- ✅ Tavolo spostato nella sezione corretta
- ✅ Capacità visibile aggiornata

#### Test 4.4: Eliminazione Tavolo
**Passi:**
1. Click "🗑️" su un tavolo
2. Conferma

**Risultato Atteso:**
- ✅ Toast verde "Tavolo eliminato"
- ✅ Tavolo rimosso dalla lista
- ✅ Statistiche aggiornate

---

### ✅ FASE 4: Reservations Service (COMPLETATA)

**Prerequisito**: Avere il database Supabase collegato.

#### Test 4.1: Verifica Service
**Passi:**
1. Il servizio `reservations.service.ts` è attivo e integrato.
2. Le chiamate CRUD (Create, Read, Update, Delete) sono funzionanti.

---

### ✅ FASE 5: Calendario e Lista Prenotazioni (COMPLETATA)

**Prerequisito**: Login + `/reservations` o Dashboard (Home)

#### Test 5.1: Lista Prenotazioni
**Passi:**
1. Vai su `/reservations`
2. Verifica che la lista mostri le prenotazioni dal DB
3. Prova i filtri (Servizio, Stato, Ricerca)

#### Test 5.2: Calendario (Day View)
**Passi:**
1. Seleziona un giorno nel calendario o clicca "Giorno"
2. Verifica che le prenotazioni appaiano negli slot corretti
3. Verifica che i contatori (coperti, occupazione) siano reali

---
