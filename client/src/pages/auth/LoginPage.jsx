import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { ArrowLeft, ArrowRight, BookOpen, Eye, EyeOff, LockKeyhole, ShieldCheck, Sparkles } from "lucide-react";
import { useAuth } from "../../app/AuthProvider.jsx";
import Seo from "../../components/Seo.jsx";
import Logo from "../../components/Logo.jsx";
import { Alert, Button, Field, Input } from "../../components/ui.jsx";
import { errorMessage } from "../../lib/api.js";

function AuthAside() {
  return (
    <aside className="relative hidden overflow-hidden bg-plum-900 p-10 text-white lg:flex lg:flex-col lg:justify-between">
      <div className="pointer-events-none absolute -right-24 top-16 size-80 rounded-full bg-accent/25 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -bottom-24 -left-16 size-80 rounded-full bg-gold/15 blur-3xl" aria-hidden="true" />
      <Logo tone="dark" />
      <div className="relative">
        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-gold">
          <Sparkles className="size-4" aria-hidden="true" /> Araling Panlipunan 8
        </p>
        <h2 className="mt-4 max-w-md text-4xl font-bold leading-tight tracking-tight">
          Bumabalik ka? Magpatuloy tayo sa pag-aaral.
        </h2>
        <p className="mt-4 max-w-md text-base leading-relaxed text-plum-200">
          Ang iyong mga aralin, iskor, at badge ay nakatala sa iyong account — hindi sa browser.
        </p>
        <ul className="mt-8 space-y-3">
          {[
            { icon: BookOpen, text: "Tatlong antas ng teksto sa bawat aralin" },
            { icon: ShieldCheck, text: "Ligtas na session at protektadong account" },
            { icon: LockKeyhole, text: "Hiwalay ang access ng mag-aaral at guro" },
          ].map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-center gap-3 text-sm font-medium text-plum-100">
              <span className="grid size-9 place-items-center rounded-lg bg-white/10 text-gold">
                <Icon className="size-4.5" aria-hidden="true" />
              </span>
              {text}
            </li>
          ))}
        </ul>
      </div>
      <p className="relative text-xs text-plum-300">
        HASA · Pantulong sa Araling Panlipunan para sa Baitang 8
      </p>
    </aside>
  );
}

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setPending(true);
    try {
      const user = await login(form);
      navigate(user.role === "teacher" ? "/teacher/dashboard" : "/student/dashboard", { replace: true });
    } catch (requestError) {
      setError(errorMessage(requestError));
    } finally {
      setPending(false);
    }
  };

  return (
    <>
      <Seo
        title="Mag-log in"
        description="Mag-log in sa HASA upang ipagpatuloy ang mga aralin, aktibidad, at pagsusulit sa Araling Panlipunan 8."
        noindex
        path="/login"
      />
      <div className="grid min-h-screen bg-cream-50 lg:grid-cols-[1fr_1.05fr]">
        <AuthAside />
        <main className="flex flex-col px-4 py-6 sm:px-8 lg:px-14">
          <div className="flex items-center justify-between">
            <div className="lg:hidden"><Logo /></div>
            <Link to="/" className="ml-auto inline-flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-semibold text-muted hover:text-ink">
              <ArrowLeft className="size-4" aria-hidden="true" /> Bumalik sa simula
            </Link>
          </div>

          <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-10">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-accent-strong">Maligayang pagbabalik</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-ink sm:text-4xl">Mag-log in sa HASA</h1>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Gamitin ang username at password na ginawa mo. Awtomatikong makikilala ang
              account na mag-aaral o guro.
            </p>

            {error ? <Alert className="mt-5" tone="danger" title="Hindi nakapag-log in">{error}</Alert> : null}

            <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
              <Field label="Username" htmlFor="username">
                <Input
                  id="username"
                  name="username"
                  autoComplete="username"
                  autoCapitalize="none"
                  spellCheck={false}
                  placeholder="hal. ana.reyes"
                  value={form.username}
                  onChange={(event) => setForm((current) => ({ ...current, username: event.target.value }))}
                  required
                />
              </Field>
              <Field label="Password" htmlFor="password">
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Ilagay ang password"
                    className="pr-12"
                    value={form.password}
                    onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className="absolute inset-y-0 right-0 grid w-11 place-items-center text-muted hover:text-ink"
                    aria-label={showPassword ? "Itago ang password" : "Ipakita ang password"}
                  >
                    {showPassword ? <EyeOff className="size-4.5" aria-hidden="true" /> : <Eye className="size-4.5" aria-hidden="true" />}
                  </button>
                </div>
              </Field>
              <Button type="submit" className="w-full" size="lg" disabled={pending}>
                {pending ? "Naglo-log in…" : "Mag-log in"}
                {!pending ? <ArrowRight className="size-4.5" aria-hidden="true" /> : null}
              </Button>
            </form>

            <p className="mt-5 text-sm text-muted">
              Wala pang account?{" "}
              <Link to="/register" className="font-semibold text-accent-strong hover:text-accent-deep">
                Gumawa ng account
              </Link>
            </p>
            <p className="mt-8 rounded-xl border border-plum-100 bg-white p-3.5 text-xs leading-relaxed text-muted">
              <strong className="font-semibold text-ink">Para sa mag-aaral:</strong> humingi ng kodigo ng klase sa iyong guro bago magrehistro.
            </p>
          </div>
        </main>
      </div>
    </>
  );
}
