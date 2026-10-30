import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { ArrowLeft, ArrowRight, CheckCircle2, Eye, EyeOff, GraduationCap, UserRound } from "lucide-react";
import { useAuth } from "../../app/AuthProvider.jsx";
import Seo from "../../components/Seo.jsx";
import Logo from "../../components/Logo.jsx";
import { Alert, Button, Field, Input, Select } from "../../components/ui.jsx";
import { api, errorMessage } from "../../lib/api.js";
import { READING_LEVELS } from "../../lib/format.js";
import { cx } from "../../utils/cx.js";

const EMPTY_STUDENT = {
  displayName: "",
  username: "",
  password: "",
  confirmPassword: "",
  classCode: "",
  readingLevel: "instructional",
};

const EMPTY_TEACHER = {
  displayName: "",
  username: "",
  password: "",
  confirmPassword: "",
  className: "",
  schoolCode: "",
};

export default function RegisterPage() {
  const { registerStudent, registerTeacher } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialRole = searchParams.get("role") === "teacher" ? "teacher" : "student";
  const [role, setRole] = useState(initialRole);
  const [studentForm, setStudentForm] = useState(EMPTY_STUDENT);
  const [teacherForm, setTeacherForm] = useState(EMPTY_TEACHER);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [teacherEnabled, setTeacherEnabled] = useState(true);

  useEffect(() => {
    api
      .get("/config")
      .then((data) => setTeacherEnabled(Boolean(data.teacherRegistrationEnabled)))
      .catch(() => {});
  }, []);

  const switchRole = (nextRole) => {
    setRole(nextRole);
    setError("");
    setSearchParams(nextRole === "teacher" ? { role: "teacher" } : {}, { replace: true });
  };

  const validate = (form) => {
    if (!form.displayName.trim() || !form.username.trim()) return "Ilagay ang pangalan at username.";
    if (form.password.length < 8) return "Dapat may hindi bababa sa 8 karakter ang password.";
    if (form.password !== form.confirmPassword) return "Hindi magkatugma ang password at kumpirmasyon.";
    if (role === "student" && !form.classCode.trim()) return "Ilagay ang kodigo ng klase mula sa iyong guro.";
    if (role === "teacher" && !form.className.trim()) return "Ilagay ang pangalan ng iyong klase.";
    if (role === "teacher" && !form.schoolCode.trim()) return "Ilagay ang kodigo ng paaralan para sa mga guro.";
    return "";
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");
    const activeForm = role === "student" ? studentForm : teacherForm;
    const validationError = validate(activeForm);
    if (validationError) {
      setError(validationError);
      return;
    }
    setPending(true);
    try {
      if (role === "student") {
        await registerStudent({
          displayName: studentForm.displayName,
          username: studentForm.username,
          password: studentForm.password,
          classCode: studentForm.classCode,
          readingLevel: studentForm.readingLevel,
        });
        navigate("/student/dashboard", { replace: true });
      } else {
        await registerTeacher({
          displayName: teacherForm.displayName,
          username: teacherForm.username,
          password: teacherForm.password,
          className: teacherForm.className,
          schoolCode: teacherForm.schoolCode,
        });
        navigate("/teacher/dashboard", { replace: true });
      }
    } catch (requestError) {
      setError(errorMessage(requestError));
    } finally {
      setPending(false);
    }
  };

  const form = role === "student" ? studentForm : teacherForm;
  const updateForm = (key, value) => {
    if (role === "student") setStudentForm((current) => ({ ...current, [key]: value }));
    else setTeacherForm((current) => ({ ...current, [key]: value }));
  };

  return (
    <>
      <Seo
        title="Gumawa ng account"
        description="Magrehistro bilang mag-aaral o guro sa HASA. Kailangan ng mag-aaral ang kodigo ng klase mula sa guro."
        noindex
        path="/register"
      />
      <div className="min-h-screen bg-cream-50">
        <header className="border-b border-plum-100 bg-cream-50/90">
          <div className="mx-auto flex h-18 w-full max-w-5xl items-center px-4 py-3 sm:px-6">
            <Logo />
            <Link to="/" className="ml-auto inline-flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-semibold text-muted hover:text-ink">
              <ArrowLeft className="size-4" aria-hidden="true" /> Bumalik sa simula
            </Link>
          </div>
        </header>

        <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-accent-strong">Simula ng pag-aaral</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-ink sm:text-4xl">Gumawa ng account sa HASA</h1>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-muted">
              Pumili kung mag-aaral ka o guro. Ang impormasyong ilalagay mo ay makikita lamang
              ng iyo at ng guro ng iyong klase.
            </p>
          </div>

          <div className="mt-7 grid gap-3 sm:grid-cols-2" role="tablist" aria-label="Uri ng account">
            <button
              type="button"
              role="tab"
              aria-selected={role === "student"}
              onClick={() => switchRole("student")}
              className={cx(
                "flex items-center gap-3 rounded-2xl border p-4 text-left transition-colors",
                role === "student" ? "border-accent bg-accent-soft" : "border-plum-200 bg-white hover:border-plum-400",
              )}
            >
              <span className={cx("grid size-10 place-items-center rounded-xl", role === "student" ? "bg-accent text-white" : "bg-plum-100 text-plum-700")}>
                <UserRound className="size-5" aria-hidden="true" />
              </span>
              <span>
                <span className="block text-sm font-bold text-ink">Mag-aaral</span>
                <span className="block text-xs text-muted">May kodigo ng klase</span>
              </span>
              {role === "student" ? <CheckCircle2 className="ml-auto size-5 text-accent" aria-hidden="true" /> : null}
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={role === "teacher"}
              onClick={() => switchRole("teacher")}
              className={cx(
                "flex items-center gap-3 rounded-2xl border p-4 text-left transition-colors",
                role === "teacher" ? "border-accent bg-accent-soft" : "border-plum-200 bg-white hover:border-plum-400",
              )}
            >
              <span className={cx("grid size-10 place-items-center rounded-xl", role === "teacher" ? "bg-accent text-white" : "bg-plum-100 text-plum-700")}>
                <GraduationCap className="size-5" aria-hidden="true" />
              </span>
              <span>
                <span className="block text-sm font-bold text-ink">Guro</span>
                <span className="block text-xs text-muted">Gagawa ng sariling klase</span>
              </span>
              {role === "teacher" ? <CheckCircle2 className="ml-auto size-5 text-accent" aria-hidden="true" /> : null}
            </button>
          </div>

          <section className="mt-5 rounded-2xl border border-plum-100 bg-white p-5 sm:p-7">
            {role === "teacher" && !teacherEnabled ? (
              <Alert tone="warning" title="Sarado ang pagpaparehistro ng guro" className="mb-5">
                Hilingin sa administrador ng paaralan na gumawa ng account ng guro. Maaari pa ring
                mag-log in ang mga may existing na account.
              </Alert>
            ) : null}
            {error ? <Alert tone="danger" title="Hindi natuloy ang pagrehistro" className="mb-5">{error}</Alert> : null}

            <form onSubmit={onSubmit} className="space-y-4" noValidate>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label={role === "teacher" ? "Buong pangalan ng guro" : "Palayaw o pangalan"} htmlFor="displayName">
                  <Input
                    id="displayName"
                    autoComplete="name"
                    placeholder={role === "teacher" ? "hal. Gng. Maria Santos" : "hal. Ana"}
                    value={form.displayName}
                    onChange={(event) => updateForm("displayName", event.target.value)}
                    required
                  />
                </Field>
                <Field label="Username" htmlFor="username" hint="3–30 letra, numero, tuldok, gitling, o underscore.">
                  <Input
                    id="username"
                    autoComplete="username"
                    autoCapitalize="none"
                    spellCheck={false}
                    placeholder="hal. ana.reyes"
                    value={form.username}
                    onChange={(event) => updateForm("username", event.target.value)}
                    required
                  />
                </Field>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Password" htmlFor="password" hint="Hindi bababa sa 8 karakter.">
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      className="pr-12"
                      value={form.password}
                      onChange={(event) => updateForm("password", event.target.value)}
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
                <Field label="Kumpirmahin ang password" htmlFor="confirmPassword">
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={form.confirmPassword}
                    onChange={(event) => updateForm("confirmPassword", event.target.value)}
                    required
                  />
                </Field>
              </div>

              {role === "student" ? (
                <>
                  <Field label="Kodigo ng klase" htmlFor="classCode" hint="Hingin ito sa iyong guro. Halimbawa: HASA-ABC123.">
                    <Input
                      id="classCode"
                      autoCapitalize="characters"
                      spellCheck={false}
                      placeholder="HASA-XXXXXX"
                      value={studentForm.classCode}
                      onChange={(event) => updateForm("classCode", event.target.value.toUpperCase())}
                      required
                    />
                  </Field>
                  <fieldset>
                    <legend className="mb-2 text-sm font-semibold text-ink">Antas ng pagbasa</legend>
                    <div className="grid gap-2 sm:grid-cols-3">
                      {READING_LEVELS.map((level) => (
                        <label
                          key={level.value}
                          className={cx(
                            "cursor-pointer rounded-xl border p-3 transition-colors",
                            studentForm.readingLevel === level.value
                              ? "border-accent bg-accent-soft"
                              : "border-plum-200 hover:border-plum-400",
                          )}
                        >
                          <input
                            type="radio"
                            name="readingLevel"
                            value={level.value}
                            checked={studentForm.readingLevel === level.value}
                            onChange={(event) => updateForm("readingLevel", event.target.value)}
                            className="sr-only"
                          />
                          <span className="block text-xs font-bold text-ink">{level.label}</span>
                          <span className="mt-1 block text-[11px] leading-relaxed text-muted">{level.description}</span>
                        </label>
                      ))}
                    </div>
                    <p className="mt-2 text-xs text-muted">
                      Ito ay pinipili, hindi sinusukat. Maaari mo itong palitan sa profile.
                    </p>
                  </fieldset>
                </>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Pangalan ng klase" htmlFor="className" hint="Makikita ito ng mga mag-aaral.">
                    <Input
                      id="className"
                      placeholder="hal. Baitang 8 – Rizal"
                      value={teacherForm.className}
                      onChange={(event) => updateForm("className", event.target.value)}
                      required
                    />
                  </Field>
                  <Field label="Kodigo ng paaralan para sa guro" htmlFor="schoolCode" hint="Ibinibigay ng administrador ng paaralan.">
                    <Input
                      id="schoolCode"
                      type="password"
                      autoComplete="off"
                      value={teacherForm.schoolCode}
                      onChange={(event) => updateForm("schoolCode", event.target.value)}
                      required
                    />
                  </Field>
                </div>
              )}

              <Button type="submit" size="lg" className="w-full" disabled={pending || (role === "teacher" && !teacherEnabled)}>
                {pending ? "Ginagawa ang account…" : role === "student" ? "Gumawa ng account ng mag-aaral" : "Gumawa ng account ng guro"}
                {!pending ? <ArrowRight className="size-4.5" aria-hidden="true" /> : null}
              </Button>
            </form>

            <p className="mt-4 text-center text-sm text-muted">
              May account na?{" "}
              <Link to="/login" className="font-semibold text-accent-strong hover:text-accent-deep">Mag-log in</Link>
            </p>
          </section>
        </main>
      </div>
    </>
  );
}
