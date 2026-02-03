from fastapi import FastAPI, UploadFile, File, HTTPException
import shutil
import os

from backend.utils.file_parser import parse_financial_file
from backend.models.schemas import UploadResponse


app = FastAPI(title="SME Financial Health Assessment API")

