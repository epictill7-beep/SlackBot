
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
        const response = await axios.get("https://api.artic.edu/api/v1/artworks");
        const artwork = response.data.data[0]; // in response.data you go into the data and choose the first artwork in the array of data
        console.log(artwork.image_id);
        const imageUrl = `https://www.artic.edu/iiif/2/${artwork.image_id}/full/843,/0/default.jpg`; // image url
        await respond(`${artwork.title}\nArtist: ${artwork.artist_title}\n img url: ${imageUrl}`);  // paste the art title and artist name based on the data and image url
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
        console.log(response.data);
        const id = response.colors.color.id;
        const title = response.colors.color.title;
        const hex = response.colors.color.hex;
        const hue = response.colors.color.hsv.hue;
        const sat = response.colors.color.hsv.saturation;
        const val = response.colors.color.hsv.value;
        await respond(`${title}\n id: ${id}\n hex: ${hex}\n hue: ${hue}\n saturation: ${sat}\n value: ${val}`)
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
