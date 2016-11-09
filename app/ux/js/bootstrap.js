var Segment = require("segment");
var pinyin = require("pinyin");
var segment = new Segment();

segment.useDefault();

var punctReplace = {
  '。': '.',
  '，': ',',
  '！': '!'
}

function convertToPinyin(content) {
  var input = content || "";
  var output = input
    .split('\n')
    .map(function(line) {
      return line
        .split(' ')
        .map(function(token) {
          return segment
            .doSegment(token, { simple: true })
            .map(function(word) {
              var pinyinToken = pinyin(word).join('');
              if (pinyinToken != word) {
                pinyinToken += " ";
              }
              return pinyinToken;
            })
            .join('');
        })
        .join(' ');
    })
    .join('\n');
  return output
    .replace(/。/g, '. ')
    .replace(/，/g, ', ')
    .replace(/：/g, ': ')
    .replace(/！/g, '! ')
    .replace(/\s\./g, '. ')
    .replace(/\s\,/g, ', ')
    .replace(/\s\:/g, ': ')
    .replace(/\s\!/g, '! ')
    .replace(/\s\s/g, ' ')
    .replace(/\s\n/g, '\n');
}

// Init editors...
tinymce.init({
  selector: '.editable#input',
  theme: 'inlite',
  inline: true,
  menubar: false,
  elementpath: false,
  statusbar: false,
  init_instance_callback: function (editor) {
    editor.on('SetContent', function (e) {
      var pinyinString = convertToPinyin($(this.bodyElement).html());
      $('#output').html(pinyinString);
    });
    editor.on('Change', function (e) {
      var pinyinString = convertToPinyin($(this.bodyElement).html());
      $('#output').html(pinyinString);
    });
  }
});
tinymce.init({
  selector: '.editable#output',
  inline: true,
  menubar: false,
  toolbar: false,
  elementpath: false,
  statusbar: false
});
