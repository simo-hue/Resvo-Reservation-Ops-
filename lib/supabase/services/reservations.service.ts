import { supabase } from '../client';
import type { Reservation, ServiceType, ReservationStatus } from '@/types';
import { formatDateForDatabase } from '@/lib/utils/date-utils';


export interface ReservationFilters {
    serviceType?: ServiceType;
    status?: ReservationStatus;
    startDate?: Date;
    endDate?: Date;
    search?: string;
}

export class ReservationsService {
    /**
     * Get all reservations for a restaurant with optional filters
     */
    async getReservations(restaurantId: string, filters?: ReservationFilters): Promise<Reservation[]> {
        let query = supabase
            .from('reservations')
            .select('*, table:tables(*)')
            .eq('restaurant_id', restaurantId);

        // Apply filters
        if (filters?.serviceType) {
            query = query.eq('service_type', filters.serviceType);
        }

        if (filters?.status) {
            query = query.eq('status', filters.status);
        }

        if (filters?.startDate) {
            query = query.gte('reservation_date', formatDateForDatabase(filters.startDate));

        }

        if (filters?.endDate) {
            query = query.lte('reservation_date', formatDateForDatabase(filters.endDate));

        }

        if (filters?.search) {
            const searchTerm = `%${filters.search}%`;
            query = query.or(`customer_name.ilike.${searchTerm},customer_phone.ilike.${searchTerm},customer_email.ilike.${searchTerm}`);
        }

        // Order by date and time
        query = query.order('reservation_date', { ascending: true }).order('reservation_time', { ascending: true });

        const { data, error } = await query;

        if (error) {
            console.error('Error fetching reservations:', error);
            throw new Error('Failed to fetch reservations');
        }

        return data.map(this.mapToReservation);
    }

    /**
     * Get reservations for a specific date and optional service
     */
    async getReservationsByDate(
        restaurantId: string,
        date: Date,
        serviceType?: ServiceType
    ): Promise<Reservation[]> {
        const dateStr = formatDateForDatabase(date);


        let query = supabase
            .from('reservations')
            .select('*, table:tables(*)')
            .eq('restaurant_id', restaurantId)
            .eq('reservation_date', dateStr);

        if (serviceType) {
            query = query.eq('service_type', serviceType);
        }

        query = query.order('reservation_time', { ascending: true });

        const { data, error } = await query;

        if (error) {
            console.error('Error fetching reservations by date:', error);
            throw new Error('Failed to fetch reservations');
        }

        return data.map(this.mapToReservation);
    }

    /**
     * Get reservations for a period (e.g., month, week)
     */
    async getReservationsForPeriod(
        restaurantId: string,
        startDate: Date,
        endDate: Date
    ): Promise<Reservation[]> {
        const startStr = formatDateForDatabase(startDate);
        const endStr = formatDateForDatabase(endDate);


        const { data, error } = await supabase
            .from('reservations')
            .select('*, table:tables(*)')
            .eq('restaurant_id', restaurantId)
            .gte('reservation_date', startStr)
            .lte('reservation_date', endStr)
            .order('reservation_date', { ascending: true })
            .order('reservation_time', { ascending: true });

        if (error) {
            console.error('Error fetching reservations for period:', error);
            throw new Error('Failed to fetch reservations');
        }

        return data.map(this.mapToReservation);
    }

    /**
     * Get a single reservation by ID
     */
    async getReservationById(id: string): Promise<Reservation | null> {
        const { data, error } = await supabase
            .from('reservations')
            .select('*, table:tables(*)')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching reservation:', error);
            return null;
        }

        return this.mapToReservation(data);
    }

    /**
     * Create a new reservation
     */
    async createReservation(
        restaurantId: string,
        reservation: Omit<Reservation, 'id' | 'restaurantId' | 'createdAt' | 'updatedAt'>
    ): Promise<Reservation> {
        console.log('Creating reservation with date:', reservation.date);
        console.log('Formatted date for DB:', formatDateForDatabase(reservation.date));

        const { data, error } = await supabase

            .from('reservations')
            .insert({
                restaurant_id: restaurantId,
                reservation_date: formatDateForDatabase(reservation.date),

                reservation_time: reservation.time,
                service_type: reservation.serviceType,
                num_guests: reservation.numGuests,
                customer_name: reservation.customerName,
                customer_phone: reservation.customerPhone,
                customer_email: reservation.customerEmail || null,
                table_id: reservation.tableId || null,
                status: reservation.status,
                notes: reservation.notes || null,
                special_requests: reservation.specialRequests || null,
            })
            .select('*, table:tables(*)')
            .single();

        if (error) {
            console.error('Error creating reservation:', error);
            throw new Error(error.message || 'Failed to create reservation');
        }

        return this.mapToReservation(data);
    }

    /**
     * Update a reservation
     */
    async updateReservation(
        id: string,
        updates: Partial<Omit<Reservation, 'id' | 'restaurantId' | 'createdAt' | 'updatedAt'>>
    ): Promise<void> {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const updateData: any = {};

        if (updates.date) updateData.reservation_date = formatDateForDatabase(updates.date);

        if (updates.time) updateData.reservation_time = updates.time;
        if (updates.serviceType) updateData.service_type = updates.serviceType;
        if (updates.numGuests !== undefined) updateData.num_guests = updates.numGuests;
        if (updates.customerName) updateData.customer_name = updates.customerName;
        if (updates.customerPhone) updateData.customer_phone = updates.customerPhone;
        if (updates.customerEmail !== undefined) updateData.customer_email = updates.customerEmail || null;
        if (updates.tableId !== undefined) updateData.table_id = updates.tableId || null;
        if (updates.status) updateData.status = updates.status;
        if (updates.notes !== undefined) updateData.notes = updates.notes || null;
        if (updates.specialRequests !== undefined) updateData.special_requests = updates.specialRequests || null;

        const { error } = await supabase
            .from('reservations')
            .update(updateData)
            .eq('id', id);

        if (error) {
            console.error('Error updating reservation:', error);
            throw new Error(error.message || 'Failed to update reservation');
        }
    }

    /**
     * Delete a reservation
     */
    async deleteReservation(id: string): Promise<void> {
        const { error } = await supabase
            .from('reservations')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting reservation:', error);
            throw new Error(error.message || 'Failed to delete reservation');
        }
    }

    /**
     * Search reservations by customer name, phone, or email
     */
    async searchReservations(restaurantId: string, query: string): Promise<Reservation[]> {
        const searchTerm = `%${query}%`;

        const { data, error } = await supabase
            .from('reservations')
            .select('*, table:tables(*)')
            .eq('restaurant_id', restaurantId)
            .or(`customer_name.ilike.${searchTerm},customer_phone.ilike.${searchTerm},customer_email.ilike.${searchTerm}`)
            .order('reservation_date', { ascending: false })
            .order('reservation_time', { ascending: true })
            .limit(50);

        if (error) {
            console.error('Error searching reservations:', error);
            throw new Error('Failed to search reservations');
        }

        return data.map(this.mapToReservation);
    }

    /**
     * Map database row to Reservation type
     */
    private mapToReservation(data: any): Reservation {
        // Parse date string (YYYY-MM-DD) as local date at midnight to avoid UTC offsets
        const [year, month, day] = data.reservation_date.split('-').map(Number);
        const localDate = new Date(year, month - 1, day);

        return {
            id: data.id,
            restaurantId: data.restaurant_id,
            date: localDate,
            time: data.reservation_time,

            serviceType: data.service_type,
            numGuests: data.num_guests,
            customerName: data.customer_name,
            customerPhone: data.customer_phone,
            customerEmail: data.customer_email || undefined,
            tableId: data.table_id || undefined,
            table: data.table ? {
                id: data.table.id,
                restaurantId: data.table.restaurant_id,
                tableNumber: data.table.table_number,
                capacity: data.table.capacity,
                position: data.table.position,
                isActive: data.table.is_active,
            } : undefined,
            status: data.status,
            notes: data.notes || undefined,
            specialRequests: data.special_requests || undefined,
            createdAt: new Date(data.created_at),
            updatedAt: new Date(data.updated_at),
        };
    }
}

export const reservationsService = new ReservationsService();
