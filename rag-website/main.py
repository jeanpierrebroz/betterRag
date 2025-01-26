import os
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import List
import uvicorn
from dotenv import dotenv_values




app = FastAPI()

# Serve static files
app.mount("/static", StaticFiles(directory="static"), name="static")

# Global variables
documents = []
vector_store = None
qa_chain = None

config = dotenv_values()


class Query(BaseModel):
    question: str

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        filename = f"uploads/{file.filename}"
        os.makedirs("uploads", exist_ok=True)
        with open(filename, "wb") as f:
            f.write(contents)
        documents.append(filename)
        return {"message": "File uploaded successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/index")
async def index_documents():
    try:

        return {"message": "Documents indexed successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/query")
async def query_documents(query: Query):
    if not qa_chain:
        raise HTTPException(status_code=400, detail="Documents have not been indexed yet")
    try:
        response = qa_chain.run(query.question)
        return {"answer": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
async def read_index():
    return FileResponse("static/index.html")

@app.get("/query")
async def read_query():
    return FileResponse("static/query.html")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

