console.log('script is running');

let numberOfOctaves = 3;
const octaveWidth = 560;

const pianoSVG = `<svg
    width="100%"
    viewBox="0 0 ${ numberOfOctaves * octaveWidth } 400"
    version="1.1" 
    xmlns="http://www.w3.org/2000/svg" 
    xmlns:xlink="http://www.w3.org/1999/xlink"
>
    <g id="piano-keyboard">
    </g>
</svg>`;


const piano = document.querySelector("#piano");

const app = {
    setupPiano () {
        //Add main SVG to piano div
        piano.innerHTML = pianoSVG;
        const pianoKeyboard = document.querySelector("#piano-keyboard");

        //Create octaves
        for (let i = 0; i < numberOfOctaves; i++) {
            const octave = utils.createSVGElement("g");
            octave.classList.add("ocatave");
            octave.setAttribute("transform", `translate(${ i * octaveWidth }, 0)`);

            let whiteKeyXPosition = 0;
            let blackKeyXPosition = 60;

            //Add white keys to octave
            for (let i = 0; i < 7; i++) {
                const whiteKey = utils.createSVGElement("rect");
                whiteKey.classList.add("white-key");
                whiteKey.setAttribute("x", whiteKeyXPosition);
                whiteKey.setAttribute("width", 80);
                whiteKey.setAttribute("height", 400);
                whiteKeyXPosition += 80;
                octave.appendChild(whiteKey);
            }
            //Add black keys to octave
            for (let i = 0; i < 5; i++){
                const blackKey = utils.createSVGElement("rect");
                blackKey.classList.add("black-key");
                blackKey.setAttribute("x", blackKeyXPosition);
                blackKey.setAttribute("width", 40);
                blackKey.setAttribute("height", 250);

                if (i === 1) {
                    blackKeyXPosition += 160;
                } else {
                    blackKeyXPosition += 80;
                }
                octave.appendChild(blackKey);
            }

            pianoKeyboard.appendChild(octave);
        }
    }
}

const utils = {
    createSVGElement(el) {
        const element = document.createElementNS("http://www.w3.org/2000/svg", el);
        return element;
    }
}

app.setupPiano();