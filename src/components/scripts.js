import "./scripts.css";
import React, { useState, useEffect } from "react";
import { ScriptCard } from "./script-card";
import { BsFillPlayFill, BsFillStopFill } from "react-icons/bs";

export const Scripts = ({ navbarSearchValue, onChangeCounter }) => {

    let urlFilesytem = (process.env.NODE_ENV === "production" ? process.env.REACT_APP_FILESYSTEM_HOST_PRODUCTION : process.env.REACT_APP_FILESYSTEM_HOST_DEVELOPMENT);
    let allowExtensionsScript = ["ms", "mse"];
    let allowExtensionsAudio = ["wav", "mp3"];

    const [files, setFiles] = useState([]);

    useEffect(() => {
        const start = async () => {
            let response = await fetch(urlFilesytem + "/filesystem.json", {
                mode: "cors",
                headers: {
                    'Content-Type': 'application/json'
                },
            });
            const responseParse = await response.json();
            let paths = responseParse;
            let filteredPaths = [];
            for (let path of paths) {
                let pathSplittedBySlashByPoint = path.split(".");
                let allowExtensions = [...allowExtensionsAudio, ...allowExtensionsScript];
                let pathSplittedBySlash = path.split("/");
                let fileName = String(pathSplittedBySlash[pathSplittedBySlash.length - 2] + "/" + pathSplittedBySlash[pathSplittedBySlash.length - 1]).toLowerCase();
                if (String(fileName).includes(String(navbarSearchValue).toLocaleLowerCase()) && allowExtensions.includes(pathSplittedBySlashByPoint[pathSplittedBySlashByPoint.length - 1])) {
                    filteredPaths.push(path);
                }
            }

            for (let index of Object.keys(ScriptCards)) {
                ScriptCards[index].setPlayPause(<BsFillPlayFill></BsFillPlayFill>);
                ScriptCards[index].setState(false);
                ScriptCards[index].setTimeTranscurred(0);
            }

            for (let index of Object.keys(audios)) {
                audios[index].pause();
                audios[index].currentTime = 0;
                if (audios[index].interval) {
                    clearInterval(audios[index].interval);
                }
                if (audios[index].timeout) {
                    clearTimeout(audios[index].timeout);
                }
            }

            onChangeCounter(filteredPaths.length);
            setFiles(filteredPaths);
        }
        start();

    }, [navbarSearchValue]);

    const ScriptCards = {};
    let audios = {};

    const saveScriptCard = (propierties) => {
        ScriptCards[propierties.index] = propierties;
    }

    const playAudio = async (propierties) => {

        console.log(propierties);

        for (let index of Object.keys(ScriptCards)) {
            if (index !== propierties.index) {
                ScriptCards[index].setPlayPause(<BsFillPlayFill></BsFillPlayFill>);
                ScriptCards[index].setState(false);
                ScriptCards[index].setTimeTranscurred(0);
            }
        }

        for (let index of Object.keys(audios)) {
            if (index !== propierties.index) {
                audios[index].pause();
                audios[index].currentTime = 0;
                if (audios[index].interval) {
                    clearInterval(audios[index].interval);
                }
                if (audios[index].timeout) {
                    clearTimeout(audios[index].timeout);
                }
            }
        }


        if (ScriptCards[propierties.index].state) {

            ScriptCards[propierties.index].setPlayPause(<BsFillPlayFill></BsFillPlayFill>);
            ScriptCards[propierties.index].setTimeTranscurred(0);

            audios[propierties.index].pause();
            audios[propierties.index].currentTime = 0;

            clearInterval(audios[propierties.index].interval);
            clearTimeout(audios[propierties.index].timeout);

        } else {

            console.log(propierties);
            audios[propierties.index] = new Audio(propierties.fileAudioUrl);//

            await new Promise((resolve, reject) => {
                audios[propierties.index].addEventListener("canplay", async () => {
                    resolve();
                });
            });

            audios[propierties.index].interval = setInterval(() => {
                ScriptCards[propierties.index].setTimeTranscurred(ScriptCards[propierties.index].timeTranscurred + 10 / 1000);
            }, 10);

            audios[propierties.index].timeout = setTimeout(() => {

                ScriptCards[propierties.index].setPlayPause(<BsFillPlayFill></BsFillPlayFill>);
                ScriptCards[propierties.index].setState(false);
                ScriptCards[propierties.index].setTimeTranscurred(0);

                clearInterval(audios[propierties.index].interval);
                clearTimeout(audios[propierties.index].timeout);
            }, audios[propierties.index].duration * 1000);

            ScriptCards[propierties.index].setDuration(audios[propierties.index].duration);
            ScriptCards[propierties.index].setPlayPause(<BsFillStopFill></BsFillStopFill>);
            audios[propierties.index].play();

        }
        ScriptCards[propierties.index].setState(!ScriptCards[propierties.index].state);

    };

    return (
        <>
            <div className="Scripts">
                {
                    files.map((path, index) => {
                        let extension = path.split(".")[path.split(".").length - 1];
                        if (allowExtensionsScript.includes(extension)) {

                            let pathSplittedBySlash = path.split("/");

                            let fileName = pathSplittedBySlash[pathSplittedBySlash.length - 1];
                            let fileUrl = urlFilesytem + path;

                            let fileNameWithoutExtension = path.split(".")[path.split(".").length - 2];
                            let itHasAudio = false;
                            let fileAudioUrl = "";
                            for(let extensionAudio of allowExtensionsAudio){
                                let possibleFileNamesExtensionAudio = `${fileNameWithoutExtension}.${extensionAudio}`;
                                if(files.includes(possibleFileNamesExtensionAudio)){
                                    itHasAudio = true;
                                    fileAudioUrl = `${urlFilesytem}${fileNameWithoutExtension}.${extensionAudio}`;
                                }
                            }

                            return <ScriptCard
                                key={index}
                                index={index}
                                fileName={fileName}
                                fileUrl={fileUrl}
                                itHasAudio={itHasAudio}
                                fileAudioUrl={fileAudioUrl}
                                playAudio={playAudio}
                                saveScriptCard={saveScriptCard}
                            ></ScriptCard>
                        }

                    })
                }
            </div>
        </>
    );
}