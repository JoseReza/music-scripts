
import "./script-card.css";
import React, { useState } from "react";
import { BsFillPlayFill } from "react-icons/bs";

export const ScriptCard = ({ index, fileName, fileUrl, playAudio, saveScriptCard, itHasAudio, fileAudioUrl}) => {

    let urlFilesytem = (process.env.NODE_ENV === "production" ? process.env.REACT_APP_FILESYSTEM_HOST_PRODUCTION : process.env.REACT_APP_FILESYSTEM_HOST_DEVELOPMENT);

    const [playPause, setPlayPause] = useState(<BsFillPlayFill></BsFillPlayFill>);
    const [state, setState] = useState(false);
    const [duration, setDuration] = useState(0);
    const [timeTranscurred, setTimeTranscurred] = useState(0);

    let propierties = {
        index,
        playPause,
        setPlayPause,
        state,
        setState,
        duration,
        setDuration,
        timeTranscurred,
        setTimeTranscurred,
        fileName,
        fileUrl,
        fileAudioUrl
    };

    saveScriptCard(propierties);

    const downloadScript = async (event, fileName) => {
        let aLink = document.createElement("a");

        const textContent = await (await fetch(`${urlFilesytem}/filesystem/${fileName}`)).text();
        const blob = new Blob([textContent], { type: 'application/json' });

        aLink.href = URL.createObjectURL(blob);
        aLink.download = fileName;
        aLink.click();
    }

    return (<>
        <div className="Scripts-card">
            <div style={{ minHeight: "4rem", maxHeight: "4rem", wordBreak: "break-all" }}>
                <b>{fileName}</b>
            </div>
            {
                (function () {
                    if (itHasAudio) {
                        return (
                            <>
                                <div>
                                    <div style={{ fontSize: "2rem" }} onClick={() => playAudio(propierties)}>
                                        {playPause}
                                    </div>
                                    <progress style={{ width: "8rem" }} value={timeTranscurred} max={duration}></progress>
                                </div>
                                <p>{Number(timeTranscurred).toFixed(1)}s/{Number(duration).toFixed(1)}s</p>
                            </>
                        )
                    }
                })()
            }
            <div
                style={{ borderRadius: "5px", backgroundColor: "orange", color: "white", cursor: "pointer", marginTop: "1rem" }}
                onClick={(event) => { downloadScript(event, fileName) }}
            >Download script</div>
            <br></br>
        </div>
    </>);
}