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

const FEATURES = [
  { icon: featXp, text: "Earn XP, Badges, and level up as you learn" },
  { icon: featAi, text: "AI Simplifier turns hard topics into easy one" },
  { icon: featTrack, text: "Track your progress lesson by lesson" },
];

const inputClasses =
  "h-[50px] w-full rounded-[15px] border border-[#9d9d9d] bg-canvas pl-14 pr-4 text-[15px] text-ink placeholder:text-[#717171] focus:border-plum-800 focus:outline-none";

export default function RegisterPage() {
  const [role, setRole] = useState("student");
  const [values, setValues] = useState({
    username: "",
    password: "",
    displayName: "",
    classCode: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const isTeacher = role === "teacher";

  function update(field, value) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  function selectRole(nextRole) {
    setRole(nextRole);
    setErrors({});
    setSubmitted(false);
  }

  function validate() {
    const next = {};

    if (!values.username.trim()) {
      next.username = "Gumawa ng username.";
    } else if (values.username.trim().length < 3) {
      next.username = "Gumamit ng hindi bababa sa 3 letra.";
    }

    if (!values.password) {
      next.password = "Gumawa ng password.";
    } else if (values.password.length < 6) {
      next.password = "Dapat may 6 na letra o higit pa ang password.";
    }

    if (!values.displayName.trim()) {
      next.displayName = isTeacher
        ? "Ilagay ang pangalan ng guro."
        : "Ilagay ang palayaw mo sa HASA.";
    }

    if (!isTeacher && !values.classCode.trim()) {
      next.classCode = "Ilagay ang kodigo ng klase mula sa iyong guro.";
    }

    return next;
  }

  function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    setSubmitted(false);

    if (Object.keys(nextErrors).length > 0) return;
    setSubmitted(true);
  }

  return (
    <AuthShell>
      <div className="flex min-h-screen flex-col bg-canvas lg:flex-row">
        {/* Kaliwa: plum panel na may hugis-bilog na dekorasyon */}
        <section className="relative hidden flex-col overflow-hidden bg-plum-800 px-8 py-14 lg:flex lg:w-[54.6%] lg:px-20 lg:py-24 2xl:px-24">
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
              Sumali sa HASA at matuto ng Araling Panlipunan sa mas madali at
              masayang paraan
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
                  <p className="text-[18px] font-semibold text-white 2xl:text-[22px]">
                    {text}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <p className="relative mt-16 text-[14px] font-medium text-white/60 lg:mt-auto">
            © 2026 HASA — Grade 8 Araling Panlipunan
          </p>
        </section>

        {/* Kanan: form ng pagpaparehistro */}
        <section className="relative flex flex-1 flex-col items-center overflow-hidden px-6 py-14 lg:px-16 lg:py-16">
          <img src={logoHasa} alt="HASA logo" className="w-[280px] 2xl:w-[340px]" />

          <div className="w-full max-w-[560px]">
            <h1 className="font-display mt-4 text-[30px] font-extrabold text-ink 2xl:text-[36px]">
              Create an Account
            </h1>
            <p className="mt-1 text-[17px] text-ink 2xl:text-[20px]">
              Huwag gumamit ng totoong password sa prototype.
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
                  id={`register-tab-${id}`}
                  aria-selected={role === id}
                  aria-controls="register-panel"
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
              id="register-panel"
              role="tabpanel"
              aria-labelledby={`register-tab-${role}`}
              className="mt-10 space-y-5"
              onSubmit={handleSubmit}
              noValidate
            >
              <div>
                <label
                  htmlFor="reg-username"
                  className="block text-[18px] font-medium text-ink"
                >
                  Username
                </label>
                <div className="relative mt-2">
                  <img
                    src={inputUser}
                    alt=""
                    className="pointer-events-none absolute left-4 top-1/2 h-7 w-7 -translate-y-1/2"
                    aria-hidden="true"
                  />
                  <input
                    id="reg-username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    value={values.username}
                    onChange={(event) => update("username", event.target.value)}
                    aria-invalid={errors.username ? "true" : undefined}
                    placeholder={isTeacher ? "teacher-cruz" : "estudyante1"}
                    className={inputClasses}
                  />
                </div>
                {errors.username ? (
                  <p role="alert" className="mt-1.5 text-[12px] font-semibold text-danger-deep">
                    {errors.username}
                  </p>
                ) : null}
              </div>

              <div>
                <label
                  htmlFor="reg-password"
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
                    id="reg-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={values.password}
                    onChange={(event) => update("password", event.target.value)}
                    aria-invalid={errors.password ? "true" : undefined}
                    placeholder="••••••••"
                    className={cx(inputClasses, "pr-16")}
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
                {errors.password ? (
                  <p role="alert" className="mt-1.5 text-[12px] font-semibold text-danger-deep">
                    {errors.password}
                  </p>
                ) : null}
              </div>

              <div>
                <label
                  htmlFor="reg-display-name"
                  className="block text-[18px] font-medium text-ink"
                >
                  {isTeacher ? "Pangalan ng guro" : "Palayaw sa HASA"}
                </label>
                <div className="relative mt-2">
                  <img
                    src={inputUser}
                    alt=""
                    className="pointer-events-none absolute left-4 top-1/2 h-7 w-7 -translate-y-1/2"
                    aria-hidden="true"
                  />
                  <input
                    id="reg-display-name"
                    name="displayName"
                    type="text"
                    value={values.displayName}
                    onChange={(event) => update("displayName", event.target.value)}
                    aria-invalid={errors.displayName ? "true" : undefined}
                    placeholder={isTeacher ? "Guro Cruz" : demoStudent.displayName}
                    className={inputClasses}
                  />
                </div>
                {errors.displayName ? (
                  <p role="alert" className="mt-1.5 text-[12px] font-semibold text-danger-deep">
                    {errors.displayName}
                  </p>
                ) : null}
              </div>

              {isTeacher ? (
                <div
                  id="reg-teacher-help"
                  className="rounded-[15px] border border-line bg-white/60 px-4 py-3 text-[13px] leading-relaxed text-muted"
                >
                  Makakagawa ka ng klase at kodigo ng klase kapag aktibo na ang
                  backend at pagsusuri ng pahintulot.
                </div>
              ) : (
                <div>
                  <label
                    htmlFor="reg-class-code"
                    className="block text-[18px] font-medium text-ink"
                  >
                    Kodigo ng Klase
                  </label>
                  <div className="relative mt-2">
                    <img
                      src={inputLock}
                      alt=""
                      className="pointer-events-none absolute left-4 top-1/2 h-7 w-7 -translate-y-1/2"
                      aria-hidden="true"
                    />
                    <input
                      id="reg-class-code"
                      name="classCode"
                      type="text"
                      value={values.classCode}
                      onChange={(event) => update("classCode", event.target.value)}
                      aria-invalid={errors.classCode ? "true" : undefined}
                      placeholder="HASA-8A"
                      className={cx(inputClasses, "uppercase placeholder:normal-case")}
                    />
                  </div>
                  {errors.classCode ? (
                    <p role="alert" className="mt-1.5 text-[12px] font-semibold text-danger-deep">
                      {errors.classCode}
                    </p>
                  ) : null}
                </div>
              )}

              <button
                type="submit"
                className="mt-6 flex h-[46px] w-full items-center justify-center rounded-[20px] bg-plum-800 text-[16px] font-bold text-canvas shadow-[0_4px_4px_rgba(0,0,0,0.25)] transition-colors hover:bg-plum-900"
              >
                Create an Account
              </button>

              <div className="flex items-center gap-4 pt-1" aria-hidden="true">
                <span className="h-px flex-1 bg-[#bdbdbd]" />
                <span className="text-[16px] text-ink">or</span>
                <span className="h-px flex-1 bg-[#bdbdbd]" />
              </div>

              <Link
                to="/login"
                className="mx-auto flex h-[38px] w-[220px] items-center justify-center rounded-[15px] bg-lav-400 text-[15px] font-medium text-canvas transition-colors hover:bg-[#7e7eb0]"
              >
                Mag-log in
              </Link>

              <p className="pt-2 text-[11px] leading-relaxed text-muted">
                Prototype pa lamang: hindi nai-save ang account at wala pang
                backend, database, o secure na password hashing.
              </p>

              <div aria-live="polite">
                {submitted ? (
                  <Alert
                    variant="warning"
                    title="Hindi pa aktibo ang pagpaparehistro"
                    className="mt-1"
                  >
                    Naka-validate ang form, pero walang account na nagawa at
                    walang datos na naipadala sa server.
                    {isTeacher
                      ? " Para sa prototype, tingnan ang Tanawan ng Guro."
                      : ""}
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
