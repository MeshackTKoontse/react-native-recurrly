// contexts/AuthContext.tsx
import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";
import { usePostHog } from "posthog-react-native";
import { createContext, useContext, useEffect, useState } from "react";

type AuthContextType = {
  session: Session | null;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  isLoading: true,
});

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const posthog = usePostHog();
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        posthog.identify(session.user.id, {
          email: session.user.email ?? null,
          full_name: session.user.user_metadata?.full_name,
        });
      }
      setIsLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);

        if (session?.user) {
          posthog.identify(session.user.id, {
            email: session.user.email ?? null,
            full_name: session.user.user_metadata?.full_name,
          });
        }

        if (event === "SIGNED_OUT") {
          posthog.reset();
        }
      },
    );

    return () => listener.subscription.unsubscribe();
  }, [posthog]);

  return (
    <AuthContext.Provider value={{ session, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
