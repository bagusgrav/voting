import sys
from collections import Counter

import requests


RESULTS_URL = "http://localhost:3000/results"


def fetch_votes():
    response = requests.get(RESULTS_URL, timeout=10)
    response.raise_for_status()
    votes = response.json()

    if not isinstance(votes, list):
        raise ValueError("Expected /results to return a JSON array")

    for index, vote in enumerate(votes):
        if not isinstance(vote, dict):
            raise ValueError(f"Vote at index {index} is not a JSON object")
        if not isinstance(vote.get("nullifier"), str):
            raise ValueError(f"Vote at index {index} has no valid nullifier")
        if not isinstance(vote.get("encrypted_ballot"), str):
            raise ValueError(f"Vote at index {index} has no valid encrypted_ballot")

    return votes


def main():
    try:
        votes = fetch_votes()
    except (requests.RequestException, ValueError) as error:
        print(f"Audit failed: {error}", file=sys.stderr)
        return 1

    nullifier_counts = Counter(vote["nullifier"] for vote in votes)
    duplicate_count = sum(count > 1 for count in nullifier_counts.values())
    vote_count = sum("encrypted_ballot" in vote for vote in votes)
    status = "AUDIT PASSED" if duplicate_count == 0 else "AUDIT FAILED"

    print(
        f"Total votes: {vote_count}, "
        f"Duplicate nullifiers found: {duplicate_count}, "
        f"Status: {status}"
    )
    return 0 if duplicate_count == 0 else 1


if __name__ == "__main__":
    sys.exit(main())
