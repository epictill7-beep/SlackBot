
require("dotenv").config();
const axios = require("axios");

const { App } = require("@slack/bolt");

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true
});

app.command("/legen-ping", async ({ command, ack, respond }) => {
  const start = Date.now();
  await ack();
  const latency = Date.now() - start;
  await respond({ text: `Pong!\nLatency: ${latency}ms` });
});

app.command("/legen-commands", async ({ command, ack, respond }) => {
    await ack();
    await respond({
        text: // # means that the command was not made yet
        `## Legen\'s commands ##
        /legen-ping -> see bot latency
        /legen-commands -> get to this menu
        /legen-randomart -> get random art piece
        /legen-randcolor -> get random color
        /legen-getJoke #
        /legen-catimage -> get random cat image`
    });
});

app.command("/legen-randomart", async ({ command, ack, respond }) => {
    await ack();
    try{
        const response = await axios.post("https://api.artic.edu/api/v1/artworks/search", {
            query:{
                bool:{
                    must:[
                        { term: { "artwork_type_title.keyword": "Painting" } },  // only paintings
                        { exists: { field: "image_id" } }
                    ]
                }
            },
            fields: "id, title, artist_title, image_id", // only the stuff we need
            limit: 25 // 25 to choose from
    });
        const artworks = response.data.data;

        if(!artworks || artworks.length === 0) {
            return await respond("no paintings found");
        }

        const rand = Math.floor(Math.random() * artworks.length);
        const artwork = response.data.data[rand];

        const title = artwork.title || "untitled";
        const artist = artwork.artist_title || "unknown artist";

        const url = response.data.config.iiif_url;

        let imageUrl = "no image available for this piece of art"
        if(artwork.image_id){
            imageUrl = `${url}/${artwork.image_id}/full/843,/0/default.jpg`;
        }
        await respond(`${title}\nArtist: ${artist}\nimg url: ${imageUrl}`);  // paste the art title and artist name based on the data and image url
    }
    catch(error) {
        console.error(error)
        await respond("Could not fetch artwork.");
    }
});

app.command("/legen-randcolor", async ({ command, ack, respond }) => {
    await ack();
    try{
        const response = await axios.get("http://www.colourlovers.com/api/colors/random")
        console.log(typeof response.data);
        console.log(response.data)
        //const id =
        //await respond(`${title}\nid: ${id}\nhex: ${hex}\nhue: ${hue}\nsaturation: ${sat}\nvalue: ${val}`)
    } catch(error){
        console.error(error)
        await respond("Could not fetch random color.")
    }
});

app.command("/legen-catimage", async ({ command, ack, respond }) => {
    await ack();
    await respond("cat comment worked!");
    try{
        const url = "https://cataas.com/cat";
        await respond({ blocks: [{ type: "image", image_url: url}]}); // using block to show the image
    } catch(error) {
        console.error(error)
        await respond("Could not fetch random cat image");
    }
});

(async () => {
  await app.start();
  console.log("bot is running!");
})();
