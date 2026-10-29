import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Eye, EyeOff } from "lucide-react";
import AuthShell from "../../components/layout/AuthShell.jsx";
import Alert from "../../components/ui/Alert.jsx";
import { demoStudent } from "../../data/demoData.js";

import logoHasa from "../../assets/images/brand/logo-hasa.png";
import featXp from "../../assets/images/auth/feat-xp.png";
import featAi from "../../assets/images/auth/feat-ai.png";
import featTrack from "../../assets/images/auth/feat-track.png";
import inputUser from "../../assets/images/auth/input-user.png";
import inputLock from "../../assets/images/auth/input-lock.png";
import RoleTabs from "../../components/auth/RoleTabs.jsx";
import { useSession } from "../../app/SessionProvider.jsx";

const REMEMBER_KEY = "hasa:remembered-username";

const FEATURES = [
  { icon: featXp, text: "Kumita ng XP at sagisag, at umangat sa bawat pag-aaral" },
  {
    icon: featAi,
    text: "Ginagawang madali ng AI Tagapagpasimple ang mahihirap na paksa",
  },
  { icon: featTrack, text: "Subaybayan ang iyong pag-unlad sa bawat aralin" },
];

function readRememberedUsername() {
  try {
    return window.localStorage.getItem(REMEMBER_KEY) ?? "";
  } catch {
    return "";
  }
}

export default function LoginPage() {
  const remembered = readRememberedUsername();
  const { isSignedIn, signInAsDemo } = useSession();
  const navigate = useNavigate();
  const [role, setRole] = useState("student");
  const [username, setUsername] = useState(remembered);
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(Boolean(remembered));
  const [showPassword, setShowPassword] = useState(false);
  const [showResetHelp, setShowResetHelp] = useState(false);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);

  const isTeacher = role === "teacher";

  function selectRole(nextRole) {
    setRole(nextRole);
    setErrors({});
    setStatus(null);
  }

  function validate() {
    const next = {};

    if (!username.trim()) {
      next.username = isTeacher
        ? "Ilagay ang ID o username ng guro."
        : "Ilagay ang iyong username o student ID.";
    } else if (username.trim().length < 3) {
      next.username = "Gumamit ng hindi bababa sa 3 letra.";
    }

    if (!password) {
      next.password = "Ilagay ang iyong password.";
    } else if (password.length < 6) {
      next.password = "Dapat may 6 na letra o higit pa ang password.";
    }

    return next;
  }

  function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    setStatus(null);

    if (Object.keys(nextErrors).length > 0) return;

    try {
      if (remember) {
        window.localStorage.setItem(REMEMBER_KEY, username.trim());
      } else {
        window.localStorage.removeItem(REMEMBER_KEY);
      }
    } catch {
      // Hindi kritikal ang localStorage; ligtas na ipagpatuloy.
    }

    setStatus({ role });
  }

  return (
    <AuthShell>
      <div className="flex min-h-screen flex-col bg-canvas lg:flex-row">
        {/* Kaliwa: plum panel na may hugis-bilog na dekorasyon */}
        <section className="relative flex min-h-[560px] flex-col overflow-hidden bg-plum-800 px-7 py-12 lg:w-[52%] lg:px-14 lg:py-16 2xl:px-20">
          <span
            className="pointer-events-none absolute -left-24 -top-28 h-[340px] w-[360px] rounded-full bg-lav-400"
            aria-hidden="true"
          />
          <span
            className="pointer-events-none absolute -right-24 -top-40 h-[380px] w-[380px] rounded-full bg-canvas"
            aria-hidden="true"
          />
          <span
            className="pointer-events-none absolute -bottom-40 -right-16 h-[400px] w-[420px] rounded-full bg-lav-400"
            aria-hidden="true"
          />

          <div className="relative my-auto">
            <h1 className="font-sans text-[28px] font-bold leading-[1.2] tracking-tight text-white lg:text-[34px] 2xl:text-[40px]">
              HASA: TARA, MATUTO AT MAHASA!
            </h1>
            <p className="mt-3 max-w-[520px] text-[14px] leading-snug text-white 2xl:text-[16px]">
              Matuto ng Araling Panlipunan sa mas madali at masayang paraan
              gamit ang AI Tagapagpasimple, mga interaktibong gawain, at mga
              larong pang-edukasyon
            </p>

            <ul className="mt-8 max-w-[470px] space-y-4">
              {FEATURES.map(({ icon, text }) => (
                <li key={text} className="flex items-center gap-5">
                  <span
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] bg-black/60"
                    aria-hidden="true"
                  >
                    <img src={icon} alt="" className="h-8 w-9 object-contain" />
                  </span>
                  <p className="text-[14px] font-semibold text-white 2xl:text-[16px]">{text}</p>
                </li>
              ))}
            </ul>
          </div>

          <p className="relative mt-10 text-[12px] font-medium text-white/60 lg:mt-auto">
            © 2026 HASA — Grade 8 Araling Panlipunan
          </p>
        </section>

        {/* Kanan: form ng pag-log in */}
        <section className="relative flex flex-1 flex-col items-center overflow-hidden px-5 py-8 lg:px-10 lg:py-10">
          <img
            src={logoHasa}
            alt="HASA logo"
            className="w-[200px] 2xl:w-[240px]"
          />

          <div className="w-full max-w-[480px]">
            <h2 className="font-display mt-3 text-[24px] font-extrabold text-ink 2xl:text-[28px]">
              Maligayang pagdating sa HASA!
            </h2>
            <p className="mt-1 text-[13.5px] text-ink 2xl:text-[15px]">
              Magbasa, matuto, at mahasa sa bawat aralin.
            </p>

            {/* Kapag nag-logout, dito maaaring bumalik sa demo na dashboard.
                Walang totoong session sa prototype. */}
            {!isSignedIn ? (
              <div className="mt-5 rounded-[15px] border border-line bg-white/70 px-4 py-3">
                <p className="text-[13px] font-semibold text-ink">
                  Naka-log out ka sa prototype.
                </p>
                <p className="mt-1 text-[12px] leading-relaxed text-muted">
                  Walang totoong pagpapatunay ng account sa yugtong ito. Maaari
                  mong buksan muli ang demo na dashboard ng mag-aaral.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    signInAsDemo();
                    navigate("/");
                  }}
                  className="mt-2 rounded-lg bg-plum-800 px-3 py-1.5 text-[12.5px] font-semibold text-canvas transition-colors hover:bg-plum-900"
                >
                  Buksan ang demo na dashboard
                </button>
              </div>
            ) : null}

            {/* Role tabs */}
            <RoleTabs value={role} onChange={selectRole} idPrefix="login" />

            <form
              id="login-panel"
              role="tabpanel"
              aria-labelledby={`login-tab-${role}`}
              className="mt-5 space-y-4"
              onSubmit={handleSubmit}
              noValidate
            >
              <div>
                <label
                  htmlFor="login-username"
                  className="block text-[14px] font-medium text-ink"
                >
                  Username o Student ID
                </label>
                <div className="relative mt-2">
                  <img
                    src={inputUser}
                    alt=""
                    className="pointer-events-none absolute left-3.5 top-1/2 h-6 w-6 -translate-y-1/2"
                    aria-hidden="true"
                  />
                  <input
                    id="login-username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    aria-invalid={errors.username ? "true" : undefined}
                    aria-describedby={
                      errors.username ? "login-username-error" : undefined
                    }
                    placeholder="2026-08421  (hal. Juan Dela Cruz)"
                    className="h-[44px] w-full rounded-[12px] border border-[#9d9d9d] bg-canvas pl-12 pr-3 text-[14px] text-ink placeholder:text-[#717171] focus:border-plum-800 focus:outline-none"
                  />
                </div>
              </div>
              {errors.username ? (
                <p
                  id="login-username-error"
                  role="alert"
                  className="text-[12px] font-semibold text-danger-deep"
                >
                  {errors.username}
                </p>
              ) : null}

              <div>
                <label
                  htmlFor="login-password"
                  className="block text-[14px] font-medium text-ink"
                >
                  Password
                </label>
                <div className="relative mt-2">
                  <img
                    src={inputLock}
                    alt=""
                    className="pointer-events-none absolute left-3.5 top-1/2 h-6 w-6 -translate-y-1/2"
                    aria-hidden="true"
                  />
                  <input
                    id="login-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    aria-invalid={errors.password ? "true" : undefined}
                    aria-describedby={
                      errors.password ? "login-password-error" : undefined
                    }
                    placeholder="••••••••"
                    className="h-[44px] w-full rounded-[12px] border border-[#9d9d9d] bg-canvas pl-12 pr-16 text-[14px] tracking-widest text-ink placeholder:text-ink/70 focus:border-plum-800 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    aria-label={
                      showPassword ? "Itago ang password" : "Ipakita ang password"
                    }
                    aria-pressed={showPassword}
                    className="absolute right-4 top-1/2 flex -translate-y-1/2 items-center gap-1 text-[15px] font-medium text-accent hover:text-accent-strong"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <Eye className="h-4 w-4" aria-hidden="true" />
                    )}
                    {showPassword ? "Itago" : "Ipakita"}
                  </button>
                </div>
              </div>
              {errors.password ? (
                <p
                  id="login-password-error"
                  role="alert"
                  className="text-[12px] font-semibold text-danger-deep"
                >
                  {errors.password}
                </p>
              ) : null}

              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <label className="flex min-h-9 cursor-pointer items-center gap-2.5 text-[15px] font-light text-accent">
                  <input
                    type="checkbox"
                    name="remember"
                    checked={remember}
                    onChange={(event) => setRemember(event.target.checked)}
                    className="h-4 w-4 shrink-0 rounded-[5px] border-2 border-plum-800 appearance-none bg-canvas checked:bg-plum-800"
                  />
                  Tandaan ako
                </label>

                <button
                  type="button"
                  onClick={() => setShowResetHelp((current) => !current)}
                  aria-expanded={showResetHelp}
                  aria-controls="login-forgot-help"
                  className="text-[15px] font-medium text-accent hover:underline"
                >
                  Nakalimutan ang password?
                </button>
              </div>

              {showResetHelp ? (
                <div
                  id="login-forgot-help"
                  className="rounded-[15px] border border-line bg-white/60 px-4 py-3 text-[13px] leading-relaxed text-muted"
                >
                  <p className="font-semibold text-ink">
                    Wala pang email reset sa prototype.
                  </p>
                  <p className="mt-1">
                    {isTeacher
                      ? "Hilingin sa administrador ng paaralan na i-reset ang iyong teacher account kapag aktibo na ang backend."
                      : "Hilingin sa iyong guro na i-reset ang password. Hindi pa nakakonekta ang HASA sa email o database."}
                  </p>
                </div>
              ) : null}

              <button
                type="submit"
                className="mt-5 flex h-11 w-full items-center justify-center rounded-[14px] bg-plum-800 text-[14px] font-bold text-canvas shadow-[0_4px_4px_rgba(0,0,0,0.25)] transition-colors hover:bg-plum-900"
              >
                Mag-log in bilang {isTeacher ? "Guro" : "Mag-aaral"}
              </button>

              <div className="flex items-center gap-4 pt-0.5" aria-hidden="true">
                <span className="h-px flex-1 bg-[#bdbdbd]" />
                <span className="text-[16px] text-ink">o</span>
                <span className="h-px flex-1 bg-[#bdbdbd]" />
              </div>

              <Link
                to="/register"
                className="mx-auto flex h-[38px] w-[220px] items-center justify-center rounded-[15px] bg-lav-400 text-[15px] font-medium text-canvas transition-colors hover:bg-[#7e7eb0]"
              >
                Gumawa ng Account
              </Link>

              <p className="flex items-start gap-1.5 pt-4 text-[11px] leading-relaxed text-muted">
                <span aria-hidden="true">ⓘ</span>
                Prototype pa lamang: wala pang backend, database, o session. Halimbawa
                lamang ang account ni {demoStudent.displayName}.
              </p>

              <div aria-live="polite">
                {status ? (
                  <Alert
                    variant="warning"
                    title="Hindi pa aktibo ang pag-log in"
                    className="mt-1"
                  >
                    Naka-validate ang form, pero walang totoong pag-log in na
                    nangyari at walang datos na naipadala sa server.
                    {status.role === "teacher" ? (
                      <>
                        {" "}
                        Para sa prototype, buksan ang{" "}
                        <Link to="/guro" className="font-semibold underline">
                          Tanawan ng Guro
                        </Link>
                        .
                      </>
                    ) : null}
                  </Alert>
                ) : null}
              </div>
            </form>
          </div>
        </section>
      </div>
    </AuthShell>
  );
}
