import { useState } from "react";
import { CheckCircle2, KeyRound, Save, ShieldCheck, UserRound } from "lucide-react";
import { useAuth } from "../../app/AuthProvider.jsx";
import Seo from "../../components/Seo.jsx";
import { Alert, Button, Card, Chip, Field, Input, PageHeader } from "../../components/ui.jsx";
import { api, errorMessage } from "../../lib/api.js";
import { READING_LEVELS, formatDate } from "../../lib/format.js";
import { cx } from "../../utils/cx.js";

export default function ProfilePage() {
  const { user, updateSession } = useAuth();
  const [profile, setProfile] = useState({
    displayName: user?.displayName || "",
    readingLevel: user?.readingLevel || "instructional",
  });
  const [profileState, setProfileState] = useState({ pending: false, error: "", success: "" });
  const [password, setPassword] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [passwordState, setPasswordState] = useState({ pending: false, error: "", success: "" });

  const saveProfile = async (event) => {
    event.preventDefault();
    setProfileState({ pending: true, error: "", success: "" });
    try {
      const payload = await api.patch("/auth/profile", profile);
      updateSession(payload);
      setProfileState({ pending: false, error: "", success: "Na-update na ang iyong profile." });
    } catch (error) {
      setProfileState({ pending: false, error: errorMessage(error), success: "" });
    }
  };

  const savePassword = async (event) => {
    event.preventDefault();
    if (password.newPassword !== password.confirmPassword) {
      setPasswordState({ pending: false, error: "Hindi magkatugma ang bagong password at kumpirmasyon.", success: "" });
      return;
    }
    setPasswordState({ pending: true, error: "", success: "" });
    try {
      const payload = await api.post("/auth/password", {
        currentPassword: password.currentPassword,
        newPassword: password.newPassword,
      });
      setPassword({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setPasswordState({ pending: false, error: "", success: payload.message || "Napalitan na ang password." });
    } catch (error) {
      setPasswordState({ pending: false, error: errorMessage(error), success: "" });
    }
  };

  return (
    <>
      <Seo
        title="Aking Profile"
        description="I-edit ang iyong pangalan, antas ng pagbasa, at password sa HASA."
        noindex
        path="/student/profile"
      />
      <PageHeader
        eyebrow="Account"
        title="Aking Profile"
        description="Pamahalaan ang iyong pangalan at antas ng pagbasa. Ang username ay hindi na mababago."
      />

      <div className="grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
        <Card>
          <div className="flex items-center gap-3 border-b border-plum-100 pb-4">
            <span className="grid size-11 place-items-center rounded-xl bg-accent-soft text-accent-strong">
              <UserRound className="size-5" aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-base font-bold text-ink">Personal na impormasyon</h2>
              <p className="text-xs text-muted">Makikita ito ng iyong guro sa kanyang listahan.</p>
            </div>
          </div>

          {profileState.error ? <Alert tone="danger" className="mt-4">{profileState.error}</Alert> : null}
          {profileState.success ? <Alert tone="success" className="mt-4">{profileState.success}</Alert> : null}

          <form onSubmit={saveProfile} className="mt-4 space-y-4">
            <Field label="Palayaw o pangalan" htmlFor="displayName">
              <Input
                id="displayName"
                value={profile.displayName}
                onChange={(event) => setProfile((current) => ({ ...current, displayName: event.target.value }))}
                required
              />
            </Field>
            <Field label="Username" htmlFor="username" hint="Hindi na mababago. Ito ang gamit mo sa pag-log in.">
              <Input id="username" value={user?.username || ""} readOnly disabled />
            </Field>
            <fieldset>
              <legend className="mb-2 text-sm font-semibold text-ink">Antas ng pagbasa</legend>
              <div className="grid gap-2 sm:grid-cols-3">
                {READING_LEVELS.map((level) => (
                  <label
                    key={level.value}
                    className={cx(
                      "cursor-pointer rounded-xl border p-3 transition-colors",
                      profile.readingLevel === level.value
                        ? "border-accent bg-accent-soft"
                        : "border-plum-200 hover:border-plum-400",
                    )}
                  >
                    <input
                      type="radio"
                      name="readingLevel"
                      value={level.value}
                      checked={profile.readingLevel === level.value}
                      onChange={(event) => setProfile((current) => ({ ...current, readingLevel: event.target.value }))}
                      className="sr-only"
                    />
                    <span className="block text-xs font-bold text-ink">{level.label}</span>
                    <span className="mt-1 block text-[11px] leading-relaxed text-muted">{level.description}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <Button type="submit" disabled={profileState.pending}>
              <Save className="size-4" aria-hidden="true" />
              {profileState.pending ? "Sine-save…" : "I-save ang profile"}
            </Button>
          </form>
        </Card>

        <div className="space-y-5">
          <Card>
            <h2 className="text-base font-bold text-ink">Impormasyon ng account</h2>
            <dl className="mt-3 space-y-2.5 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Uri ng account</dt>
                <dd className="font-semibold text-ink">Mag-aaral</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Klase</dt>
                <dd className="text-right font-semibold text-ink">{user?.class?.name || "—"}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Guro</dt>
                <dd className="text-right font-semibold text-ink">{user?.class?.teacherName || "—"}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Miyembro mula</dt>
                <dd className="text-right font-semibold text-ink">{formatDate(user?.createdAt)}</dd>
              </div>
            </dl>
            <div className="mt-4">
              <Chip tone="success"><ShieldCheck className="size-3.5" aria-hidden="true" /> Protektadong account</Chip>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-2">
              <KeyRound className="size-4.5 text-accent" aria-hidden="true" />
              <h2 className="text-base font-bold text-ink">Palitan ang password</h2>
            </div>
            {passwordState.error ? <Alert tone="danger" className="mt-3">{passwordState.error}</Alert> : null}
            {passwordState.success ? (
              <Alert tone="success" className="mt-3" title="Matagumpay">
                {passwordState.success} <CheckCircle2 className="inline size-3.5" aria-hidden="true" />
              </Alert>
            ) : null}
            <form onSubmit={savePassword} className="mt-3 space-y-3">
              <Field label="Kasalukuyang password" htmlFor="currentPassword">
                <Input
                  id="currentPassword"
                  type="password"
                  autoComplete="current-password"
                  value={password.currentPassword}
                  onChange={(event) => setPassword((current) => ({ ...current, currentPassword: event.target.value }))}
                  required
                />
              </Field>
              <Field label="Bagong password" htmlFor="newPassword" hint="8–128 karakter.">
                <Input
                  id="newPassword"
                  type="password"
                  autoComplete="new-password"
                  value={password.newPassword}
                  onChange={(event) => setPassword((current) => ({ ...current, newPassword: event.target.value }))}
                  required
                />
              </Field>
              <Field label="Kumpirmahin ang bagong password" htmlFor="confirmPassword">
                <Input
                  id="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  value={password.confirmPassword}
                  onChange={(event) => setPassword((current) => ({ ...current, confirmPassword: event.target.value }))}
                  required
                />
              </Field>
              <Button type="submit" variant="secondary" className="w-full" disabled={passwordState.pending}>
                {passwordState.pending ? "Pinapalitan…" : "Palitan ang password"}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </>
  );
}
