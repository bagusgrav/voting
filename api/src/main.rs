mod crypto;

use api::{app, db};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let pool = db::init_db("bulletin_board.db").await?;
    let listener = tokio::net::TcpListener::bind("127.0.0.1:3000").await?;
    println!("Bulletin board listening on {}", listener.local_addr()?);
    axum::serve(listener, app(pool)).await?;
    Ok(())
}
