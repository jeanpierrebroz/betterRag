import os
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import List
import uvicorn
from langchain.document_loaders import PyPDFLoader, TextLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import FAISS
from langchain.chains import RetrievalQA
from langchain.llms import OpenAI

app = FastAPI()

# Serve static files
app.mount("/static", StaticFiles(directory="static"), name="static")

# Global variables
documents = []
vector_store = None
qa_chain = None

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
    global vector_store, qa_chain
    try:
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
        texts = []
        for doc in documents:
            if doc.endswith('.pdf'):
                loader = PyPDFLoader(doc)
            else:
                loader = TextLoader(doc)
            texts.extend(loader.load_and_split(text_splitter))

        embeddings = OpenAIEmbeddings()
        vector_store = FAISS.from_documents(texts, embeddings)
        
        llm = OpenAI()
        qa_chain = RetrievalQA.from_chain_type(llm=llm, chain_type="stuff", retriever=vector_store.as_retriever())
        
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

