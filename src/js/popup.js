console.log("popup script loaded!!");

import $ from "jquery";
import utils from "./plugins/utils";

import "../css/popup.css";

const init = () => {
        $("#monitorStatus").prop(
            "checked",
            localStorage.monitorStatus === "true"
        );
        $("#monitorTimer").val(localStorage.monitorTimer);

        $("#loading").removeClass("d-none");
        $("#error").addClass("d-none");

        $("#monitorStatus").on("change", () => {
            localStorage.monitorStatus = $("#monitorStatus").is(":checked");
        });

        $("#saveTimer").on("click", () => {
            if (parseInt($("#monitorTimer").val()) < 2000)
                $("#monitorTimer").val(2000);
            if (parseInt($("#monitorTimer").val()) > 5000)
                $("#monitorTimer").val(5000);

            localStorage.monitorTimer = $("#monitorTimer").val();
        });
    },
    fn = (env, dev) => {
        utils.getUsersId(env, (err, codes) => {
            if (err) {
                $("#loading").addClass("d-none");
                $("#error").removeClass("d-none");

                return;
            }

            utils.getProfiles(codes, env, dev, (err, profiles) => {
                $("#loading").addClass("d-none");
                if (err) $("#error").removeClass("d-none");

                if (!utils.buildCards(profiles, env))
                    $("#error").removeClass("d-none");
            });
        });
    };

$(() => {
    init();

    fn("PRD", false);
    fn("QA", false);
});
