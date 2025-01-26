from openai import OpenAI
from pinecone import Pinecone


def get_text_from_page():
    '''
    Uses GPT-4 vision to extract content from pages. Particularly useful for tabular data. 

    Returns: text, a string containing the response from gpt that hopefully has the correct context.
    '''
    pass

def push_docs(documents : list[dict]):
    '''
    Pushes each extracted document (and its embeddings) to pinecone.

    Takes in the list of documents to push and pushes each out.
    '''
    pass