

const messenger = (cmd, sender, callback) => {
        chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
            chrome.tabs.sendMessage(tabs[0].id, cmd, sender, result => {
                try {
                    if (!result) throw "empty";
                    return callback(null, result);
                } catch (error) {
                    return callback(error);
                }
            });
        });
    },
    apiUrl = {
        PRD: "https://accounts.sap.com/service/um",
        QA: "https://accounts400.sap.com/service/um"
    },
    apiTimeStamp = new Date().getTime(),
    apiPath = `?org=global&BasicAuthn=disabled&timestamp=${apiTimeStamp}`,
    buildCard = (data, type, url) => {
        $("#results").append(`
            <div class="col-sm-12">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">
                            ${data.display_name} (${data.uid})
                        </h5>
                        <p class="card-text">
                            TOTP: ${data.otp_enabled}
                        </p>
                        <p class="card-text">
                            Failed Login Attempts:
                            ${data.otp_failed_login_attempts}
                        </p>
                    </div>
                </div>
            </div>`);
    },
    processCodes = (codes, env) => {
        if (!codes) return;

        for (const key in codes) {
            if (!codes[key]) return;

            var apiURL = `${apiUrl[env]}/${codes[key].value}/${apiPath}`,
                tabURL = `https://accounts.sap.com/admin/#/users/${codes[key].value}/authentication/tfa`;

            axios
                .get(apiURL)
                .then(result => {
                    buildCard(result.data, null, tabURL);
                    $("#loading").addClass("d-none");
                    $("#error").addClass("d-none");
                    $("#environment").text(`${apiUrl[env]}`);
                })
                .catch(error => {
                    $("#loading").addClass("d-none");
                    $("#error").removeClass("d-none");
                });
        }
    },
    getCodes = env => {
        messenger("getCodes", null, async (err, res) => {
            console.log("getCodes", res);

            if (err || res.length == 0) {
                $("#loading").addClass("d-none");
                $("#error").removeClass("d-none");

                return;
            }

            processCodes(res, env);
        });
    },
    init = () => {
        $("#monitorStatus").prop(
            "checked",
            localStorage.monitorStatus === "true"
        );
        $("#monitorTimer").val(localStorage.monitorTimer);

        $("#loading").removeClass("d-none");
        $("#error").addClass("d-none");

        getCodes("PRD");
    };

$(() => {
    init();
});

$("#monitorStatus").on("change", () => {
    localStorage.monitorStatus = $("#monitorStatus").is(":checked");
});

$("#saveTimer").on("click", () => {
    if (parseInt($("#monitorTimer").val()) < 2000) $("#monitorTimer").val(2000);
    if (parseInt($("#monitorTimer").val()) > 5000) $("#monitorTimer").val(5000);

    localStorage.monitorTimer = $("#monitorTimer").val();
});
