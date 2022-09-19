# Span front end coding challenge

The React application will run locally with <b>npm start</b>. There are no dependencies on external data sources etc.


## Design choices

1. To mimic the Smart TV interface the application handles events for the arrow keys (representing standard TV remote control interfaces). Mouse-based interaction is, of course, also supported but note that once the mouse has been used the keyboard-based flow may be broken.

2. While I understand the given requirement for the Topics menu to disappear when the images panel has focus I found this behaviour be to somewhat jarring and have left the Topics menu in place with the selected topic highlighted to give context to the images.

3. Since the target device is a TV - responsiveness is limited. I have used a (rather bloated) Bootstrap CSS (<b>styles.css</b> so that flexbox is implemented - but behaviour in low resolutions is erratic.


## Implementation choices

1. In order to support animated scrolling I gave up on using <b>scroll-snap_type: inline mandatory</b>. The scroll event therefore has an absolute scroll distance which is not ideal and could break responsiveness.

2. In general state has been lifted to the Application component

3. The use of \<figure> and \<picture> tags to contain images is arguably spurious given that the solution is not aiming at broad responsiveness.

4.  I used and modified post-compiled CSS (<b>imageGrid.css</b>) rather than adding the complexity of a PostCSS dependency to my project.


## Acknowledgements

As a starting point for the horizontal scrolling I referred to a codepen by <a href='https://codepen.io/argyleink'>Adam Argyle</a>.

