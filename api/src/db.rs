use sqlx::{
    SqlitePool,
    sqlite::{SqliteConnectOptions, SqlitePoolOptions},
};

pub async fn init_db(database_path: &str) -> Result<SqlitePool, sqlx::Error> {
    let options = SqliteConnectOptions::new()
        .filename(database_path)
        .create_if_missing(true);
    let pool = SqlitePoolOptions::new().connect_with(options).await?;

    initialize_schema(&pool).await?;
    Ok(pool)
}

pub async fn initialize_schema(pool: &SqlitePool) -> Result<(), sqlx::Error> {
    sqlx::query(
        "CREATE TABLE IF NOT EXISTS votes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nullifier TEXT UNIQUE NOT NULL,
            encrypted_ballot TEXT NOT NULL,
            signature TEXT NOT NULL
        )",
    )
    .execute(pool)
    .await?;

    Ok(())
}
