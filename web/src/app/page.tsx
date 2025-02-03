"use client";
import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { redirect } from "next/navigation";
import Image from "next/image";

interface Repository {
  id: number;
  name: string;
  description: string;
  private: boolean;
  html_url: string;
  updated_at: string;
  language: string;
  stargazers_count: number;
}

function HomePage() {
  const { data: session, status } = useSession();
  const [expand, setExpand] = useState(false);
  const [projects, setProjects] = useState<Repository[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/login");
    }

    const fetchProjects = async () => {
      if (session?.accessToken) {
        try {
          const response = await fetch("https://api.github.com/user/repos?per_page=100", {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
            },
          });
          const data = await response.json();
          setProjects(data);
        } catch (error) {
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchProjects();
  }, [session, status]);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/login' });
  };

  const generateRandomCodespaceName = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const length = 6;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

  const handleOpenRandomCodespace = (repoName: string) => {
    const randomCodespace = generateRandomCodespaceName();
    redirect(`/editor/${repoName}/${randomCodespace}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-t-2 border-black rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen text-black bg-gray-100 p-8 flex flex-col items-center">
      <header className="w-full flex justify-between items-center px-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-4">
            {session?.user.image && (
              <div className="flex justify-center items-center">
                <Image
                  src={session.user.image}
                  onClick={() => setExpand(!expand)}
                  width={40}
                  height={40}
                  alt="Profile Picture"
                  className="rounded-full cursor-pointer border-2 border-blue-500"
                />
                <div className={`${expand ? "absolute" : "hidden"} w-28 text-[#323232] space-y-2 text-center mt-28 py-2 bg-[#fafafa] border border-[#1f1f1f] rounded-md`}>
                  <button
                    onClick={() => handleSignOut()}
                    className="hover:text-red-600 transition duration-200"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="p-6">
        {(projects.length > 0 && session) && (
          <div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-6">Your GitHub Repositories</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((repo) => (
                <div key={repo.id} className="bg-gray-50 p-4 rounded-lg shadow hover:shadow-md transition-shadow">
                  <h4 onClick={() => redirect(repo.html_url)} className="cursor-pointer font-semibold text-blue-600 text-lg mb-2">{repo.name}</h4>
                  <p className="text-gray-600 text-sm mb-4">{repo.description || "No description available"}</p>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <p>⭐ {repo.stargazers_count}</p>
                    <button
                      onClick={() => handleOpenRandomCodespace(repo.name)}
                      className="text-blue-500 hover:underline"
                    >
                      Open Codespace
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export { HomePage };
export default HomePage;