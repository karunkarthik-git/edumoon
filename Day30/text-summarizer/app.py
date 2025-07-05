import streamlit as st
import requests
from newspaper import Article

API_TOKEN = "replace_your_token"
API_URL = "https://api-inference.huggingface.co/models/facebook/bart-large-cnn"
headers = {"Authorization": f"Bearer {API_TOKEN}"}


def summarize(text):
    response = requests.post(API_URL, headers=headers, json={"inputs": text})
    return response.json()

st.title("Text Summarizer")
url = st.text_input("Enter a news article URL")

if url:
    try:
        article = Article(url)
        article.download()
        article.parse()
        st.title("Title")
        st.write(article.title)
        st.subheader("Extracted Text")
        st.write(article.text[:1000])
        if st.button("Summarize"):
            with st.spinner("Processing..."):
                summary = summarize(article.text[:1000])
                if isinstance(summary, list) and 'summary_text' in summary[0]:
                    st.subheader("Summary")
                    st.write(summary[0]['summary_text'])
                else:
                    st.error("Error: Unable to summarize the article. Please try again later.")
    except Exception as e:
        st.error(f"Error processing article: {e}")