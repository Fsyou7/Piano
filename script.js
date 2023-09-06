console.log('script is running');

let numberOfOctaves = 4;
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
            const octave = this.createOctave(i);

            let whiteKeyXPosition = 0;
            let blackKeyXPosition = 60;

            //Add white keys to octave
            for (let i = 0; i < 7; i++) {
                const whiteKey = this.createKey({ className: "white-key", width: 80, height: 400});
                whiteKey.setAttribute("x", whiteKeyXPosition);
                whiteKeyXPosition += 80;
                octave.appendChild(whiteKey);
            }
            //Add black keys to octave
            for (let i = 0; i < 5; i++){
                const blackKey = this.createKey({ className: "black-key", width: 40, height: 250});
                blackKey.setAttribute("x", blackKeyXPosition);
                if (i === 1) {
                    blackKeyXPosition += 160;
                } else {
                    blackKeyXPosition += 80;
                }
                octave.appendChild(blackKey);
            }

            pianoKeyboard.appendChild(octave);
        }
    },
    createOctave (octaveNumber) {
        const octave = utils.createSVGElement("g");
        octave.classList.add("ocatave");

        octave.setAttribute("transform", `translate(${ octaveNumber * octaveWidth }, 0)`);
        return octave; 
    },
    createKey ({className, width, height}) {
        const key = utils.createSVGElement("rect");
        key.classList.add(className);
        key.setAttribute("width", width);
        key.setAttribute("height", height);
        return key;
    }
}

const utils = {
    createSVGElement(el) {
        const element = document.createElementNS("http://www.w3.org/2000/svg", el);
        return element;
    }
}

app.setupPiano();