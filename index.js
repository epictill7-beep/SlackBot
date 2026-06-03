
require("dotenv").config();

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
        /legen-randomArt -> get random art piece
        /legen-getTimeZones #
        /legen-getJoke #
        /legen-factCheck <query> #
        /legen-catImage #`
    });
});

/*app.command("/legen-getTimeZones", async ({ command, ack, respond }) => {
    await ack();
    try{
        const response = await axios.get("")
    }

    })
});*/

app.command("/legen-randomArt", async ({ command, ack, respond }) => {
    await ack();
    const axios = require("axios");
    try{
        const response = await axios.get(
            "https://api.artic.edu/api/v1/artworks"
        );
        const artwork = response.data.data[0]; // in response.data you go into the data and choose the first artwork in the array of data
        console.log(artwork.image_id);
        const imageUrl = `https://www.artic.edu/iiif/2/${artwork.image_id}/full/843,/0/default.jpg`; // image url
        await respond(
            `${artwork.title}\nArtist: ${artword.artist_title}\n img url: ${imageUrl}`);  // paste the art title and artist name based on the data and image url
    }
    catch(error) {
        await respond("Could not fetch artwork.");
    }
});

(async () => {
  await app.start();
  console.log("bot is running!");
})();
