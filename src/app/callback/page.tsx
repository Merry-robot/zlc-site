"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const url = new URL(window.location.href);
    const code = url.searchParams.get("code");
    if (!code) {
      router.replace("/");
      return;
    }
    // Call backend to exchange code for token
    fetch(`/api/callback?code=${encodeURIComponent(code)}`)
      .then(async (res) => {
        if (!res.ok) throw new Error(await res.text());
        const tokenData = await res.json();
        // Fetch user info from VATSIM using access token
        return fetch("https://auth-dev.vatsim.net/oauth/userinfo", {
          headers: { Authorization: `Bearer ${tokenData.access_token}` },
        })
          .then(async (userRes) => {
            if (!userRes.ok) throw new Error(await userRes.text());
            const userInfo = await userRes.json();
            // Example: userInfo.roles might be an array of roles
            // Save only if staff or team
            const staffRoles = ["ATM","DATM","TA","FE","WM","EC","EVENTS","TRAINING","FACILITIES","WEB","MEMBERSHIP"];
            const userRoles: string[] = userInfo.roles || [];
            const isStaff = userRoles.some((r: string) => staffRoles.some((team) => r.toUpperCase().includes(team)));
            if (isStaff) {
              localStorage.setItem(
                "zlc_user",
                JSON.stringify({
                  cid: userInfo.sub || userInfo.cid || "",
                  name: userInfo.name || userInfo.full_name || "",
                  roles: userRoles,
                })
              );
            } else {
              localStorage.removeItem("zlc_user");
            }
            return;
          });
      })
      .then(() => {
        router.replace("/");
      })
      .catch(() => {
        localStorage.removeItem("zlc_user");
        router.replace("/");
      });
  }, [router]);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-neutral-950 text-white">
      <h1 className="text-2xl font-bold mb-4">Logging you in...</h1>
      <p className="text-stone-300">Please wait while we complete your login.</p>
    </main>
  );
}
