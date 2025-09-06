import { useEffect, useState } from "react";
import { supabase } from "@/lib/services/supabaseClient";

export interface User {
  id: string;
  email: string | null;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  // Obtener la sesión al cargar
  supabase.auth.getSession().then(({ data: { session } }) => {
    const currentUser = session?.user
      ? { id: session.user.id, email: session.user.email ?? null }
      : null;
    setUser(currentUser);
    setLoading(false);
  });

  // Escuchar cambios de sesión (login/logout)
  const { data: subscription } = supabase.auth.onAuthStateChange(
    (_event, session) => {
      const currentUser = session?.user
        ? { id: session.user.id, email: session.user.email ?? null }
        : null;
      setUser(currentUser);
    }
  );

  return () => subscription.subscription.unsubscribe();
}, []);


  return { user, loading };
}
