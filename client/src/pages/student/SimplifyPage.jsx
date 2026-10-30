import { useState } from "react";
import { AlertCircle, Loader2, Sparkles, WandSparkles } from "lucide-react";
import Seo from "../../components/Seo.jsx";
import { Alert, Button, Card, Chip, Field, PageHeader, Select, Textarea } from "../../components/ui.jsx";
import { api, errorMessage } from "../../lib/api.js";
import { READING_LEVELS } from "../../lib/format.js";
import { useApi } from "../../lib/useApi.js";

export default function SimplifyPage() {
  const config = useApi("/config");
  const [text, setText] = useState("");
  const [level, setLevel] = useState("instructional");
  const [provider, setProvider] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const ai = config.data?.ai;
  const providers = ai?.providers || {};
  const available = Object.entries(providers).filter(([, enabled]) => enabled).map(([name]) => name);

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setResult(null);
    setPending(true);
    try {
      const payload = await api.post("/student/simplify", {
        text,
        level,
        ...(provider ? { provider } : {}),
      });
      setResult(payload);
    } catch (requestError) {
      setError(errorMessage(requestError));
    } finally {
      setPending(false);
    }
  };

  return (
    <>
      <Seo
        title="AI Pantulong sa Pagbasa"
        description="Pasimplehin ang isang tekstong Araling Panlipunan sa antas ng pagbasang akma sa iyo. Gumagana lamang kapag naka-configure ang AI sa server."
        noindex
        path="/student/pasimplehin"
      />
      <PageHeader
        eyebrow="Opsyonal na tulong"
        title="AI Pantulong sa Pagbasa"
        description="I-paste ang isang tekstong mahirap intindihin at pasimplehin ito sa Tagalog. Ang resulta ay mula sa totoong AI provider, hindi imbento ng app."
      />

      {config.loading ? null : ai?.enabled ? (
        <Alert tone="info" className="mb-5" title="Bukas ang AI simplification">
          Gumagana ang {available.map((name) => (name === "gemini" ? "Gemini" : "OpenAI")).join(" at ")}. May araw-araw na limitasyon ang bawat mag-aaral upang mapanatili ang gastos.
        </Alert>
      ) : (
        <Alert tone="warning" className="mb-5" title="Hindi pa naka-configure ang AI">
          Walang API key na nakalagay sa server. Hindi ito mag-iimbento ng sagot. Magagamit ang
          pahinang ito kapag naidagdag na ng administrador ang Gemini o OpenAI key. Samantala,
          gamitin ang tatlong antas ng teksto sa bawat aralin.
        </Alert>
      )}

      <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <form onSubmit={onSubmit} className="space-y-4">
            <Field label="Tekstong ipapasimple" htmlFor="text" hint={`${text.length.toLocaleString("en-PH")} / 8,000 karakter. Hindi bababa sa 30 karakter.`}>
              <Textarea
                id="text"
                className="min-h-56"
                placeholder="I-paste dito ang mahirap na talata mula sa aralin o modyul…"
                value={text}
                onChange={(event) => setText(event.target.value)}
                maxLength={8000}
                required
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Antas ng pagbasa" htmlFor="level">
                <Select id="level" value={level} onChange={(event) => setLevel(event.target.value)}>
                  {READING_LEVELS.map((item) => (
                    <option key={item.value} value={item.value}>{item.label}</option>
                  ))}
                </Select>
              </Field>
              <Field label="AI provider" htmlFor="provider" hint={available.length > 1 ? "Pumili ng provider." : "Awtomatikong pipiliin ang available."}>
                <Select id="provider" value={provider} onChange={(event) => setProvider(event.target.value)} disabled={available.length < 2}>
                  <option value="">Awtomatiko</option>
                  {available.map((name) => (
                    <option key={name} value={name}>{name === "gemini" ? "Gemini" : "OpenAI"}</option>
                  ))}
                </Select>
              </Field>
            </div>
            {error ? <Alert tone="danger" title="Hindi natuloy">{error}</Alert> : null}
            <Button type="submit" className="w-full" disabled={pending || !ai?.enabled || text.trim().length < 30}>
              {pending ? <Loader2 className="size-4.5 animate-spin" aria-hidden="true" /> : <WandSparkles className="size-4.5" aria-hidden="true" />}
              {pending ? "Pinapasimple…" : "Pasimplehin ang teksto"}
            </Button>
          </form>
        </Card>

        <div className="space-y-5">
          {result ? (
            <>
              <Card>
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-plum-100 pb-3">
                  <h2 className="flex items-center gap-2 text-base font-bold text-ink">
                    <Sparkles className="size-4.5 text-accent" aria-hidden="true" /> Pinasimpleng teksto
                  </h2>
                  <div className="flex gap-1.5">
                    <Chip tone="accent">{READING_LEVELS.find((item) => item.value === result.readingLevel)?.label}</Chip>
                    {result.cached ? <Chip>Mula sa cache</Chip> : null}
                  </div>
                </div>
                <div className="reading-text mt-4 text-sm">
                  {String(result.text).split(/\n{2,}/).map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
                <p className="mt-3 text-[11px] text-muted">Provider: {result.provider} · Model: {result.model}</p>
              </Card>
              {result.vocabulary?.length > 0 ? (
                <Card>
                  <h2 className="text-base font-bold text-ink">Mga salitang ipinaliwanag</h2>
                  <dl className="mt-3 space-y-2.5">
                    {result.vocabulary.map((item) => (
                      <div key={item.word} className="rounded-xl border border-plum-100 bg-cream-50 p-3">
                        <dt className="text-sm font-bold text-ink">{item.word}</dt>
                        <dd className="mt-1 text-xs leading-relaxed text-muted">{item.explanation}</dd>
                        {item.exampleSentence ? <dd className="mt-1 text-xs italic text-plum-600">Hal.: {item.exampleSentence}</dd> : null}
                      </div>
                    ))}
                  </dl>
                </Card>
              ) : null}
            </>
          ) : (
            <Card className="border-dashed bg-white/60">
              <div className="flex flex-col items-center py-8 text-center">
                <span className="grid size-12 place-items-center rounded-2xl bg-accent-soft text-accent-strong">
                  <Sparkles className="size-6" aria-hidden="true" />
                </span>
                <h2 className="mt-4 text-base font-bold text-ink">Narito ang iyong resulta</h2>
                <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-muted">
                  Kapag nagsumite ka, lalabas dito ang pinasimpleng teksto at ang mga salitang
                  may paliwanag. Ang orihinal na teksto ay hindi iniimbak.
                </p>
                <p className="mt-4 flex items-center gap-1.5 text-xs text-muted">
                  <AlertCircle className="size-3.5" aria-hidden="true" /> Hindi ito pagsusukat ng kakayahan sa pagbasa.
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
