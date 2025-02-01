// Run after the document is fully loaded
        window.onload = function() {
            // Find the script tag by its ID and remove it
            var script = document.getElementById('myScript');
            if (script) {
                script.parentNode.removeChild(script);
            }
        };
