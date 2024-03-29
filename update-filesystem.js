const fs = require("fs-extra");
console.log("-->Starting");

async function start() {

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
    console.log("-->File writed");

}
start();