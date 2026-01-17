export default function ReservationsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Gestione Prenotazioni</h1>
                <p className="text-muted-foreground mt-1">
                    Lista completa di tutte le prenotazioni con filtri e ricerca
                </p>
            </div>

            <div className="bg-card rounded-lg border border-border p-12 text-center">
                <div className="max-w-md mx-auto space-y-4">
                    <div className="text-6xl">📋</div>
                    <h2 className="text-2xl font-semibold">Pagina in Sviluppo</h2>
                    <p className="text-muted-foreground">
                        Questa sezione conterrà:
                    </p>
                    <ul className="text-sm text-muted-foreground space-y-2 text-left">
                        <li>✅ Form per creare nuove prenotazioni</li>
                        <li>✅ Lista completa con filtri (data, servizio, stato)</li>
                        <li>✅ Ricerca per nome cliente o telefono</li>
                        <li>✅ Modifica e cancellazione prenotazioni</li>
                        <li>✅ Assegnazione tavoli automatica</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
