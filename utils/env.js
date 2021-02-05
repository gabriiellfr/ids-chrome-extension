// tiny wrapper with default env vars
module.exports = {
    node_env: process.env.NODE_ENV.trim() || "development",
    port: process.env.PORT || 3000,
    production: {
        adm: {
            url: "https://accounts.sap.com",
            path_api: {
                begin: "service/um",
                end: "?org=global&BasicAuthn=disabled&timestamp"
            },
            path_web: "admin/#/users",
            elements: {
                searchbtn: { id: "SEARCH_BTN", field: "innerText" },
                codes: [
                    {
                        name: "Reporter",
                        input: "zbtpartnerrep_struct.partner_no",
                        field: "innerHTML"
                    },
                    {
                        name: "Requester",
                        input: "zbtpartnerreq_struct.partner_no",
                        field: "innerHTML"
                    }
                ]
            }
        }
    },
    development: {
        adm: {
            url: "https://accounts400.sap.com",
            path_api: {
                begin: "service/um",
                end: "?org=global&BasicAuthn=disabled&timestamp"
            },
            path_web: "admin/#/users",
            elements: {
                searchbtn: { id: "SEARCH_BTN", field: "value" },
                codes: [
                    {
                        name: "Reporter",
                        input: "zbtpartnerrep_struct.partner_no",
                        field: "value"
                    },
                    {
                        name: "Requester",
                        input: "zbtpartnerreq_struct.partner_no",
                        field: "value"
                    }
                ]
            }
        }
    }
};
