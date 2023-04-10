import { useState, useEffect, useCallback } from "react";
import {
  useUser,
  useSupabaseClient,
  Session,
} from "@supabase/auth-helpers-react";
import { Database } from "../types/database.types";
type Profiles = Database["public"]["Tables"]["profiles"]["Row"];

export default function Account({ session }: { session: Session }) {
  const supabase = useSupabaseClient<Database>();
  const user = useUser();
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState<Profiles["username"]>(null);
  const [website, setWebsite] = useState<Profiles["website"]>(null);
  const [avatar_url, setAvatarUrl] = useState<Profiles["avatar_url"]>(null);

  useEffect(() => {
    getProfile();
  }, [session]); // eslint-disable-line react-hooks/exhaustive-deps

  const getProfile = async () => {
    try {
      setLoading(true);
      if (!user) throw new Error("No user");

      let { data, error, status } = await supabase
        .from("profiles")
        .select(`username, website, avatar_url`)
        .eq("id", user.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUsername(data.username);
        setWebsite(data.website);
        setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      alert("Error loading user data!");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  async function updateProfile({
    username,
    website,
    avatar_url,
  }: {
    username: Profiles["username"];
    website: Profiles["website"];
    avatar_url: Profiles["avatar_url"];
  }) {
    try {
      setLoading(true);
      if (!user) throw new Error("No user");

      const updates = {
        id: user.id,
        username,
        website,
        avatar_url,
        updated_at: new Date().toISOString(),
      };

      let { error } = await supabase.from("profiles").upsert(updates);
      if (error) throw error;
      alert("Profile updated!");
    } catch (error) {
      alert("Error updating the data!");
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex justify-center">
      <form className=" flex flex-col items-center justify-center max-w-4xl px-4">
        <div className="w-full px-3 mb-3">
          <label
            htmlFor="email"
            className="block uppercase tracking-wide text-gray-300 text-xs font-bold mb-2"
          >
            Email
          </label>
          <input
            id="email"
            type="text"
            mb-3
            value={session.user.email}
            disabled
            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
          />
        </div>
        <div className="w-full px-3 mb-3">
          <label
            htmlFor="username"
            className="block uppercase tracking-wide text-gray-300 text-xs font-bold mb-2"
          >
            Username
          </label>
          <input
            id="username"
            type="text"
            value={username || ""}
            onChange={(e) => setUsername(e.target.value)}
            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
          />
        </div>

        <div className="w-full px-3 mb-8">
          <label
            htmlFor="website"
            className="block uppercase tracking-wide text-gray-300 text-xs font-bold mb-2"
          >
            Website
          </label>
          <input
            id="website"
            type="website"
            value={website || ""}
            onChange={(e) => setWebsite(e.target.value)}
            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4leading-tight focus:outline-none focus:bg-white"
          />
        </div>

        <div className="w-full px-3">
          <button
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mb-6 rounded"
            onClick={() => updateProfile({ username, website, avatar_url })}
            disabled={loading}
          >
            {loading ? "Loading ..." : "Update"}
          </button>

          <button
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => supabase.auth.signOut()}
          >
            Sign Out
          </button>
        </div>
      </form>
    </div>
  );
}
