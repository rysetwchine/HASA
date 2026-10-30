import { useState } from "react";
import {
  ClipboardList,
  FileText,
  Lock,
  Pencil,
  Plus,
  Trash2,
  Trophy,
  X,
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
} from "../../components/ui.jsx";
import { api, errorMessage } from "../../lib/api.js";
import { formatDate } from "../../lib/format.js";
import { useApi } from "../../lib/useApi.js";
import { cx } from "../../utils/cx.js";

const EMPTY_QUESTION = {
  prompt: "",
  options: ["", "", "", ""],
  correctIndex: 0,
  explanation: "",
};

const EMPTY = {
  title: "",
  description: "",
  lessonId: "",
  xp: 25,
  passPercent: 60,
  timerSeconds: "",
  published: true,
  questions: [{ ...EMPTY_QUESTION, options: [...EMPTY_QUESTION.options] }],
};

function newQuestion() {
  return { ...EMPTY_QUESTION, options: [...EMPTY_QUESTION.options] };
}

function AssessmentForm({ initial, kind, lessons, locked, onSubmit, onCancel, pending, error }) {
  const [form, setForm] = useState(() => {
    if (!initial) return { ...EMPTY, questions: [newQuestion()] };
    return {
      title: initial.title,
      description: initial.description,
      lessonId: initial.lesson?.id ?? "",
      xp: initial.xp,
      passPercent: initial.passPercent,
      timerSeconds: initial.timerSeconds ?? "",
      published: initial.published,
      questions: initial.questions?.map((question) => ({
        prompt: question.prompt,
        options: [...question.options],
        correctIndex: question.correctIndex,
        explanation: question.explanation,
      })) || [newQuestion()],
    };
  });
  const [validation, setValidation] = useState("");

  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const setQuestion = (index, key, value) =>
    setForm((current) => ({
      ...current,
      questions: current.questions.map((question, questionIndex) =>
        questionIndex === index ? { ...question, [key]: value } : question,
      ),
    }));
  const setOption = (questionIndex, optionIndex, value) =>
    setForm((current) => ({
      ...current,
      questions: current.questions.map((question, index) =>
        index === questionIndex
          ? { ...question, options: question.options.map((option, i) => (i === optionIndex ? value : option)) }
          : question,
      ),
    }));
  const addQuestion = () => setForm((current) => ({ ...current, questions: [...current.questions, newQuestion()] }));
  const removeQuestion = (index) => setForm((current) => ({
    ...current,
    questions: current.questions.filter((_, i) => i !== index),
  }));

  const addOption = (questionIndex) => setForm((current) => ({
    ...current,
    questions: current.questions.map((question, index) =>
      index === questionIndex && question.options.length < 4
        ? { ...question, options: [...question.options, ""] }
        : question,
    ),
  }));
  const removeOption = (questionIndex, optionIndex) => setForm((current) => ({
    ...current,
    questions: current.questions.map((question, index) => {
      if (index !== questionIndex || question.options.length <= 2) return question;
      const options = question.options.filter((_, i) => i !== optionIndex);
      return {
        ...question,
        options,
        correctIndex: Math.min(question.correctIndex, options.length - 1),
      };
    }),
  }));

  const submit = (event) => {
    event.preventDefault();
    if (!locked) {
      if (form.questions.length === 0) {
        setValidation("Maglagay ng hindi bababa sa isang tanong.");
        return;
      }
      const invalid = form.questions.findIndex(
        (question) =>
          !question.prompt.trim() ||
          question.options.some((option) => !option.trim()),
      );
      if (invalid >= 0) {
        setValidation(`Kumpletuhin ang tanong ${invalid + 1} at lahat ng pagpipilian.`);
        return;
      }
    }
    setValidation("");
    const payload = {
      ...form,
      kind,
      xp: Number(form.xp),
      passPercent: Number(form.passPercent),
      timerSeconds: form.timerSeconds === "" ? null : Number(form.timerSeconds),
      lessonId: form.lessonId === "" ? null : Number(form.lessonId),
      ...(locked ? { questions: undefined } : {}),
    };
    if (locked) delete payload.questions;
    onSubmit(payload);
  };

  return (
    <form onSubmit={submit} className="space-y-5">
      {error ? <Alert tone="danger">{error}</Alert> : null}
      {validation ? <Alert tone="warning">{validation}</Alert> : null}
      {locked ? (
        <Alert tone="info" title="Nakasara ang mga tanong">
          May naisumite nang sagot sa gawaing ito. Maaari mong baguhin ang pamagat, paglalarawan,
          XP, porsyentong pumasa, at status ng paglalathala, ngunit hindi ang mga tanong.
        </Alert>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Pamagat" htmlFor="assessment-title">
          <Input id="assessment-title" value={form.title} onChange={(event) => set("title", event.target.value)} required />
        </Field>
        <Field label="Kaugnay na aralin" htmlFor="assessment-lesson">
          <Select id="assessment-lesson" value={form.lessonId} onChange={(event) => set("lessonId", event.target.value)}>
            <option value="">Walang kaugnay na aralin</option>
            {lessons.map((lesson) => <option key={lesson.id} value={lesson.id}>{lesson.title}</option>)}
          </Select>
        </Field>
      </div>
      <Field label="Paglalarawan" htmlFor="assessment-description">
        <Textarea id="assessment-description" className="min-h-20" value={form.description} onChange={(event) => set("description", event.target.value)} required />
      </Field>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="XP sa unang pagkakapasa" htmlFor="assessment-xp">
          <Input id="assessment-xp" type="number" min="0" max="300" value={form.xp} onChange={(event) => set("xp", event.target.value)} required />
        </Field>
        <Field label="Porsyentong pumasa (%)" htmlFor="assessment-pass">
          <Input id="assessment-pass" type="number" min="10" max="100" value={form.passPercent} onChange={(event) => set("passPercent", event.target.value)} required />
        </Field>
        <Field label="Oras (segundo)" htmlFor="assessment-timer" hint="Iwanang blangko kung walang limitasyon sa oras.">
          <Input id="assessment-timer" type="number" min="30" max="7200" value={form.timerSeconds} onChange={(event) => set("timerSeconds", event.target.value)} />
        </Field>
      </div>
      <Checkbox label="Ilathala agad para makita ng klase" checked={form.published} onChange={(event) => set("published", event.target.checked)} />

      <div className="border-t border-plum-100 pt-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-ink">Mga tanong</h3>
            <p className="text-xs text-muted">{form.questions.length} tanong · 2–4 pagpipilian bawat isa</p>
          </div>
          {!locked ? (
            <Button type="button" size="sm" variant="secondary" onClick={addQuestion} disabled={form.questions.length >= 50}>
              <Plus className="size-3.5" aria-hidden="true" /> Magdagdag ng tanong
            </Button>
          ) : null}
        </div>

        <div className="mt-3 space-y-3">
          {form.questions.map((question, questionIndex) => (
            <div key={questionIndex} className="rounded-xl border border-plum-100 bg-cream-50/70 p-3.5">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-bold uppercase tracking-wide text-plum-600">Tanong {questionIndex + 1}</p>
                {!locked && form.questions.length > 1 ? (
                  <button type="button" onClick={() => removeQuestion(questionIndex)} className="rounded-md p-1 text-danger hover:bg-danger-soft" aria-label={`Alisin ang tanong ${questionIndex + 1}`}>
                    <Trash2 className="size-4" aria-hidden="true" />
                  </button>
                ) : null}
              </div>
              <Field label="Tanong" htmlFor={`question-${questionIndex}`} className="mt-2">
                <Input id={`question-${questionIndex}`} value={question.prompt} onChange={(event) => setQuestion(questionIndex, "prompt", event.target.value)} disabled={locked} required={!locked} />
              </Field>
              <fieldset className="mt-3">
                <legend className="mb-1.5 text-xs font-semibold text-ink">Mga pagpipilian (piliin ang tamang sagot)</legend>
                <div className="space-y-2">
                  {question.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`correct-${questionIndex}`}
                        checked={question.correctIndex === optionIndex}
                        onChange={() => setQuestion(questionIndex, "correctIndex", optionIndex)}
                        disabled={locked}
                        aria-label={`Tamang sagot: opsyon ${String.fromCharCode(65 + optionIndex)}`}
                        className="size-4 shrink-0 accent-accent"
                      />
                      <span className="w-4 shrink-0 text-xs font-bold text-muted">{String.fromCharCode(65 + optionIndex)}</span>
                      <Input
                        aria-label={`Opsyon ${String.fromCharCode(65 + optionIndex)}`}
                        value={option}
                        onChange={(event) => setOption(questionIndex, optionIndex, event.target.value)}
                        disabled={locked}
                        required={!locked}
                      />
                      {!locked && question.options.length > 2 ? (
                        <button type="button" onClick={() => removeOption(questionIndex, optionIndex)} className="rounded-md p-1.5 text-muted hover:bg-plum-100 hover:text-danger" aria-label={`Alisin ang opsyon ${String.fromCharCode(65 + optionIndex)}`}>
                          <X className="size-3.5" aria-hidden="true" />
                        </button>
                      ) : null}
                    </div>
                  ))}
                </div>
                {!locked && question.options.length < 4 ? (
                  <button type="button" onClick={() => addOption(questionIndex)} className="mt-2 text-xs font-semibold text-accent-strong hover:text-accent-deep">
                    + Magdagdag ng opsyon
                  </button>
                ) : null}
              </fieldset>
              <Field label="Paliwanag sa tamang sagot" htmlFor={`explanation-${questionIndex}`} className="mt-3">
                <Textarea id={`explanation-${questionIndex}`} className="min-h-16" value={question.explanation} onChange={(event) => setQuestion(questionIndex, "explanation", event.target.value)} disabled={locked} />
              </Field>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap justify-end gap-2 border-t border-plum-100 pt-4">
        <Button variant="secondary" type="button" onClick={onCancel}>Kanselahin</Button>
        <Button type="submit" disabled={pending}>{pending ? "Sine-save…" : initial ? "I-save ang pagbabago" : "Gumawa"}</Button>
      </div>
    </form>
  );
}

function Preview({ activity }) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted">{activity.description}</p>
      <div className="flex flex-wrap gap-2">
        <Chip tone="gold"><Trophy className="size-3.5" aria-hidden="true" /> {activity.xp} XP</Chip>
        <Chip>{activity.passPercent}% upang pumasa</Chip>
        <Chip>{activity.questionCount} tanong</Chip>
        {activity.attempts > 0 ? <Chip tone="info">{activity.attempts} pagtatangka</Chip> : null}
      </div>
      <ol className="space-y-3">
        {activity.questions.map((question, index) => (
          <li key={question.id} className="rounded-xl border border-plum-100 p-3.5">
            <p className="text-sm font-semibold text-ink">{index + 1}. {question.prompt}</p>
            <ul className="mt-2 space-y-1">
              {question.options.map((option, optionIndex) => (
                <li key={optionIndex} className={cx("rounded-md px-2 py-1 text-xs", optionIndex === question.correctIndex ? "bg-success-soft font-semibold text-success-strong" : "text-muted")}>
                  {String.fromCharCode(65 + optionIndex)}. {option}
                </li>
              ))}
            </ul>
            {question.explanation ? <p className="mt-2 text-xs leading-relaxed text-muted">Paliwanag: {question.explanation}</p> : null}
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function AssessmentsPage({ kind }) {
  const isQuiz = kind === "quiz";
  const { data, error, loading, reload } = useApi(`/teacher/activities?kind=${kind}`);
  const lessons = useApi("/teacher/lessons");
  const [modal, setModal] = useState(null);
  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [pending, setPending] = useState(false);
  const [formError, setFormError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteError, setDeleteError] = useState("");
  const [deletePending, setDeletePending] = useState(false);

  const openCreate = () => {
    setDetail(null);
    setFormError("");
    setModal({ mode: "create", data: null });
  };
  const loadDetail = async (activity, mode) => {
    setFormError("");
    setDetailLoading(true);
    setModal({ mode, data: activity });
    try {
      const payload = await api.get(`/teacher/activities/${activity.id}`);
      setDetail(payload.activity);
    } catch (requestError) {
      setFormError(errorMessage(requestError));
      setDetail(null);
    } finally {
      setDetailLoading(false);
    }
  };

  const save = async (values) => {
    if (modal.mode === "edit" && !detail) return;
    setPending(true);
    setFormError("");
    try {
      if (modal.mode === "edit") await api.patch(`/teacher/activities/${detail.id}`, values);
      else await api.post("/teacher/activities", values);
      setModal(null);
      setDetail(null);
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
      await api.delete(`/teacher/activities/${deleteTarget.id}`);
      setDeleteTarget(null);
      reload();
    } catch (requestError) {
      setDeleteError(errorMessage(requestError));
    } finally {
      setDeletePending(false);
    }
  };

  if (loading) return <Loading label={isQuiz ? "Kinukuha ang mga pagsusulit…" : "Kinukuha ang mga aktibidad…"} />;
  if (error) return <Alert tone="danger" title="Hindi mabuksan ang listahan">{errorMessage(error)}</Alert>;

  const items = data?.activities || [];
  const mine = items.filter((item) => item.editable);
  const shared = items.filter((item) => !item.editable);
  const title = isQuiz ? "Mga Pagsusulit" : "Mga Aktibidad";

  return (
    <>
      <Seo title={`Pamamahala ng ${title}`} description={`Gumawa at pamahalaan ang ${title.toLowerCase()} sa HASA.`} noindex path={isQuiz ? "/teacher/mga-pagsusulit" : "/teacher/mga-aktibidad"} />
      <PageHeader
        eyebrow="Pagsusukat"
        title={title}
        description={
          isQuiz
            ? "Gumawa ng pagsusulit na may paliwanag sa bawat sagot. Nakasara ang mga tanong kapag may naisumite nang sagot."
            : "Gumawa ng maikling aktibidad para sanayin ang mga konsepto ng klase."
        }
        actions={<Button onClick={openCreate}><Plus className="size-4" aria-hidden="true" /> Bagong {isQuiz ? "pagsusulit" : "aktibidad"}</Button>}
      />

      <section>
        <h2 className="mb-3 text-base font-bold text-ink">Aking mga gawa ({mine.length})</h2>
        {mine.length === 0 ? (
          <Card className="border-dashed bg-white/60">
            <div className="flex flex-col items-center py-6 text-center">
              {isQuiz ? <FileText className="size-8 text-plum-400" aria-hidden="true" /> : <ClipboardList className="size-8 text-plum-400" aria-hidden="true" />}
              <p className="mt-3 text-sm font-semibold text-ink">Wala ka pang sariling {isQuiz ? "pagsusulit" : "aktibidad"}</p>
              <p className="mt-1 text-xs text-muted">Gumawa ng gawain na may mga tanong at tamang sagot.</p>
              <Button className="mt-4" onClick={openCreate}><Plus className="size-4" aria-hidden="true" /> Gumawa</Button>
            </div>
          </Card>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {mine.map((activity) => (
              <Card key={activity.id} className="flex flex-col">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="flex flex-wrap gap-1.5">
                    <Chip tone={activity.published ? "success" : "neutral"}>{activity.published ? "Nakalathala" : "Hindi pa nakalathala"}</Chip>
                    <Chip>{activity.questionCount} tanong</Chip>
                    {activity.attempts > 0 ? <Chip tone="warning"><Lock className="size-3" aria-hidden="true" /> Nakasara</Chip> : null}
                  </div>
                  <Chip tone="gold">{activity.xp} XP</Chip>
                </div>
                <h3 className="mt-2.5 text-base font-bold text-ink">{activity.title}</h3>
                {activity.lesson ? <p className="text-xs font-medium text-plum-600">{activity.lesson.title}</p> : null}
                <p className="mt-1.5 line-clamp-2 text-sm text-muted">{activity.description}</p>
                <p className="mt-2 text-[11px] text-muted">{activity.attempts} pagtatangka · {activity.passPercent}% upang pumasa · {formatDate(activity.updatedAt)}</p>
                <div className="mt-auto flex flex-wrap gap-2 pt-4">
                  <Button size="sm" variant="secondary" onClick={() => loadDetail(activity, "edit")}>
                    <Pencil className="size-3.5" aria-hidden="true" /> I-edit
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => loadDetail(activity, "preview")}>Tingnan</Button>
                  <Button size="sm" variant="ghost" className="text-danger hover:bg-danger-soft" onClick={() => { setDeleteError(""); setDeleteTarget(activity); }}>
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
          <h2 className="text-base font-bold text-ink">Pangkalahatang gawa ({shared.length})</h2>
        </div>
        {shared.length === 0 ? (
          <p className="rounded-xl border border-dashed border-plum-200 bg-white/60 p-4 text-sm text-muted">Walang pangkalahatang gawa sa uri na ito.</p>
        ) : (
          <ul className="divide-y divide-plum-100 overflow-hidden rounded-2xl border border-plum-100 bg-white">
            {shared.map((activity) => (
              <li key={activity.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-plum-100 text-plum-700">
                  {isQuiz ? <FileText className="size-4" aria-hidden="true" /> : <ClipboardList className="size-4" aria-hidden="true" />}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-ink">{activity.title}</p>
                  <p className="text-xs text-muted">{activity.questionCount} tanong · {activity.xp} XP</p>
                </div>
                <Chip tone="info">Hindi maaaring i-edit</Chip>
                <Button size="sm" variant="ghost" onClick={() => loadDetail(activity, "preview")}>Tingnan</Button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <Modal
        open={Boolean(modal)}
        onClose={() => { setModal(null); setDetail(null); }}
        title={modal?.mode === "create" ? `Bagong ${isQuiz ? "pagsusulit" : "aktibidad"}` : modal?.mode === "edit" ? "I-edit ang gawa" : "Tingnan ang gawa"}
        description={modal?.mode === "preview" ? "Pagtingin lamang sa mga tanong at tamang sagot." : "Ang mga tanong ay may 2–4 na pagpipilian at isang tamang sagot."}
        size="xl"
      >
        {detailLoading ? <Loading label="Kinukuha ang mga tanong…" /> : null}
        {!detailLoading && modal?.mode === "preview" && detail ? <Preview activity={detail} /> : null}
        {!detailLoading && modal?.mode !== "preview" && (modal?.mode === "create" || detail) ? (
          <AssessmentForm
            initial={modal?.mode === "edit" ? detail : null}
            kind={kind}
            lessons={lessons.data?.lessons || []}
            locked={modal?.mode === "edit" && (detail?.attempts || 0) > 0}
            onSubmit={save}
            onCancel={() => { setModal(null); setDetail(null); }}
            pending={pending}
            error={formError}
          />
        ) : null}
        {!detailLoading && modal?.mode === "preview" && !detail && formError ? <Alert tone="danger">{formError}</Alert> : null}
        {!detailLoading && modal?.mode === "edit" && !detail ? <Alert tone="danger">{formError || "Hindi makuha ang detalye."}</Alert> : null}
      </Modal>

      <Modal
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="Burahin ang gawa?"
        description={deleteTarget?.title}
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleteTarget(null)}>Kanselahin</Button>
            <Button variant="danger" onClick={remove} disabled={deletePending}>{deletePending ? "Binubura…" : "Burahin"}</Button>
          </>
        }
      >
        <Alert tone="warning" title="Hindi na ito mababawi">
          Kung may pagtatangka na ang gawaing ito, hindi ito mabubura. Maaari mo na lang itong
          i-unpublish upang mapanatili ang rekord.
        </Alert>
        {deleteError ? <Alert tone="danger" className="mt-3">{deleteError}</Alert> : null}
      </Modal>
    </>
  );
}
