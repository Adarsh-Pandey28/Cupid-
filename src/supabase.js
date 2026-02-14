import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const createNoopResult = (data = null) => Promise.resolve({ data, error: null });

const createNoopClient = () => {
    const noopResult = createNoopResult(null);
    const query = {
        select() { return this; },
        insert() { return this; },
        update() { return this; },
        delete() { return this; },
        eq() { return this; },
        neq() { return this; },
        or() { return this; },
        match() { return this; },
        order() { return this; },
        limit() { return this; },
        overlaps() { return this; },
        single() { return createNoopResult(null); },
        maybeSingle() { return createNoopResult(null); },
        then(onFulfilled, onRejected) { return noopResult.then(onFulfilled, onRejected); },
    };

    return {
        auth: {
            getSession: () => createNoopResult({ session: null }),
            onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } }),
            getUser: () => createNoopResult({ user: null }),
            signUp: () => createNoopResult({ user: null }),
            signInWithPassword: () => createNoopResult({ user: null }),
            signOut: () => createNoopResult(null),
            updateUser: () => createNoopResult({ user: null }),
        },
        from: () => query,
        channel: () => ({
            on() { return this; },
            subscribe() { return { unsubscribe() {} }; },
        }),
    };
};

let supabase;
if (!supabaseUrl || !supabaseAnonKey) {
    console.error(
        '[VibeSRM] Missing Supabase environment variables. ' +
        'Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file. ' +
        'Running in no-op mode so UI can still render.'
    );
    supabase = createNoopClient();
} else {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export { supabase };
