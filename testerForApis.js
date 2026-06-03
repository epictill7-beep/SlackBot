const axios = require("axios");

(async () => {
    const response = await axios.get("https://api.artic.edu/api/v1/artworks");
    const artwork = response.data.data[0]
    console.log(artwork.image_id);
    const imageUrl = `https://www.artic.edu/iiif/2/${artwork.image_id}/full/843,/0/default.jpg`;
})();