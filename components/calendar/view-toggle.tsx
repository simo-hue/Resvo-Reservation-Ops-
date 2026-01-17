import { Button } from '@/components/ui/button';
import { Calendar, CalendarDays, CalendarRange } from 'lucide-react';

type ViewType = 'month' | 'week';

interface ViewToggleProps {
    viewType: ViewType;
    onViewTypeChange: (type: ViewType) => void;
}

export function ViewToggle({ viewType, onViewTypeChange }: ViewToggleProps) {
    return (
        <div className="inline-flex items-center gap-1 bg-secondary/50 rounded-lg p-1">
            <Button
                variant={viewType === 'month' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onViewTypeChange('month')}
                className="gap-2 h-9 px-4"
            >
                <Calendar className="h-4 w-4" />
                <span className="font-medium">Mese</span>
            </Button>
            <Button
                variant={viewType === 'week' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onViewTypeChange('week')}
                className="gap-2 h-9 px-4"
            >
                <CalendarDays className="h-4 w-4" />
                <span className="font-medium">Settimana</span>
            </Button>
        </div>
    );
}
