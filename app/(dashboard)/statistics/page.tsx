export default function StatisticsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Statistiche e Analytics</h1>
                <p className="text-muted-foreground mt-1">
                    Dashboard completo con metriche e trend del ristorante
                </p>
            </div>

            <div className="bg-card rounded-lg border border-border p-12 text-center">
                <div className="max-w-md mx-auto space-y-4">
                    <div className="text-6xl">📊</div>
                    <h2 className="text-2xl font-semibold">Pagina in Sviluppo</h2>
                    <p className="text-muted-foreground">
                        Questa sezione conterrà:
                    </p>
                    <ul className="text-sm text-muted-foreground space-y-2 text-left">
                        <li>✅ Grafici prenotazioni nel tempo</li>
                        <li>✅ Analisi capacità media</li>
                        <li>✅ Giorni e orari più richiesti</li>
                        <li>✅ Tasso di no-show</li>
                        <li>✅ Media coperti per servizio</li>
                        <li>✅ Export dati in CSV</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
