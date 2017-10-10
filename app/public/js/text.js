var editor = CodeMirror.fromTextArea(document.getElementById("textit"), {
    mode: 'gfm',
    lineNumbers: true,
    theme: "ambiance"
  });

socket.on('refresh-text', function (data) {
    editor.setValue(data.body);
});
socket.on('change-text', function (data) {
    console.log(data);
    editor.replaceRange(data.text, data.from, data.to);
});
editor.on('change-text', function (i, op) {
    console.log(op);
    socket.emit('change-text', op);
    socket.emit('refresh-text', editor.getValue());
});