/* Variabel untuk mengubah biner 0 menjadi spasi dan biner 1 menjadi tab */
var w_zero = ' ';
var w_one = '\t';

function escapeRegExp(str) {
    return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

/* Fungsi mereplace biner */
function replaceAll(str, find, replace) {
    return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

/* based on stackoverflow.com/questions/14430633/how-to-convert-text-to-binary-code-in-javascript */
function binToText(str) {
    var str = replaceAll(replaceAll(str, w_one, "1"), w_zero, "0");
    if(str.match(/[10]{8}/g)){
        var wordFromBinary = str.match(/([10]{8}|\s+)/g).map(function(fromBinary){
            return String.fromCharCode(parseInt(fromBinary, 2) );
        }).join('');
        return wordFromBinary;
    }
}

/* based on stackoverflow.com/questions/21354235/converting-binary-to-text-using-javascript */
function textToBin(text) {
	var output = '';
  var length = text.length,
      output = [];
  for (var i = 0;i < length; i++) {
    var bin = text[i].charCodeAt().toString(2);
    output.push(Array(8-bin.length+1).join("0") + bin);
  }
  return output.join('');
}
$('#btn_embed').click(function(){
    embed();
});
/* Fungsi Embed */
function embed(){
    var secretMsg = $('#secret').val();
    var addMsg = $('#additional').val();
    var encKey = $('#keyenc').val();
    var output = '';

    console.log(secretMsg);
    console.log(encKey);
    var encMsg = CryptoJS.AES.encrypt(secretMsg, encKey).toString();
    console.log(encMsg);
    var binText = textToBin(encodeURIComponent(encMsg));
    console.log(binText);
    var ws = replaceAll(replaceAll(binText.toString(), "1", w_one), "0", w_zero)
    console.log(ws);
    var lengt = ws.length;
    console.log(lengt);
    toFile("Message.txt", ws, addMsg);
}

function toFile(filename, secret, add){
    var element = document.createElement('a');
    if (add=="") {
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(secret));
    }else{
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(add +"\n" + secret));
    }
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

$('#btn_extract').click(function(){
    getFile();
});

function getFile(){
    var file = document.getElementById('is_file').files[0];
    var decKey = $('#keydec').val();

    if (file==0) {
        alert("Stego file not found !");
    }else{
        let reader = new FileReader();

        reader.onload = (event) => {
            const file = event.target.result;
            const allLines = file.split(/\r\n|\n/);
            // Reading line by line
            allLines.forEach((line) => {
                console.log(line);
            });
            
            var scrMsg = allLines.pop();
            console.log(scrMsg);
            var scr = replaceAll(replaceAll(scrMsg, w_one, "1"), w_zero, "0");
            console.log(scr);
            console.log(decodeURIComponent(binToText(scr)));
            var final = decodeURIComponent(binToText(scr));
            var msg = CryptoJS.AES.decrypt(final, decKey).toString(CryptoJS.enc.Utf8);
            console.log(msg);
            toFile("Secret Message.txt", msg, "");
        };

        reader.onerror = (event) => {
            alert(event.target.error.name);
        };
        reader.readAsText(file);
    }
}