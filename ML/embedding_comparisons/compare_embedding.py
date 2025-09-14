# intent_finder.py
from typing import List, Tuple, Optional
import numpy as np

try:
    from sentence_transformers import SentenceTransformer
except ImportError as e:
    raise SystemExit(
        "Please install sentence-transformers first:\n"
        "  pip install -U sentence-transformers"
    ) from e


class IntentFinder:
    """
    Simple intent-matching helper:
      - Precompute embeddings for a set of intent labels/descriptions
      - Given a user sentence, return (best_intent, score)
    """
    def __init__(self, intents: List[str], model_name: str = "all-MiniLM-L6-v2"):
        if not intents:
            raise ValueError("You must provide at least one intent.")
        self.intents = intents
        self.model = SentenceTransformer(model_name)
        self.intent_embeddings = self._encode(intents)  # shape: (N, D)

    def _encode(self, texts: List[str]) -> np.ndarray:
        emb = self.model.encode(texts, normalize_embeddings=True)
        # ensure ndarray (some versions already return np arrays)
        return np.array(emb, dtype=np.float32)

    def find(self, user_text: str, threshold: float = 0.0) -> Tuple[Optional[str], float]:
        """
        Returns the best matching intent and its cosine similarity score in [0,1].
        If the best score < threshold, returns (None, best_score).

        Args:
            user_text: The user’s question or statement
            threshold: Minimum similarity required to accept a match
        """
        if not user_text or not user_text.strip():
            return None, 0.0

        q = self._encode([user_text])[0]  # (D,)
        # cosine similarity with normalized vectors is just dot product
        sims = self.intent_embeddings @ q  # (N,)
        best_idx = int(np.argmax(sims))
        best_score = float(sims[best_idx])
        best_intent = self.intents[best_idx] if best_score >= threshold else None
        return best_intent, best_score


if __name__ == "__main__":
    # Example usage
    intents = [
        "check order status",
        "cancel my subscription",
        "reset my password",
        "upgrade my plan",
        "talk to a human agent",
        "report a bug"
    ]

    finder = IntentFinder(intents)

    queries = [
        "I can't log in and need to change my password",
        "I want to stop being billed each month",
        "hey, can someone from support speak with me?",
        "how do I see where my package is?",
        "Where can I submit an issue with the app?"
    ]

    for q in queries:
        intent, score = finder.find(q, threshold=0.45)  # tweak threshold as you like
        print(f"Q: {q}\n → Best intent: {intent} (score={score:.3f})\n")

