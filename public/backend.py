from flask import Flask, request, jsonify # type: ignore
from sklearn.feature_extraction.text import TfidfVectorizer # type: ignore
from sklearn.metrics.pairwise import cosine_similarity # type: ignore
import pandas as pd # type: ignore

app = Flask(__name__)

# Example data
articles = [
    {"id": 1, "title": "Managing Anxiety", "content": "Tips and strategies to manage anxiety..."},
    {"id": 2, "title": "Overcoming Depression", "content": "Steps to overcome depression..."},
    {"id": 3, "title": "Mindfulness Meditation", "content": "How mindfulness meditation helps..."},
]

user_data = {
    "user1": {"interests": ["anxiety", "meditation"]},
    "user2": {"interests": ["depression"]}
}

def get_recommendations(user_id):
    user_interests = user_data[user_id]["interests"]
    user_interests_str = " ".join(user_interests)

    df = pd.DataFrame(articles)
    df['combined'] = df['title'] + " " + df['content']

    tfidf = TfidfVectorizer(stop_words='english')
    tfidf_matrix = tfidf.fit_transform(df['combined'])

    user_vec = tfidf.transform([user_interests_str])
    cosine_sim = cosine_similarity(user_vec, tfidf_matrix).flatten()

    indices = cosine_sim.argsort()[-3:][::-1]
    recommended_articles = df.iloc[indices].to_dict('records')
    return recommended_articles

@app.route('/recommend', methods=['POST'])
def recommend():
    user_id = request.json.get("user_id")
    if user_id not in user_data:
        return jsonify({"error": "User not found"}), 404
    recommendations = get_recommendations(user_id)
    return jsonify(recommendations)

if __name__ == '__main__':
    app.run(debug=True)
