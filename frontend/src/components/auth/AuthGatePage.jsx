import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ShieldCheck, Wallet, ArrowRight, Loader2 } from "lucide-react";
import { loginWithMetaMask } from "../../services/authService";

const AuthGatePage = ({ setUser }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/dashboard";

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleConnect = async () => {
    setError("");
    setIsLoading(true);

    try {
      const authResult = await loginWithMetaMask(setUser);
      if (!authResult?.success) {
        throw new Error(authResult?.message || "Authentication failed");
      }

      navigate(from, { replace: true });
    } catch (err) {
      setError(err?.message || "Wallet authentication failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full px-4 py-8 md:px-8">
      <section className="mx-auto max-w-3xl rounded-3xl border border-slate-300/20 bg-slate-900/40 p-6 shadow-2xl shadow-slate-950/40 md:p-10">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-300/30 bg-blue-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-blue-100">
          <ShieldCheck className="h-4 w-4" />
          Protected Access
        </div>

        <h1 className="text-2xl font-bold text-slate-100 md:text-4xl">
          Secure Gateway Required
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-blue-100/80 md:text-base">
          Dashboard and upload resources are restricted. Connect and verify your wallet
          to continue with authenticated access.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            onClick={handleConnect}
            disabled={isLoading}
            className="inline-flex items-center gap-2 rounded-full border border-blue-300/40 bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-70"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wallet className="h-4 w-4" />}
            {isLoading ? "Connecting..." : "Connect Wallet"}
          </button>

          <button
            onClick={() => navigate("/", { replace: true })}
            className="inline-flex items-center gap-2 rounded-full border border-slate-300/25 bg-white/5 px-5 py-2.5 text-sm font-semibold text-blue-100"
          >
            Back to Home
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {error ? (
          <p className="mt-4 rounded-xl border border-rose-300/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
            {error}
          </p>
        ) : null}
      </section>
    </main>
  );
};

export default AuthGatePage;