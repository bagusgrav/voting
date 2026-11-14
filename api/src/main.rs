mod crypto;

use api::{app, db};
use tower_http::cors::CorsLayer;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let pool = db::init_db().await?;
    let port = std::env::var("PORT")
        .unwrap_or_else(|_| "3000".to_owned())
        .parse::<u16>()?;
    let listener = tokio::net::TcpListener::bind(("0.0.0.0", port)).await?;
    println!("Bulletin board listening on {}", listener.local_addr()?);
    axum::serve(listener, app(pool).layer(CorsLayer::permissive())).await?;
    Ok(())
}
