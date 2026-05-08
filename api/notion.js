export default async function handler(req, res) {

  const NOTION_TOKEN = process.env.NOTION_TOKEN;
  const DATABASE_ID = process.env.DATABASE_ID;

  const response = await fetch(
    `https://api.notion.com/v1/databases/${DATABASE_ID}/query`,
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${NOTION_TOKEN}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        filter: {
          property: "Status",
          select: {
            equals: "Published"
          }
        }
      })
    }
  );

  const data = await response.json();

  const albums = data.results.map(p => ({
    title: p.properties.Title.title[0]?.plain_text || "",
    artist: p.properties.Artist.rich_text[0]?.plain_text || "",
    img: p.properties.Image.url || "",
    tags: p.properties.Tags.multi_select.map(t => t.name),
    mood: p.properties.Mood.rich_text[0]?.plain_text || "",
    spotify: p.properties.Spotify.url || "",
    amazon: p.properties.Amazon.url || ""
  }));

  res.status(200).json(albums);
}
