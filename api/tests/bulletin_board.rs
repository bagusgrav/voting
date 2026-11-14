use api::{app, db::initialize_schema};
use axum::{
    body::{Body, to_bytes},
    http::{Request, StatusCode},
};
use serde_json::{Value, json};
use sqlx::sqlite::SqlitePoolOptions;
use tower::ServiceExt;

#[tokio::test]
async fn rejects_a_nullifier_that_has_already_voted() {
    let pool = SqlitePoolOptions::new()
        .max_connections(1)
        .connect("sqlite::memory:")
        .await
        .expect("in-memory database should connect");
    initialize_schema(&pool)
        .await
        .expect("votes table should be created");
    let app = app(pool);
    let payload = json!({
        "nullifier": "nullifier-1",
        "encrypted_ballot": "encrypted",
        "signature": "signature"
    });

    let first = submit(&app, payload.clone()).await;
    assert_eq!(first.0, StatusCode::OK);
    assert_eq!(first.1, json!({"status": "Vote recorded"}));

    let second = submit(&app, payload).await;
    assert_eq!(second.0, StatusCode::BAD_REQUEST);
    assert_eq!(second.1, json!({"error": "Double voting detected"}));
}

async fn submit(app: &axum::Router, payload: Value) -> (StatusCode, Value) {
    let response = app
        .clone()
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/submit_vote")
                .header("content-type", "application/json")
                .body(Body::from(payload.to_string()))
                .expect("request should be valid"),
        )
        .await
        .expect("router should handle the request");
    let status = response.status();
    let body = to_bytes(response.into_body(), usize::MAX)
        .await
        .expect("response body should be readable");
    (
        status,
        serde_json::from_slice(&body).expect("response should be JSON"),
    )
}
