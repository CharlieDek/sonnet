const gptFunParam = atob('aHR0cHM6Ly8zendtcmV5czJ5cm53czVlNzJmeDczY3JtYTBod2d1cy5sYW1iZGEtdXJsLnVzLWVhc3QtMi5vbi5hd3M=');
var g_state = {
    loadingSonnet: false,
};

$("#subject").focus();

function processSonnetRes(res) {
    let sonnetText = res.replace(/(?:\r\n|\r|\n)/g, '<br>');
    $("#sonnet_text").html(sonnetText);
    g_state.loadingSonnet = false;
}

function hitGptFunForSonnet(requestBody) {
    console.log(requestBody);
    const request = new XMLHttpRequest();
    request.open("POST", gptFunParam);
        request.addEventListener("load", () => {
            if (request.status == 200) {
                let res = JSON.parse(request.responseText);
                console.log(res);
                if (res.error) {
                    console.log("Some error in res: " + res.error);
                } else {
                    processSonnetRes(res);
                }
            } else {
                console.log(request);
            }
        });
    request.send(requestBody);
}

function makeSonnetReq(poet, style, subject) {
    const body = JSON.stringify({
        "sonnet": {
            "simple_draft": {
                "poet": poet,
                "style": style,
                "subject": subject,
            }
        }
    }, null, 4);
    hitGptFunForSonnet(body);
}

$("#sonnet_btn").click(function() {
    if (!g_state.loadingSonnet) {
        const poet = $("#poetSelect").val();
        const subject = $("#subject").val();
        const style = $("#style").val();
        console.log(poet);
        console.log(subject);
        console.log(style);
        if (!poet) {
            return;
        } else if (!style) {
            return;
        } else if (!subject) {
            return;
        }
        // $("#subject").val("");
        // $("#style").val("");
        $("#optionsTable").hide();
        $("#sonnet_btn").hide();
        $("#sonnet_text").html("Loading...");
        g_state.loadingSonnet = true;
        makeSonnetReq(poet, style, subject);
    }
});