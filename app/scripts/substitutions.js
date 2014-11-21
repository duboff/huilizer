chrome.runtime.sendMessage("config", function(response) {
    "use strict";
    function matchCase(text, pattern) {
        var result = '';
        for (var i = 0; i < text.length; i++) {
            var c = text.charAt(i);
            var p = pattern.charCodeAt(i);
            if (p === 1055) {
                result += c.toUpperCase();
            } else {
                result += c;
            }
        }
        return result;
    }
    var substitute = (function() {
        "use strict";
        var replacements, ignore, i, replacementsObject, firstOriginal, secondOriginal;
        replacements = [
            ['Putin', 'Khuilo'],
            ['Putins', 'Khuilos'],
            ['Путина', 'Хуйла'],
            ['Путине', 'Хуйле'],
            ['Путину', 'Хуйлу'],
            ['Пу́тин', 'Хуйло́'],
            ['Путин', 'Хуйло'],
        ].concat(response);
        replacementsObject = [];
        for (i = replacements.length - 1; i >= 0; i--) {
            firstOriginal = new RegExp("(?:^)" + replacements[i][0], "gi");
            secondOriginal = new RegExp("(?:\\s)" + replacements[i][0], "gi");
            replacementsObject.push([firstOriginal, replacements[i][1]]);
            replacementsObject.push([secondOriginal, " " + replacements[i][1]]);
        }
        return function(node) {
            var i;
            var ignore = {
                "STYLE": 0,
                "SCRIPT": 0,
                "NOSCRIPT": 0,
                "IFRAME": 0,
                "OBJECT": 0,
                "INPUT": 0,
                "FORM": 0,
                "TEXTAREA": 0
            };
            if (node.tagName in ignore) {
                return;
            }
            for (i = replacementsObject.length - 1; i >= 0; i--) {
                node.nodeValue = node.nodeValue.replace(replacementsObject[i][0], function(match) {
                    return matchCase(replacementsObject[i][1], match);
                });
            }
        };
    })();

    var node, iter;
    var iter = document.createNodeIterator(document.body, NodeFilter.SHOW_TEXT);
    while ((node = iter.nextNode())) {
        substitute(node);
    }
});