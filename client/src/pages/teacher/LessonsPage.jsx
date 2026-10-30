import { useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import Seo from "../../components/Seo.jsx";
import {
  Alert,
  Button,
  Card,
  Checkbox,
  Chip,
  Field,
  Input,
  Loading,
  Modal,
  PageHeader,
  Select,
  Textarea,
  buttonClass,
} from "../../components/ui.jsx";
import { api, errorMessage } from "../../lib/api.js";
import { DIFFICULTY_LABELS, formatDate } from "../../lib/format.js";
import { useApi } from "../../lib/useApi.js";

const EMPTY = {
  title: "",
  unit: "",
  description: "",
  difficulty: "katamtaman",
  estimatedMinutes: 10,
  xp: 15,
  contents: { independent: "", instructional: "", frustration: "" },
  vocabulary: [],
  published: true,
};

function LessonForm({ initial, onSubmit, onCancel, pending, error }) {
  const [form, setForm] = useState(() => ({
    ...EMPTY,
    ...initial,
    contents: { ...EMPTY.contents, ...(initial?.contents || {}) },
    vocabulary: initial?.vocabulary || [],
  }));

  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const setContent = (key, value) =>
    setForm((current) => ({ ...current, contents: { ...current.contents, [key]: value } }));
  const setVocab = (index, key, value) =>
    setForm((current) => ({
      ...current,
      vocabulary: current.vocabulary.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [key]: value } : item,
      ),
    }));
  const addVocab = () =>
    setForm((current) => ({
      ...current,
      vocabulary: [...current.vocabulary, { word: "", explanation: "", example: "" }],
    }));
  const removeVocab = (index) =>
    setForm((current) => ({
      ...current,
      vocabulary: current.vocabulary.filter((_, itemIndex) => itemIndex !== index),
    }));

  const submit = (event) => {
    event.preventDefault();
    onSubmit({
      ...form,
      estimatedMinutes: Number(form.estimatedMinutes),
      xp: Number(form.xp),
      vocabulary: form.vocabulary.filter((item) => item.word.trim() && item.explanation.trim()),
    });
  };

  return (
    <form id="lesson-form" onSubmit={submit} className="space-y-5">
      {error ? <Alert tone="danger">{error}</Alert> : null}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Pamagat ng aralin" htmlFor="lesson-title">
          <Input id="lesson-title" value={form.title} onChange={(event) => set("title", event.target.value)} required />
        </Field>
        <Field label="Yunit" htmlFor="lesson-unit">
          <Input id="lesson-unit" value={form.unit} onChange={(event) => set("unit", event.target.value)} required />
        </Field>
      </div>
      <Field label="Paglalarawan" htmlFor="lesson-description">
        <Textarea id="lesson-description" className="min-h-20" value={form.description} onChange={(event) => set("description", event.target.value)} required />
      </Field>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Antas ng hirap" htmlFor="lesson-difficulty">
          <Select id="lesson-difficulty" value={form.difficulty} onChange={(event) => set("difficulty", event.target.value)}>
            {Object.entries(DIFFICULTY_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </Select>
        </Field>
        <Field label="Tagal (minuto)" htmlFor="lesson-minutes">
          <Input id="lesson-minutes" type="number" min="1" max="180" value={form.estimatedMinutes} onChange={(event) => set("estimatedMinutes", event.target.value)} required />
        </Field>
        <Field label="XP" htmlFor="lesson-xp">
          <Input id="lesson-xp" type="number" min="0" max="200" value={form.xp} onChange={(event) => set("xp", event.target.value)} required />
        </Field>
      </div>

      <div className="rounded-xl border border-plum-100 bg-plum-50/40 p-3.5">
        <p className="text-sm font-bold text-ink">Tatlong bersyon ng teksto</p>
        <p className="mt-0.5 text-xs text-muted">Kailangan ang lahat. Panatilihin ang parehong kahulugan sa bawat antas.</p>
        <div className="mt-3 space-y-3">
          <Field label="Malayang Pagbasa (Independent)" htmlFor="content-independent">
            <Textarea id="content-independent" className="min-h-28" value={form.contents.independent} onChange={(event) => setContent("independent", event.target.value)} required />
          </Field>
          <Field label="May Gabay na Pagbasa (Instructional)" htmlFor="content-instructional">
            <Textarea id="content-instructional" className="min-h-28" value={form.contents.instructional} onChange={(event) => setContent("instructional", event.target.value)} required />
          </Field>
          <Field label="Nahihirapang Pagbasa (Frustration)" htmlFor="content-frustration">
            <Textarea id="content-frustration" className="min-h-28" value={form.contents.frustration} onChange={(event) => setContent("frustration", event.target.value)} required />
          </Field>
        </div>
      </div>

      <div className="rounded-xl border border-plum-100 p-3.5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-bold text-ink">Talasalitaan</p>
            <p className="text-xs text-muted">Opsyonal. Hanggang 12 salita.</p>
          </div>
          <Button type="button" size="sm" variant="secondary" onClick={addVocab} disabled={form.vocabulary.length >= 12}>
            <Plus className="size-3.5" aria-hidden="true" /> Magdagdag
          </Button>
        </div>
        {form.vocabulary.length > 0 ? (
          <div className="mt-3 space-y-2">
            {form.vocabulary.map((item, index) => (
              <div key={index} className="grid gap-2 rounded-lg bg-cream-50 p-2.5 sm:grid-cols-[1fr_1.6fr_1fr_auto]">
                <Input aria-label={`Salita ${index + 1}`} placeholder="Salita" value={item.word} onChange={(event) => setVocab(index, "word", event.target.value)} />
                <Input aria-label={`Paliwanag ${index + 1}`} placeholder="Paliwanag" value={item.explanation} onChange={(event) => setVocab(index, "explanation", event.target.value)} />
                <Input aria-label={`Halimbawa ${index + 1}`} placeholder="Halimbawa" value={item.example || ""} onChange={(event) => setVocab(index, "example", event.target.value)} />
                <Button type="button" size="sm" variant="ghost" onClick={() => removeVocab(index)} aria-label={`Alisin ang salita ${index + 1}`}>
                  <Trash2 className="size-4 text-danger" aria-hidden="true" />
                </Button>
              </div>
            ))}
          </div>
        ) : null}
      </div>

      <Checkbox label="I-publish agad para makita ng klase" checked={form.published} onChange={(event) => set("published", event.target.checked)} />

      <div className="flex flex-wrap justify-end gap-2 border-t border-plum-100 pt-4">
        <Button variant="secondary" onClick={onCancel} type="button">Kanselahin</Button>
        <Button type="submit" disabled={pending}>{pending ? "Sine-save…" : initial?.id ? "I-save ang pagbabago" : "Gumawa ng aralin"}</Button>
      </div>
    </form>
  );
}

export default function TeacherLessonsPage() {
  const { data, error, loading, reload } = useApi("/teacher/lessons");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [pending, setPending] = useState(false);
  const [formError, setFormError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteError, setDeleteError] = useState("");
  const [deletePending, setDeletePending] = useState(false);

  const openCreate = () => {
    setEditing(null);
    setFormError("");
    setModalOpen(true);
  };
  const openEdit = (lesson) => {
    setEditing(lesson);
    setFormError("");
    setModalOpen(true);
  };

  const save = async (values) => {
    setPending(true);
    setFormError("");
    try {
      if (editing?.id) await api.patch(`/teacher/lessons/${editing.id}`, values);
      else await api.post("/teacher/lessons", values);
      setModalOpen(false);
      setEditing(null);
      reload();
    } catch (requestError) {
      setFormError(errorMessage(requestError));
    } finally {
      setPending(false);
    }
  };

  const remove = async () => {
    setDeletePending(true);
    setDeleteError("");
    try {
      await api.delete(`/teacher/lessons/${deleteTarget.id}`);
      setDeleteTarget(null);
      reload();
    } catch (requestError) {
      setDeleteError(errorMessage(requestError));
    } finally {
      setDeletePending(false);
    }
  };

  if (loading) return <Loading label="Kinukuha ang mga aralin…" />;
  if (error) return <Alert tone="danger" title="Hindi mabuksan ang mga aralin">{errorMessage(error)}</Alert>;

  const lessons = data?.lessons || [];
  const mine = lessons.filter((lesson) => lesson.editable);
  const shared = lessons.filter((lesson) => !lesson.editable);

  return (
    <>
      <Seo title="Pamamahala ng mga Aralin" description="Gumawa, i-edit, at i-publish ng mga aralin sa HASA." noindex path="/teacher/mga-aralin" />
      <PageHeader
        eyebrow="Nilalaman"
        title="Pamamahala ng Aralin"
        description="Pamahalaan ang mga aralin ng klase: gumawa ng sariling aralin para sa iyong klase. Ang mga pangkalahatang aralin ay hindi maaaring i-edit at ibinabahagi sa lahat ng klase."
        actions={<Button onClick={openCreate}><Plus className="size-4" aria-hidden="true" /> Bagong aralin</Button>}
      />

      <section>
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2 className="text-base font-bold text-ink">Aking mga aralin ({mine.length})</h2>
        </div>
        {mine.length === 0 ? (
          <Card className="border-dashed bg-white/60">
            <div className="flex flex-col items-center py-6 text-center">
              <BookOpen className="size-8 text-plum-400" aria-hidden="true" />
              <p className="mt-3 text-sm font-semibold text-ink">Wala ka pang sariling aralin</p>
              <p className="mt-1 text-xs text-muted">Gumawa ng aralin na may tatlong antas ng teksto.</p>
              <Button className="mt-4" onClick={openCreate}><Plus className="size-4" aria-hidden="true" /> Gumawa ng aralin</Button>
            </div>
          </Card>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {mine.map((lesson) => (
              <Card key={lesson.id} className="flex flex-col">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="flex flex-wrap gap-1.5">
                    <Chip tone={lesson.published ? "success" : "neutral"}>{lesson.published ? <><Eye className="size-3" aria-hidden="true" /> Nakalathala</> : <><EyeOff className="size-3" aria-hidden="true" /> Hindi pa nakalathala</>}</Chip>
                    <Chip>{DIFFICULTY_LABELS[lesson.difficulty]}</Chip>
                  </div>
                  <Chip tone="gold">{lesson.xp} XP</Chip>
                </div>
                <h3 className="mt-2.5 text-base font-bold text-ink">{lesson.title}</h3>
                <p className="text-xs font-medium text-plum-600">{lesson.unit}</p>
                <p className="mt-1.5 line-clamp-2 text-sm text-muted">{lesson.description}</p>
                <p className="mt-2 text-[11px] text-muted">Na-update {formatDate(lesson.updatedAt)}</p>
                <div className="mt-auto flex flex-wrap gap-2 pt-4">
                  <Button size="sm" variant="secondary" onClick={() => openEdit(lesson)}>
                    <Pencil className="size-3.5" aria-hidden="true" /> I-edit
                  </Button>
                  <Button size="sm" variant="ghost" className="text-danger hover:bg-danger-soft" onClick={() => { setDeleteError(""); setDeleteTarget(lesson); }}>
                    <Trash2 className="size-3.5" aria-hidden="true" /> Burahin
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section className="mt-7">
        <div className="mb-3 flex items-center gap-2">
          <Lock className="size-4 text-plum-400" aria-hidden="true" />
          <h2 className="text-base font-bold text-ink">Pangkalahatang aralin ({shared.length})</h2>
        </div>
        <div className="overflow-hidden rounded-2xl border border-plum-100 bg-white">
          <ul className="divide-y divide-plum-100">
            {shared.map((lesson) => (
              <li key={lesson.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-plum-100 text-plum-700"><BookOpen className="size-4" aria-hidden="true" /></span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-ink">{lesson.title}</p>
                  <p className="text-xs text-muted">{lesson.unit} · {lesson.estimatedMinutes} min</p>
                </div>
                <Chip tone="info">Hindi maaaring i-edit</Chip>
                <Chip>{lesson.xp} XP</Chip>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "I-edit ang aralin" : "Bagong aralin"}
        description="Ang bawat aralin ay may tatlong bersyon ng teksto."
        size="xl"
      >
        <LessonForm
          initial={editing}
          onSubmit={save}
          onCancel={() => setModalOpen(false)}
          pending={pending}
          error={formError}
        />
      </Modal>

      <Modal
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="Burahin ang aralin?"
        description={deleteTarget?.title}
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleteTarget(null)}>Kanselahin</Button>
            <Button variant="danger" onClick={remove} disabled={deletePending}>{deletePending ? "Binubura…" : "Burahin"}</Button>
          </>
        }
      >
        <Alert tone="warning" title="Hindi na ito mababawi">
          Kung may mag-aaral nang nagbukas ng araling ito, hindi ito mabubura. Maaari mo na lang
          itong hindi ilathala upang mapanatili ang rekord.
        </Alert>
        {deleteError ? <Alert tone="danger" className="mt-3">{deleteError}</Alert> : null}
      </Modal>
    </>
  );
}
