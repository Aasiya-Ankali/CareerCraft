import io
import json
import os
from typing import Any, Dict

import pdfplumber
import pytesseract
from pdf2image import convert_from_bytes
import google.generativeai as genai


def _safe_json_parse(text: str) -> Dict[str, Any]:
    try:
        return json.loads(text)
    except Exception:
        # Attempt to extract JSON between markers
        start = text.find("{")
        end = text.rfind("}")
        if start != -1 and end != -1 and end > start:
            try:
                return json.loads(text[start : end + 1])
            except Exception:
                pass
    return {}


async def extract_text_from_pdf_bytes(file_bytes: bytes) -> str:
    text_chunks: list[str] = []
    # 1) Try text extraction via pdfplumber
    try:
        with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text() or ""
                if page_text.strip():
                    text_chunks.append(page_text)
    except Exception:
        # ignore and fallback to OCR
        pass

    extracted_text = "\n".join(text_chunks).strip()
    if extracted_text:
        return extracted_text

    # 2) Fallback to OCR (pytesseract over images)
    try:
        images = convert_from_bytes(file_bytes)
        ocr_chunks: list[str] = []
        for image in images:
            text = pytesseract.image_to_string(image)
            if text and text.strip():
                ocr_chunks.append(text)
        return "\n".join(ocr_chunks).strip()
    except Exception:
        return ""


async def analyze_with_gemini(resume_text: str, job_desc: str) -> Dict[str, Any]:
    api_key = os.getenv("GOOGLE_API_KEY", "")
    if not api_key:
        # Fallback to deterministic local analysis when key is missing
        return _local_baseline_analysis(resume_text, job_desc)

    genai.configure(api_key=api_key)
    model = genai.GenerativeModel("gemini-1.5-flash")

    system_prompt = (
        "You are a resume analysis assistant. Given a resume and an optional job description, "
        "analyze and return a STRICT JSON object with keys: match_score (0-100), missing_keywords (array of strings), "
        "suggestions (array of strings), analysis (string). Do not include any extra commentary."
    )

    user_payload = {
        "resume": resume_text[:120000],
        "job_description": job_desc[:60000],
    }

    prompt = (
        f"{system_prompt}\n\nInput JSON:\n" + json.dumps(user_payload, ensure_ascii=False)
        + "\n\nRespond with only the JSON object."
    )

    response = await model.generate_content_async(prompt)
    text = (response.text or "").strip()

    data = _safe_json_parse(text)
    if not data:
        # minimal safe structure
        data = _local_baseline_analysis(resume_text, job_desc)

    # Normalize fields
    return {
        "match_score": int(data.get("match_score", 0)),
        "missing_keywords": list(data.get("missing_keywords", [])),
        "suggestions": list(data.get("suggestions", [])),
        "analysis": str(data.get("analysis", "")),
    }


def _local_baseline_analysis(resume_text: str, job_desc: str) -> Dict[str, Any]:
    # Very naive baseline when API is not set; keeps the app functional
    def tokenize(s: str) -> list[str]:
        import re

        return [
            t
            for t in re.sub(r"[^a-z0-9\s+#.]", " ", s.lower()).split()
            if t
        ]

    def unique(tokens: list[str]) -> list[str]:
        seen: set[str] = set()
        out: list[str] = []
        for t in tokens:
            if t not in seen:
                seen.add(t)
                out.append(t)
        return out

    job_tokens = unique(tokenize(job_desc))
    resume_tokens = set(unique(tokenize(resume_text)))
    missing = [t for t in job_tokens if t not in resume_tokens]
    overlap = [t for t in job_tokens if t in resume_tokens]
    score = 0 if not job_tokens else round(len(overlap) * 100 / len(job_tokens))

    suggestions = [
        f"Consider adding concrete examples for '{kw}' if applicable."
        for kw in missing[:10]
    ]

    return {
        "match_score": int(score),
        "missing_keywords": missing[:20],
        "suggestions": suggestions,
        "analysis": f"Approximate match based on keyword overlap: {score}%.",
    }


