pub mod db;

use axum::{
    Json, Router,
    extract::State,
    http::StatusCode,
    response::IntoResponse,
    routing::{get, post},
};
use serde::{Deserialize, Serialize};
use sqlx::SqlitePool;

#[derive(Debug, Deserialize)]
struct SubmitVote {
    nullifier: String,
    encrypted_ballot: String,
    signature: String,
}

#[derive(Debug, Serialize, sqlx::FromRow)]
struct Vote {
    id: i64,
    nullifier: String,
    encrypted_ballot: String,
    signature: String,
}

#[derive(Serialize)]
struct ApiMessage {
    status: &'static str,
}

#[derive(Serialize)]
struct ApiError {
    error: &'static str,
}

pub fn app(pool: SqlitePool) -> Router {
    Router::new()
        .route("/submit_vote", post(submit_vote))
        .route("/results", get(results))
        .with_state(pool)
}

async fn submit_vote(
    State(pool): State<SqlitePool>,
    Json(vote): Json<SubmitVote>,
) -> impl IntoResponse {
    let result =
        sqlx::query("INSERT INTO votes (nullifier, encrypted_ballot, signature) VALUES (?, ?, ?)")
            .bind(vote.nullifier)
            .bind(vote.encrypted_ballot)
            .bind(vote.signature)
            .execute(&pool)
            .await;

    match result {
        Ok(_) => (
            StatusCode::OK,
            Json(ApiMessage {
                status: "Vote recorded",
            }),
        )
            .into_response(),
        Err(error)
            if error
                .as_database_error()
                .is_some_and(|db| db.is_unique_violation()) =>
        {
            (
                StatusCode::BAD_REQUEST,
                Json(ApiError {
                    error: "Double voting detected",
                }),
            )
                .into_response()
        }
        Err(error) => {
            eprintln!("Failed to record vote: {error}");
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(ApiError {
                    error: "Failed to record vote",
                }),
            )
                .into_response()
        }
    }
}

async fn results(
    State(pool): State<SqlitePool>,
) -> Result<Json<Vec<Vote>>, (StatusCode, Json<ApiError>)> {
    let votes = sqlx::query_as::<_, Vote>(
        "SELECT id, nullifier, encrypted_ballot, signature FROM votes ORDER BY id",
    )
    .fetch_all(&pool)
    .await
    .map_err(|error| {
        eprintln!("Failed to retrieve votes: {error}");
        (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(ApiError {
                error: "Failed to retrieve votes",
            }),
        )
    })?;

    Ok(Json(votes))
}
