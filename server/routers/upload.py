from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from sqlalchemy.orm import Session
from database import get_db
import models
from utils.csv_parser import validate_csv_headers, parse_csv, compute_analytics

router = APIRouter(prefix="/api/upload", tags=["upload"])


@router.post("")
async def upload_csv(file: UploadFile = File(...), db: Session = Depends(get_db)):
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only CSV files are accepted.")

    content_bytes = await file.read()
    content_str = content_bytes.decode('utf-8', errors='ignore')

    validation = validate_csv_headers(content_str)
    if not validation['valid']:
        raise HTTPException(
            status_code=400,
            detail=f"Missing required columns: {', '.join(validation['missing'])}"
        )

    rows = parse_csv(content_str)
    if not rows:
        raise HTTPException(status_code=400, detail="No valid data rows found in CSV file.")

    analytics = compute_analytics(rows)

    # Persist dataset in Supabase database
    dataset_id = None
    try:
        dataset_record = models.Dataset(
            filename=file.filename,
            analytics_data=analytics
        )
        db.add(dataset_record)
        db.commit()
        db.refresh(dataset_record)
        dataset_id = dataset_record.id
    except Exception as e:
        print(f"DB Notice: Could not save dataset record: {e}")

    return {
        "success": True,
        "message": "Dataset processed successfully via FastAPI backend",
        "datasetId": dataset_id,
        "filename": file.filename,
        "rowCount": len(rows),
        "data": analytics
    }
