# BBCode Integration

"Ask @lvkaszus!" Project has built-in BBCode support that can format text inside questions and answers. This is done temporarily (for now) by using regular expressions and placing HTML Code inside elements using `dangerouslySetInnerHTML` in React and sanitizing input in Python backend. All done by myself - I was trying to find a suitable library for this, but `react-bbcode` or other libraries like this we're not working in my project 😢 

This is not a good idea for long-term usage, but in the next release - I will replace this with `BBob` React library thanks to my friend from school named <a href="https://github.com/Bazyli12">@Bazyli12</a> for providing me a nice template for using this library inside React projects! ❤️

## What is BBCode?

BBCode is an easy way to format text such as <u>underlining</u>, <b>bolding</b> or <i>italicizing</i> and allows in this project to insert YouTube videos and map locations in the form of geographic coordinates. Also there is automatic URL detection system in questions sent by people using your application based on this project!

For example:
- Paste any URL to question form or reply form and when the question or answer has been sent, it automatically transforms this URL it into clickable link in user interface.

## What BBCodes are supported?

There are several BBCodes supported in this app:

- `[b]Bold Text[/b]` - Makes the text in the question that is in the [b] and [/b] tags bold like this: <b>Bold text!</b>

- `[u]Underlined Text[/u]` - Makes the text in the question that is in the [u] and [/u] tags underlined like this: <u>Underlined Text!</u>

- `[i]Italicized text[/i]` - Makes the text in the question that is in the [u] and [/u] tags italicized like this: <i>Italicized Text!</i>

Special BBCodes:

- `[yt]Link to YouTube video[/yt]` - Inserts a YouTube video in the question that is in the [yt] and [/yt] tags. You can check it yourself by self-hosting this project on your own and having fun with it!

- `[location:Latitude,Longtitude]` - Inserts a location on map by specifying latitude and longtitude in the [location] tag. You can also check it by yourself when self-hosting this project on your own and having fun with it!

## How to use them inside questions and answers?

It's pretty easy to use them inside your questions and/or answers! Just type your question or answer like you would do it normally, but type additional things in question/reply form like this:

- `This is a question with [b]bold text inside![/b]`

   It will look like this after submitting: This is a question with <b>bold text inside!</b>

## And how to use Special BBCodes like YouTube video embed or map location?

You also write your question or answer like you would normally do, but with `[yt]Link to YouTube Video[/yt]` tags inside!

- `Check out this new video! [yt]https://youtube.com/watch?v=ABCD1234[/yt]`

   This will send your question or answer like a normal message but with YouTube Player that plays your video under submitted question/answer!


Using Map Location is also straight-forward! Just get your selected location latitude and longtitude numbers from the Internet and write your question/answer just like this:

- `Check out this place! [location:52.237049,21.017532]`

   This will send your question or answer like a normal message but with location on OpenStreetMaps that shows city of Warsaw in Poland!