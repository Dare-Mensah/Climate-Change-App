from flask import Flask, jsonify
import requests
from bs4 import BeautifulSoup
import spacy
from sklearn.feature_extraction.text import TfidfVectorizer
import numpy as np

app = Flask(__name__)

# Load spaCy's English language model
nlp = spacy.load("en_core_web_sm")

# Define the list of specific climate change-related terms for filtering articles
climate_terms = [
    "sustainability", "ecosystem", "biodiversity loss", "deforestation",
    "ocean acidification", "sustainable development", "renewables",
    "biomass", "geoengineering", "climate adaptation", "climate resilience",
    "energy efficiency", "greenhouse effect", "hydrofluorocarbons", "permafrost",
    "solar energy", "wind energy", "tipping point", "urban heat island",
    "vulnerability assessment", "water scarcity", "zero emissions", "afforestation",
    "agroforestry", "bioenergy", "carbon capture", "carbon pricing", "carbon tax",
    "clean energy", "climate action", "climate finance", "climate mitigation",
    "conservation", "ecological footprint", "environmental impact", "green technology",
    "habitat destruction", "industrial pollution", "land use", "natural resources",
    "ozone depletion", "pollution control", "reclamation", "recycling",
    "renewable resources", "soil erosion", "sustainable agriculture",
    "toxic waste", "waste management", "water pollution", "wetland restoration",
    "wildlife conservation", "zero waste", "ecological balance", "energy conservation",
    "environmental degradation", "glacial melting", "heatwave", "invasive species",
    "low-carbon economy", "ocean warming", "overfishing", "plastic pollution",
    "renewable energy certificates", "sea ice melting", "solar radiation management",
    "species extinction", "sustainable fishing", "thermal expansion", "urban sprawl",
    "vegetation cover", "xeriscaping", "yield gap", "zooplankton decline"
]

def preprocess(text):
    doc = nlp(text.lower())
    return " ".join([token.lemma_ for token in doc if token.is_alpha and not token.is_stop])

def fetch_and_scrape_article(url):
    try:
        response = requests.get(url)
        if response.status_code == 200:
            soup = BeautifulSoup(response.text, 'lxml')
            selectors = [
                {'tag': 'article'},
                {'tag': 'div', 'class': 'article-content'},
                {'tag': 'div', 'attrs': {'id': 'main-content'}},
                {'tag': 'p'},
            ]
            
            article_text = ''
            for selector in selectors:
                if 'class' in selector:
                    elements = soup.find_all(selector['tag'], class_=selector['class'])
                elif 'attrs' in selector:
                    elements = soup.find_all(selector['tag'], attrs=selector['attrs'])
                else:
                    elements = soup.find_all(selector['tag'])
                
                if elements:
                    article_text = ' '.join([elem.get_text() for elem in elements])
                    break
            return article_text
    except requests.exceptions.RequestException as e:
        print(f"Request failed: {e}")
    return ""

def fetch_news_articles(api_key):
    # Fetch news articles from the API
    # Primary API
    primary_url = 'https://newsdata.io/api/1/news'
    primary_params = {
        'country': 'gb',
        'category': 'environment',
        'apiKey': api_key
    }
    response = requests.get(primary_url, params=primary_params)
    if response.status_code == 200:
        news_data = response.json()
        if not news_data.get('results', []):
            # Fallback to secondary API if no results
            secondary_url = 'https://newsapi.org/v2/everything'
            secondary_params = {
                'domains': 'wsj.com',
                'apiKey': '48ae913417ee44fda9af20eabdd0c5b1'
            }
            response = requests.get(secondary_url, params=secondary_params)
            if response.status_code == 200:
                news_data = response.json()
            else:
                return []
    else:
        return []
    
    filtered_articles_info = []
    for article in news_data.get('results', []):
        link = article.get('link', '')
        if link:
            article_text = fetch_and_scrape_article(link)
            preprocessed_text = preprocess(article_text)
            if any(term in preprocessed_text for term in climate_terms):
                filtered_articles_info.append({
                    "preprocessed_text": preprocessed_text,
                    "link": link
                })
    return filtered_articles_info

def extract_single_words(tfidf_matrix, vectorizer, top_n=360):
    aggregated_scores = np.sum(tfidf_matrix.toarray(), axis=0)
    sorted_indices = np.argsort(aggregated_scores)[-top_n:]
    feature_names = np.array(vectorizer.get_feature_names_out())
    top_terms = feature_names[sorted_indices][::-1]
    single_words = [term for term in top_terms if ' ' not in term]
    return single_words

@app.route('/climate-news', methods=['GET'])
def climate_news():
    api_key = 'pub_36628886cd9bf05e85630c6f3e42168a0eb32'
    articles_info = fetch_news_articles(api_key)
    if not articles_info:
        return jsonify({"error": "No articles found or could not fetch/scrape articles."}), 404
    
    preprocessed_texts = [article["preprocessed_text"] for article in articles_info]
    tfidf_vectorizer = TfidfVectorizer(ngram_range=(1, 3), min_df=1, max_df=1.0)
    tfidf_matrix = tfidf_vectorizer.fit_transform(preprocessed_texts)
    
    single_word_keywords = extract_single_words(tfidf_matrix, tfidf_vectorizer, top_n=360)
    
    return jsonify({"top_keywords": single_word_keywords, "articles": [{"link": article["link"], "preprocessed_text": article["preprocessed_text"]} for article in articles_info]})

if __name__ == "__main__":
    app.run(host='192.168.1.38', port=3000, debug=True)
