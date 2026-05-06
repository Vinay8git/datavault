import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ShieldCheck, Wallet, ArrowRight, Loader2, CheckCircle2, AlertTriangle } from "lucide-react";
import { loginWithMetaMask } from "../../services/authService";

const AuthGatePage = ({ setUser }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/dashboard";

  const [stage, setStage] = useState("idle"); 
  // idle | connecting | signing | verifying | success | error
  const [error, setError] = useState("");

  const stageLabel = useMemo(() => {
    switch (stage) {
      case "connecting":
        return "Connecting wallet...";
      case "signing":
        return "Awaiting signature...";
      case "verifying":
        return "Verifying secure session...";
      case "success":
        return "Authentication successful";
      case "error":
        return "Authentication failed";
      default:
        return "Secure access required";
    }
  }, [stage]);

  useEffect(() => {
    if (stage !== "success") return;
    const t = setTimeout(() => navigate(from, { replace: true }), 500);
    return () => clearTimeout(t);
  }, [stage, navigate, from]);

  const handleConnect = async () => {
    setError("");
    setStage("connecting");

    const res = await loginWithMetaMask(setUser, {
      onStageChange: (s) => setStage(s),
    });

    if (!res.success) {
      setStage("error");
      setError(res.message || "Wallet authentication failed.");
      return;
    }

    setStage("success");
  };

  return (
    <main className="min-h-screen w-full px-4 py-8 md:px-8">
      <section className="mx-auto max-w-3xl rounded-3xl border border-slate-300/20 bg-slate-900/40 p-6 shadow-2xl shadow-slate-950/40 md:p-10">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-300/30 bg-blue-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-blue-100">
          <ShieldCheck className="h-4 w-4" />
          Security Gateway
        </div>

        <h1 className="text-2xl font-bold text-slate-100 md:text-4xl">Authenticate with MetaMask</h1>
        <p className="mt-3 text-sm leading-relaxed text-blue-100/80 md:text-base">{stageLabel}</p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            onClick={handleConnect}
            disabled={["connecting", "signing", "verifying", "success"].includes(stage)}
            className="inline-flex items-center gap-2 rounded-full border border-blue-300/40 bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-70"
          >
            {["connecting", "signing", "verifying"].includes(stage) ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : stage === "success" ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <Wallet className="h-4 w-4" />
            )}
            {stage === "success" ? "Authenticated" : "Connect Wallet"}
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
          <p className="mt-4 inline-flex items-center gap-2 rounded-xl border border-rose-300/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
            <AlertTriangle className="h-4 w-4" />
            {error}
          </p>
        ) : null}
      </section>
    </main>
  );
};

export default AuthGatePage;