import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import Account from "../components/Account";

const Home = () => {
  const session = useSession();
  const supabase = useSupabaseClient();

  return (
    <div className="w-full" style={{ padding: "50px 0 100px 0" }}>
      {!session ? (
        <div className="flex justify-center">
          <Auth
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            theme="dark"
          />
        </div>
      ) : (
        <div className="w-full">
          <Account session={session} />
        </div>
      )}
    </div>
  );
};

export default Home;
