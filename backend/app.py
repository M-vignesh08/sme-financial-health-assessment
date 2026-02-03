from fastapi import FastAPI, UploadFile, File, HTTPException
import shutil
import os

from backend.utils.file_parser import parse_financial_file
from backend.models.schemas import UploadResponse

app = FastAPI(title="SME Financial Health Assessment API")

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.post("/upload-financials", response_model=UploadResponse)
async def upload_financials(file: UploadFile = File(...)):
    try:
        file_path = os.path.join(UPLOAD_DIR, file.filename)

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        parsed = parse_financial_file(file_path)

        return {
            "status": "success",
            **parsed
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
