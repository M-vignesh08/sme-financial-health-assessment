from pydantic import BaseModel
from typing import List, Dict, Any

class UploadResponse(BaseModel):
    status: str
    rows: int
    columns: List[str]
    preview: List[Dict[str, Any]]
