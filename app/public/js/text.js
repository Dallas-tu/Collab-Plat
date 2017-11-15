$(document).ready(function () {

    var editor = CodeMirror.fromTextArea(document.getElementById("textit"), {
        mode: 'gfm',
        lineNumbers: true
    });

    editor.setSize(600, 490);
    editor.setTheme("monokai");

    var socket = io.connect();

    socket.on('refresh-text', function (data) {
        editor.setValue(data.body);
    });

    socket.on('change-text', function (data) {
        console.log(data);
        editor.replaceRange(data.text, data.from, data.to);
    });

    editor.on('change', function (i, op) {
        console.log(op);
        socket.emit('change-text', op);
        socket.emit('refresh-text', editor.getValue());
    });

})