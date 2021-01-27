$(() => {
    $("#monitorStatus").prop("checked", localStorage.monitorStatus === "true");
    $("#monitorTimer").val(localStorage.monitorTimer);
});

$("#monitorStatus").on("change", () => {
    localStorage.monitorStatus = $("#monitorStatus").is(":checked");
});

$("#saveTimer").on("click", () => {
    if (parseInt($("#monitorTimer").val()) < 2000) $("#monitorTimer").val(2000);
    if (parseInt($("#monitorTimer").val()) > 5000) $("#monitorTimer").val(5000);

    localStorage.monitorTimer = $("#monitorTimer").val();
});
