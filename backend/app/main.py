import os
from fastapi import FastAPI, File, Form, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from dotenv import load_dotenv

from analyzer import extract_text_from_pdf_bytes, analyze_with_gemini


load_dotenv()

app = FastAPI(title="Resume Analyzer Backend")

frontend_origin = os.getenv("FRONTEND_URL", "http://localhost:3000")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_origin],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/analyze")
async def analyze_resume(
    resumeFile: UploadFile | None = File(default=None),
    resumeText: str | None = Form(default=None),
    jobDesc: str | None = Form(default=None),
):
    try:
        if not resumeFile and not resumeText:
            raise HTTPException(status_code=400, detail="Provide resumeFile or resumeText")

        extracted_text: str = ""
        if resumeFile is not None:
            file_bytes = await resumeFile.read()
            extracted_text = await extract_text_from_pdf_bytes(file_bytes)

        resume_text_final = (resumeText or "").strip()
        if extracted_text:
            resume_text_final = extracted_text

        if not resume_text_final:
            raise HTTPException(status_code=400, detail="Could not extract resume text")

        job_desc_final = (jobDesc or "").strip()

        result = await analyze_with_gemini(resume_text_final, job_desc_final)
        return JSONResponse(content=result)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/health")
async def health():
    return {"status": "ok"}


