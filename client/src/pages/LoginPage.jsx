import { useState } from "react";
import { Link } from "react-router";
import { Eye, EyeOff } from "lucide-react";
import AuthShell from "../components/layout/AuthShell.jsx";
import Alert from "../components/ui/Alert.jsx";
import { cx } from "../lib/cx.js";
import { demoStudent } from "../features/demo/demoData.js";

import logoHasa from "../assets/figma/logo-hasa.png";
import featXp from "../assets/figma/feat-xp.png";
import featAi from "../assets/figma/feat-ai.png";
import featTrack from "../assets/figma/feat-track.png";
import inputUser from "../assets/figma/input-user.png";
import inputLock from "../assets/figma/input-lock.png";
import roleStudent from "../assets/figma/role-student.png";
import roleTeacher from "../assets/figma/role-teacher.png";

const REMEMBER_KEY = "hasa:remembered-username";

const FEATURES = [
  { icon: featXp, text: "Earn XP, Badges, and level up as you learn" },
  { icon: featAi, text: "AI Simplifier turns hard topics into easy one" },
  { icon: featTrack, text: "Track your progress lesson by lesson" },
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
        ? "Ilagay ang iyong teacher ID o username."
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
        <section className="relative flex min-h-[560px] flex-col overflow-hidden bg-plum-800 px-8 py-14 lg:w-[54.6%] lg:px-20 lg:py-24 2xl:px-24">
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

          <div className="relative mt-auto">
            <h1 className="font-sans text-[40px] font-bold leading-[1.18] tracking-tight text-white 2xl:text-[55px]">
              HASA: TARA, MATUTO AT MAHASA!
            </h1>
            <p className="mt-4 max-w-[590px] text-[17px] leading-snug text-white 2xl:text-[20px]">
              Matuto ng Araling Panlipunan sa mas madali at masayang paraan
              gamit ang AI Simplifier, interactive na gawain, at educational
              games
            </p>

            <ul className="mt-11 max-w-[540px] space-y-8">
              {FEATURES.map(({ icon, text }) => (
                <li key={text} className="flex items-center gap-5">
                  <span
                    className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[20px] bg-black/60"
                    aria-hidden="true"
                  >
                    <img src={icon} alt="" className="h-12 w-[52px] object-contain" />
                  </span>
                  <p className="text-[18px] font-semibold text-white 2xl:text-[22px]">{text}</p>
                </li>
              ))}
            </ul>
          </div>

          <p className="relative mt-16 text-[14px] font-medium text-white/60 lg:mt-auto">
            © 2026 HASA — Grade 8 Araling Panlipunan
          </p>
        </section>

        {/* Kanan: form ng pag-log in */}
        <section className="relative flex flex-1 flex-col items-center overflow-hidden px-6 py-14 lg:px-16 lg:py-16">
          <img
            src={logoHasa}
            alt="HASA logo"
            className="w-[300px] 2xl:w-[360px]"
          />

          <div className="w-full max-w-[560px]">
            <h2 className="font-display mt-4 text-[32px] font-extrabold text-ink 2xl:text-[38px]">
              Welcome to Hasa!
            </h2>
            <p className="mt-1 text-[17px] text-ink 2xl:text-[20px]">
              Magbasa, matuto, at mahasa sa bawat aralin.
            </p>

            {/* Role tabs */}
            <div
              role="tablist"
              aria-label="Uri ng account"
              className="mt-10 grid grid-cols-2 gap-6"
            >
              {[
                { id: "student", label: "Student", icon: roleStudent },
                { id: "teacher", label: "Teacher", icon: roleTeacher },
              ].map(({ id, label, icon }) => (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  id={`login-tab-${id}`}
                  aria-selected={role === id}
                  aria-controls="login-panel"
                  tabIndex={role === id ? 0 : -1}
                  onClick={() => selectRole(id)}
                  className={cx(
                    "flex items-center justify-center gap-3 rounded-[11px] border-2 text-[18px] font-medium transition-colors",
                    role === id
                      ? "border-plum-800 bg-canvas text-accent-deep shadow-[0_4px_4px_rgba(0,0,0,0.25)]"
                      : "border-transparent text-ink/70 hover:text-ink",
                  )}
                >
                  <img src={icon} alt="" className="h-8 w-8" aria-hidden="true" />
                  {label}
                </button>
              ))}
            </div>

            <form
              id="login-panel"
              role="tabpanel"
              aria-labelledby={`login-tab-${role}`}
              className="mt-10 space-y-5"
              onSubmit={handleSubmit}
              noValidate
            >
              <div>
                <label
                  htmlFor="login-username"
                  className="block text-[18px] font-medium text-ink"
                >
                  Username / Student I'D
                </label>
                <div className="relative mt-2">
                  <img
                    src={inputUser}
                    alt=""
                    className="pointer-events-none absolute left-4 top-1/2 h-7 w-7 -translate-y-1/2"
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
                      errors.username
                        ? "login-username-error"
                        : "login-username-hint"
                    }
                    placeholder="2026-08421  (e.g. Juan Dela Cruz)"
                    className="h-[50px] w-full rounded-[15px] border border-[#9d9d9d] bg-canvas pl-14 pr-4 text-[15px] text-ink placeholder:text-[#717171] focus:border-plum-800 focus:outline-none"
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
                  className="block text-[18px] font-medium text-ink"
                >
                  Password
                </label>
                <div className="relative mt-2">
                  <img
                    src={inputLock}
                    alt=""
                    className="pointer-events-none absolute left-4 top-1/2 h-7 w-7 -translate-y-1/2"
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
                      errors.password
                        ? "login-password-error"
                        : "login-password-hint"
                    }
                    placeholder="••••••••"
                    className="h-[50px] w-full rounded-[15px] border border-[#9d9d9d] bg-canvas pl-14 pr-16 text-[15px] tracking-widest text-ink placeholder:text-ink/70 focus:border-plum-800 focus:outline-none"
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
                    Show
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
                  Remember me
                </label>

                <button
                  type="button"
                  onClick={() => setShowResetHelp((current) => !current)}
                  aria-expanded={showResetHelp}
                  aria-controls="login-forgot-help"
                  className="text-[15px] font-medium text-accent hover:underline"
                >
                  Forgot password?
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
                      ? "Hilingin sa school administrator na i-reset ang iyong teacher account kapag aktibo na ang backend."
                      : "Hilingin sa iyong guro na i-reset ang password. Hindi pa nakakonekta ang HASA sa email o database."}
                  </p>
                </div>
              ) : null}

              <button
                type="submit"
                className="mt-6 flex h-[46px] w-full items-center justify-center rounded-[20px] bg-plum-800 text-[16px] font-bold text-canvas shadow-[0_4px_4px_rgba(0,0,0,0.25)] transition-colors hover:bg-plum-900"
              >
                Log in as {isTeacher ? "Teacher" : "Student"}
              </button>

              <div className="flex items-center gap-4 pt-1" aria-hidden="true">
                <span className="h-px flex-1 bg-[#bdbdbd]" />
                <span className="text-[16px] text-ink">or</span>
                <span className="h-px flex-1 bg-[#bdbdbd]" />
              </div>

              <Link
                to="/register"
                className="mx-auto flex h-[38px] w-[220px] items-center justify-center rounded-[15px] bg-lav-400 text-[15px] font-medium text-canvas transition-colors hover:bg-[#7e7eb0]"
              >
                Create an Account
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
