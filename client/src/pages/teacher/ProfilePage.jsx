import { useState } from "react";
import {
  Check,
  CheckCircle2,
  Copy,
  KeyRound,
  RefreshCw,
  Save,
  ShieldCheck,
  UserRound,
  Users,
} from "lucide-react";
import { useAuth } from "../../app/AuthProvider.jsx";
import Seo from "../../components/Seo.jsx";
import {
  Alert,
  Button,
  Card,
  Chip,
  Field,
  Input,
  Modal,
  PageHeader,
} from "../../components/ui.jsx";
import { api, errorMessage } from "../../lib/api.js";
import { formatDate } from "../../lib/format.js";

export default function TeacherProfilePage() {
  const { user, updateSession, refresh } = useAuth();
  const [profile, setProfile] = useState({
    displayName: user?.displayName || "",
    className: user?.class?.name || "",
  });
  const [profileState, setProfileState] = useState({ pending: false, error: "", success: "" });
  const [password, setPassword] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordState, setPasswordState] = useState({ pending: false, error: "", success: "" });
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState("");
  const [rotateOpen, setRotateOpen] = useState(false);
  const [rotateState, setRotateState] = useState({ pending: false, error: "" });

  const joinCode = user?.class?.joinCode || "";

  const saveProfile = async (event) => {
    event.preventDefault();
    setProfileState({ pending: true, error: "", success: "" });
    try {
      const payload = await api.patch("/auth/profile", {
        displayName: profile.displayName,
        className: profile.className,
      });
      updateSession(payload);
      setProfileState({
        pending: false,
        error: "",
        success: "Na-update na ang iyong profile at pangalan ng klase.",
      });
    } catch (error) {
      setProfileState({ pending: false, error: errorMessage(error), success: "" });
    }
  };

  const savePassword = async (event) => {
    event.preventDefault();
    if (password.newPassword !== password.confirmPassword) {
      setPasswordState({
        pending: false,
        error: "Hindi magkatugma ang bagong password at kumpirmasyon.",
        success: "",
      });
      return;
    }
    setPasswordState({ pending: true, error: "", success: "" });
    try {
      const payload = await api.post("/auth/password", {
        currentPassword: password.currentPassword,
        newPassword: password.newPassword,
      });
      setPassword({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setPasswordState({
        pending: false,
        error: "",
        success: payload.message || "Napalitan na ang password.",
      });
    } catch (error) {
      setPasswordState({ pending: false, error: errorMessage(error), success: "" });
    }
  };

  const copyCode = async () => {
    if (!joinCode) return;
    setCopyError("");
    try {
      await navigator.clipboard.writeText(joinCode);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopyError("Hindi makopya nang awtomatiko. Piliin at kopyahin ang kodigo nang manu-mano.");
    }
  };

  const rotateCode = async () => {
    setRotateState({ pending: true, error: "" });
    try {
      await api.post("/teacher/class/rotate-code");
      await refresh();
      setRotateOpen(false);
      setRotateState({ pending: false, error: "" });
      setCopied(false);
      setCopyError("");
    } catch (error) {
      setRotateState({ pending: false, error: errorMessage(error) });
    }
  };

  return (
    <>
      <Seo
        title="Profile ng Guro"
        description="Pamahalaan ang iyong pangalan, klase, kodigo ng klase, at password sa HASA."
        noindex
        path="/teacher/profile"
      />
      <PageHeader
        eyebrow="Account ng guro"
        title="Aking Profile"
        description="Pamahalaan ang iyong account at ang kodigong ibinibigay sa mga mag-aaral upang sumali sa klase."
      />

      <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-5">
          <Card>
            <div className="flex items-center gap-3 border-b border-plum-100 pb-4">
              <span className="grid size-11 place-items-center rounded-xl bg-accent-soft text-accent-strong">
                <UserRound className="size-5" aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-base font-bold text-ink">Personal na impormasyon</h2>
                <p className="text-xs text-muted">Ito ang makikitang pangalan ng iyong klase.</p>
              </div>
            </div>

            {profileState.error ? <Alert tone="danger" className="mt-4">{profileState.error}</Alert> : null}
            {profileState.success ? <Alert tone="success" className="mt-4">{profileState.success}</Alert> : null}

            <form onSubmit={saveProfile} className="mt-4 space-y-4">
              <Field label="Pangalan ng guro" htmlFor="displayName">
                <Input
                  id="displayName"
                  value={profile.displayName}
                  onChange={(event) =>
                    setProfile((current) => ({ ...current, displayName: event.target.value }))
                  }
                  autoComplete="name"
                  required
                />
              </Field>
              <Field
                label="Pangalan ng klase"
                htmlFor="className"
                hint="Makikita ito ng mga mag-aaral sa kanilang dashboard at profile."
              >
                <Input
                  id="className"
                  value={profile.className}
                  onChange={(event) =>
                    setProfile((current) => ({ ...current, className: event.target.value }))
                  }
                  required
                />
              </Field>
              <Field label="Username" htmlFor="teacherUsername" hint="Hindi na mababago. Ito ang gamit mo sa pag-log in.">
                <Input id="teacherUsername" value={user?.username || ""} readOnly disabled />
              </Field>
              <Button type="submit" disabled={profileState.pending}>
                <Save className="size-4" aria-hidden="true" />
                {profileState.pending ? "Sine-save…" : "I-save ang profile"}
              </Button>
            </form>
          </Card>

          <Card>
            <div className="flex items-center gap-2">
              <KeyRound className="size-4.5 text-accent" aria-hidden="true" />
              <h2 className="text-base font-bold text-ink">Palitan ang password</h2>
            </div>
            <p className="mt-1 text-xs text-muted">
              Kapag napalitan ang password, mananatiling bukas ang kasalukuyang session at
              isasara ang iba pang naka-log in na device.
            </p>
            {passwordState.error ? <Alert tone="danger" className="mt-3">{passwordState.error}</Alert> : null}
            {passwordState.success ? (
              <Alert tone="success" className="mt-3">
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="size-4" aria-hidden="true" /> {passwordState.success}
                </span>
              </Alert>
            ) : null}
            <form onSubmit={savePassword} className="mt-3 space-y-3">
              <Field label="Kasalukuyang password" htmlFor="currentPassword">
                <Input
                  id="currentPassword"
                  type="password"
                  autoComplete="current-password"
                  value={password.currentPassword}
                  onChange={(event) =>
                    setPassword((current) => ({ ...current, currentPassword: event.target.value }))
                  }
                  required
                />
              </Field>
              <Field label="Bagong password" htmlFor="newPassword" hint="8–128 karakter.">
                <Input
                  id="newPassword"
                  type="password"
                  autoComplete="new-password"
                  minLength={8}
                  maxLength={128}
                  value={password.newPassword}
                  onChange={(event) =>
                    setPassword((current) => ({ ...current, newPassword: event.target.value }))
                  }
                  required
                />
              </Field>
              <Field label="Kumpirmahin ang bagong password" htmlFor="confirmPassword">
                <Input
                  id="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  minLength={8}
                  maxLength={128}
                  value={password.confirmPassword}
                  onChange={(event) =>
                    setPassword((current) => ({ ...current, confirmPassword: event.target.value }))
                  }
                  required
                />
              </Field>
              <Button type="submit" variant="secondary" disabled={passwordState.pending}>
                {passwordState.pending ? "Pinapalitan…" : "Palitan ang password"}
              </Button>
            </form>
          </Card>
        </div>

        <div className="space-y-5">
          <Card className="bg-plum-900 text-white">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-plum-300">
              Kodigo ng klase
            </p>
            <p className="mt-2 break-all font-mono text-3xl font-bold tracking-wide text-gold">
              {joinCode || "Walang kodigo"}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-plum-200">
              Ibahagi ito sa mga mag-aaral. Kailangan nila ito para makagawa ng account sa
              iyong klase.
            </p>
            {copyError ? (
              <p className="mt-3 rounded-lg bg-white/10 px-3 py-2 text-xs text-gold">{copyError}</p>
            ) : null}
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={copyCode}
                disabled={!joinCode}
                className="inline-flex min-h-9 items-center gap-2 rounded-xl bg-white px-3.5 text-sm font-semibold text-plum-900 hover:bg-plum-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {copied ? <Check className="size-4" aria-hidden="true" /> : <Copy className="size-4" aria-hidden="true" />}
                {copied ? "Nakopya" : "Kopyahin ang kodigo"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setRotateState({ pending: false, error: "" });
                  setRotateOpen(true);
                }}
                disabled={!joinCode}
                className="inline-flex min-h-9 items-center gap-2 rounded-xl border border-white/25 px-3.5 text-sm font-semibold text-white hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <RefreshCw className="size-4" aria-hidden="true" />
                Palitan ang kodigo
              </button>
            </div>
          </Card>

          <Card>
            <h2 className="text-base font-bold text-ink">Impormasyon ng account</h2>
            <dl className="mt-3 space-y-2.5 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Uri ng account</dt>
                <dd className="font-semibold text-ink">Guro</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Klase</dt>
                <dd className="text-right font-semibold text-ink">{user?.class?.name || "—"}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Mga mag-aaral</dt>
                <dd className="inline-flex items-center gap-1.5 font-semibold text-ink">
                  <Users className="size-3.5 text-muted" aria-hidden="true" />
                  {user?.class?.studentCount ?? 0}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Miyembro mula</dt>
                <dd className="text-right font-semibold text-ink">{formatDate(user?.createdAt)}</dd>
              </div>
            </dl>
            <div className="mt-4">
              <Chip tone="success">
                <ShieldCheck className="size-3.5" aria-hidden="true" /> Protektadong account
              </Chip>
            </div>
          </Card>

          <div className="rounded-2xl border border-gold-strong/30 bg-gold-soft p-4 text-xs leading-relaxed text-brown">
            <p className="font-bold">Paalala sa kodigo</p>
            <p className="mt-1">
              Ang pagpapalit ng kodigo ay hindi nagtatanggal ng mga mag-aaral na kasalukuyang
              kabilang sa klase. Kailangan lamang ng bagong kodigo ang mga susunod na sasali.
            </p>
          </div>
        </div>
      </div>

      <Modal
        open={rotateOpen}
        onClose={() => setRotateOpen(false)}
        title="Palitan ang kodigo ng klase?"
        description="Gumawa ng bagong kodigo para sa mga susunod na mag-aaral."
        footer={
          <>
            <Button variant="secondary" onClick={() => setRotateOpen(false)} disabled={rotateState.pending}>
              Kanselahin
            </Button>
            <Button onClick={rotateCode} disabled={rotateState.pending}>
              <RefreshCw className="size-4" aria-hidden="true" />
              {rotateState.pending ? "Pinapalitan…" : "Palitan ang kodigo"}
            </Button>
          </>
        }
      >
        <p className="text-sm leading-relaxed text-muted">
          Mawawalan ng bisa ang dating kodigo, kaya hindi na makakasali ang sinumang gumagamit
          nito. Mananatili sa klase ang lahat ng kasalukuyang mag-aaral.
        </p>
        {rotateState.error ? <Alert tone="danger" className="mt-3">{rotateState.error}</Alert> : null}
      </Modal>
    </>
  );
}
