import { config, configuredAiProviders } from "../config.js";
import { getDatabase } from "../db/database.js";
import { AppError } from "../utils/errors.js";
import { sha256 } from "../utils/security.js";
import { manilaDateKey, nowIso } from "../utils/time.js";

const LEVEL_GUIDE = {
  independent: "Maikling pangungusap, karaniwang salita, at kaunting gabay.",
  instructional:
    "Katamtamang haba ng pangungusap, may maikling paliwanag sa mahirap na salita.",
  frustration:
    "Napakaikling pangungusap, konkretong halimbawa, at hakbang-hakbang na paliwanag.",
};

function buildPrompt(text, level) {
  return `Ikaw ay isang guro ng Araling Panlipunan sa Baitang 8 sa Pilipinas.

Gawain: Pasimplehin ang teksto sa ibaba sa wikang Tagalog para sa antas na "${level}".
${LEVEL_GUIDE[level]}

Mahigpit na tuntunin:
1. Huwag mag-imbento ng impormasyon. Kung may malabo sa teksto, sabihin ito nang malinaw.
2. Panatilihin ang kahulugan at mahalagang konseptong pang-akademiko. Isulat sa panaklong ang orihinal na termino kapag makatutulong.
3. Huwag magbigay ng diagnosis ng kakayahan sa pagbasa.
4. Pumili ng 3 hanggang 6 mahirap na salita mula sa teksto at ipaliwanag sa Tagalog.
5. Sumagot lamang gamit ang JSON na may ganitong hugis:
{"text":"pinasimpleng teksto","vocabulary":[{"word":"salita","explanation":"paliwanag","exampleSentence":"halimbawang pangungusap"}]}

Teksto:
"""
${text}
"""`;
}

function extractJson(raw) {
  const cleaned = String(raw)
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "");
  return JSON.parse(cleaned);
}

async function callGemini({ prompt, model, signal }) {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(config.ai.geminiKey)}`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: config.ai.maxOutputTokens,
        responseMimeType: "application/json",
      },
    }),
    signal,
  });

  if (!response.ok) {
    const detail = await response.text();
    console.error("[HASA AI] Gemini error", response.status, detail.slice(0, 400));
    if (response.status === 429) {
      throw new AppError(429, "AI_QUOTA_EXCEEDED", "Naabot na ang limitasyon ng AI provider. Subukan muli mamaya.");
    }
    throw new AppError(502, "AI_PROVIDER_ERROR", "Pansamantalang hindi available ang Gemini. Subukan muli mamaya.");
  }

  const data = await response.json();
  const raw = data?.candidates?.[0]?.content?.parts?.map((part) => part.text).join("") ?? "";
  return { raw, model: data?.modelVersion || model };
}

async function callOpenai({ prompt, model, signal }) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.ai.openaiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.3,
      max_tokens: config.ai.maxOutputTokens,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "Sumagot ka lamang sa wikang Tagalog at sa wastong JSON. Huwag mag-imbento ng datos.",
        },
        { role: "user", content: prompt },
      ],
    }),
    signal,
  });

  if (!response.ok) {
    const detail = await response.text();
    console.error("[HASA AI] OpenAI error", response.status, detail.slice(0, 400));
    if (response.status === 429) {
      throw new AppError(429, "AI_QUOTA_EXCEEDED", "Naabot na ang limitasyon ng AI provider. Subukan muli mamaya.");
    }
    throw new AppError(502, "AI_PROVIDER_ERROR", "Pansamantalang hindi available ang OpenAI. Subukan muli mamaya.");
  }

  const data = await response.json();
  const raw = data?.choices?.[0]?.message?.content ?? "";
  return { raw, model: data?.model || model };
}

function recordUsage(db, { studentId, provider, inputChars, outputChars, succeeded, errorCode }) {
  db.prepare(
    `INSERT INTO ai_usage
     (student_id, provider, operation, input_chars, output_chars, succeeded, error_code, created_at)
     VALUES (?, ?, 'simplify', ?, ?, ?, ?, ?)`,
  ).run(
    studentId,
    provider,
    inputChars,
    outputChars,
    succeeded ? 1 : 0,
    errorCode ?? null,
    nowIso(),
  );
}

export function aiFeatureStatus() {
  const providers = configuredAiProviders();
  return {
    enabled: providers.gemini || providers.openai,
    providers,
    defaultProvider: providers[config.ai.defaultProvider]
      ? config.ai.defaultProvider
      : providers.gemini
        ? "gemini"
        : providers.openai
          ? "openai"
          : null,
  };
}

export async function simplifyForStudent({ studentId, text, level, provider }) {
  const providers = configuredAiProviders();
  const selected = provider || config.ai.defaultProvider;
  if (!providers.gemini && !providers.openai) {
    throw new AppError(
      503,
      "AI_NOT_CONFIGURED",
      "Hindi pa naka-configure ang AI simplification ng paaralan. Magagamit ito kapag naidagdag na ang API key sa server.",
    );
  }
  if (!["gemini", "openai"].includes(selected)) {
    throw new AppError(400, "VALIDATION_ERROR", "Pumili ng Gemini o OpenAI.");
  }
  if (!providers[selected]) {
    throw new AppError(
      503,
      "AI_NOT_CONFIGURED",
      `Hindi naka-configure ang ${selected === "gemini" ? "Gemini" : "OpenAI"}. Pumili ng ibang provider.`,
    );
  }

  const clean = String(text || "").trim();
  if (clean.length < 30) {
    throw new AppError(400, "VALIDATION_ERROR", "Masyadong maikli ang teksto. Maglagay ng hindi bababa sa 30 karakter.");
  }
  if (clean.length > config.ai.maxInputChars) {
    throw new AppError(
      400,
      "VALIDATION_ERROR",
      `Masyadong mahaba ang teksto. Hanggang ${config.ai.maxInputChars.toLocaleString("en-PH")} karakter lamang.`,
    );
  }

  const db = getDatabase();
  const today = manilaDateKey();
  const startOfDay = new Date(`${today}T00:00:00+08:00`).toISOString();
  const used = Number(
    db
      .prepare(
        "SELECT COUNT(*) AS count FROM ai_usage WHERE student_id = ? AND created_at >= ? AND succeeded = 1",
      )
      .get(studentId, startOfDay).count,
  );
  if (used >= config.ai.dailyQuota) {
    throw new AppError(
      429,
      "AI_DAILY_LIMIT",
      "Naabot mo na ang limitasyon sa AI ngayong araw. Subukan muli bukas.",
    );
  }

  const model = selected === "gemini" ? config.ai.geminiModel : config.ai.openaiModel;
  const cacheKey = sha256(`${selected}|${model}|${level}|${clean}`);
  const cached = db
    .prepare("SELECT result_json FROM simplifications WHERE cache_key = ?")
    .get(cacheKey);
  if (cached) {
    return { ...JSON.parse(cached.result_json), cached: true };
  }

  const prompt = buildPrompt(clean, level);
  const signal = AbortSignal.timeout(config.ai.timeoutMs);
  let raw = "";
  let reportedModel = model;

  try {
    const result =
      selected === "gemini"
        ? await callGemini({ prompt, model, signal })
        : await callOpenai({ prompt, model, signal });
    raw = result.raw;
    reportedModel = result.model || model;
  } catch (error) {
    recordUsage(db, {
      studentId,
      provider: selected,
      inputChars: clean.length,
      outputChars: 0,
      succeeded: false,
      errorCode: error.code || "AI_PROVIDER_ERROR",
    });
    if (error.name === "TimeoutError" || error.name === "AbortError") {
      throw new AppError(502, "AI_PROVIDER_TIMEOUT", "Masyadong matagal ang tugon ng AI provider. Subukan muli.");
    }
    if (error instanceof AppError) throw error;
    throw new AppError(502, "AI_PROVIDER_ERROR", "May problema sa AI provider. Subukan muli mamaya.");
  }

  let parsed;
  try {
    parsed = extractJson(raw);
  } catch {
    recordUsage(db, {
      studentId,
      provider: selected,
      inputChars: clean.length,
      outputChars: raw.length,
      succeeded: false,
      errorCode: "AI_BAD_OUTPUT",
    });
    throw new AppError(502, "AI_BAD_OUTPUT", "Hindi wasto ang tugon ng AI. Subukan muli.");
  }

  if (
    !parsed ||
    typeof parsed.text !== "string" ||
    parsed.text.trim().length < 20 ||
    !Array.isArray(parsed.vocabulary)
  ) {
    recordUsage(db, {
      studentId,
      provider: selected,
      inputChars: clean.length,
      outputChars: raw.length,
      succeeded: false,
      errorCode: "AI_BAD_OUTPUT",
    });
    throw new AppError(502, "AI_BAD_OUTPUT", "Hindi wasto ang tugon ng AI. Subukan muli.");
  }

  const vocabulary = parsed.vocabulary
    .filter((item) => item && typeof item.word === "string" && typeof item.explanation === "string")
    .slice(0, 8)
    .map((item) => ({
      word: item.word.trim().slice(0, 120),
      explanation: item.explanation.trim().slice(0, 500),
      exampleSentence:
        typeof item.exampleSentence === "string"
          ? item.exampleSentence.trim().slice(0, 300)
          : "",
    }));

  const result = {
    text: parsed.text.trim().slice(0, 20000),
    vocabulary,
    provider: selected,
    model: reportedModel,
    readingLevel: level,
    cached: false,
  };

  db.prepare(
    `INSERT OR REPLACE INTO simplifications
     (cache_key, reading_level, provider, model, result_json, created_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
  ).run(cacheKey, level, selected, reportedModel, JSON.stringify(result), nowIso());

  recordUsage(db, {
    studentId,
    provider: selected,
    inputChars: clean.length,
    outputChars: result.text.length,
    succeeded: true,
  });

  return result;
}
