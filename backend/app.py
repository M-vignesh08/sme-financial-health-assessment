from fastapi import FastAPI, UploadFile, File, HTTPException
import shutil
import os

from utils.file_parser import parse_financial_file
from models.schemas import UploadResponse

app = FastAPI(title="SME Financial Health Assessment API")
