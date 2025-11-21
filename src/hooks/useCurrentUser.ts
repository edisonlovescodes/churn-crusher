import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

const DEMO_USER_ID = 'demo-user-123';

export function useCurrentUser() {
    const [userId] = useState(DEMO_USER_ID);

    useEffect(() => {
        // Ensure demo user exists in DB
        async function initUser() {
            const { error } = await supabase
                .from('users')
                .upsert({
                    id: DEMO_USER_ID,
                    name: 'Demo User',
                    email: 'demo@example.com',
                    last_active: new Date().toISOString()
                }, { onConflict: 'id' });

            if (error) console.error('Error creating demo user:', error);
        }
        initUser();
    }, []);

    return { userId };
}
