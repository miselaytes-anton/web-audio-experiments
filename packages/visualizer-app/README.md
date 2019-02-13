# Visualizer app

Some experiments with visualizing music and speech using Web Audio and Canvas. [Meyda.js][1] in used to extract audio features.

## Angry rays

Each ray length is controlled by how much of certain frequency there is in the signal (FFT coefficients). 
Other parameters like circle radius and "zig-zagginess" of the rays are based on RMS.

![angry rays screenshot](./angry-rays.png)

## Voice shape

The idea here is to create a shape which represents voice characteristics. Each angle of the shape shows a [Mel coefficient][2].
These are often used in speaker recognition. Shape color is defined by how high or low the voice is ([spectral centroid]([3])). 
Finally shape size is based on perceived loudness of the sound.

![voice shape screenshot](./voice-shape.png)

[1]: https://meyda.js.org/audio-features
[2]: http://practicalcryptography.com/miscellaneous/machine-learning/guide-mel-frequency-cepstral-coefficients-mfccs
[3]: https://en.wikipedia.org/wiki/Spectral_centroid
