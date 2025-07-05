from dotenv import load_dotenv
import os
import streamlit as st
from pypdf import PdfReader
from huggingface_hub import InferenceClient

load_dotenv()
API_TOKEN = os.getenv("API_TOKEN")

st.set_page_config(page_title="Chat with PDF", layout="wide")
st.title("Chat with PDF")
st.write("Upload a PDF file to start chatting with it.")

if 'history' not in st.session_state:
    st.session_state["history"] = []

file = st.file_uploader("Choose a PDF file", type="pdf")
pdf_text = ""

if file:
    try:
        reader = PdfReader(file)
        for page in reader.pages:
            pdf_text += page.extract_text() or ""
        st.success("PDF file loaded successfully!")
    except Exception as e:
        st.error(f"Error reading PDF file: {e}")

if pdf_text:
    user_query = st.text_input("Ask a question about the PDF content:")
    if user_query:
        with st.spinner("Thinking..."):
            try:
                client = InferenceClient(token=API_TOKEN)
                model = "meta-llama/Meta-Llama-3-8B-Instruct"
                max_context = 3000
                context = pdf_text[:max_context]
                messages = [
                    {"role": "system", "content": "You are a helpful assistant that can answer questions based on the provided PDF content."},
                    {"role": "user", "content": f"Context: {context}\n\nQuestion: {user_query}"}
                ]
                response = client.chat.completions.create(
                    model=model,
                    messages=messages,
                    max_tokens=256, # response length
                    temperature=0.2 # creativity level, randomness in the response [0.1-0.3 - deterministic same response, 0.7 - balanced, 0.9-1.0 - creative - variaed responses]
                )
                results = response.choices[0].message.content
                st.session_state["history"].append({"question": user_query, "answer": results})
                st.markdown(f"**Answer:** {results}")
            except Exception as e:
                st.error(f"Error: Unable to process your query. Please try again later. {e}")

    if st.session_state["history"]:
        st.markdown("---")
        st.subheader("Chat History")
        for i, chat in enumerate(reversed(st.session_state["history"])):
            with st.expander(f"Q{i+1} {chat['question']}", expanded=False):
                st.markdown(f"**A{i+1}:** {chat['answer']}")
else:
    st.warning("Please upload a PDF file to start chatting.")