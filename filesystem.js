const fs = require("fs-extra");
const express = require('express');
const cors = require("cors");
const app = express();

const port = 3750;
const subPathNginx = "/music-scripts";

console.log("-->Starting");

async function updateFilesystemJson() {
    let packageText = await fs.readFile("./package.json", { encoding: "utf-8" });
    let packageJson = JSON.parse(packageText);
    let filesystem = packageJson.filesystem;

    let paths = await fs.readdir(__dirname + filesystem, { recursive: true });
    let files = [];
    for (let path of paths) {
        let propierties = await fs.stat(__dirname + filesystem + path);
        if (propierties.isFile()) {

            let newPath = path;
            newPath = String(newPath).replace(/\\/g, '/');
            newPath = String(newPath).replace("#", 's');

            while (String(newPath).includes(" ")) {
                newPath = String(newPath).replace(" ", '');
            }

            fs.rename(__dirname + filesystem + path, __dirname + filesystem + newPath);
            files.push(filesystem + newPath);
        }
    }
    await fs.writeFile(__dirname + "/filesystem.json", JSON.stringify(files), { encoding: "utf-8" });
    console.log("-->Filesystem.json updated");
}

async function start() {

    app.use(cors());
    app.use(express.json({ limit: "100mb" }));
    app.use(subPathNginx, express.static(__dirname));
    await updateFilesystemJson();

    app.post(subPathNginx + "/save-file", async (request, response) => {
        try {
            console.log(request.body);
            let base64Content = request.body.content.split(",")[1];
            await fs.writeFile(`${__dirname}/filesystem/${request.body.name}`, base64Content, { encoding: "base64" });
            await updateFilesystemJson();
            response.send({ return: true, data: request.body })
        } catch (error) {
            response.send({ return: false, error: error })
        }
    });

    app.listen(port, () => {
        console.log(`-->Filesystem server is running on http://localhost:${port}`);
    });

}
start();